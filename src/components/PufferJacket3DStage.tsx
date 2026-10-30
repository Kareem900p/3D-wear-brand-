import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import gsap from 'gsap';
import {
  ASSET_PATHS,
  PRODUCT_VARIANTS,
  ProductVariant,
  VariantId,
  clampParallaxOffset,
  getVariantById,
} from '../utils/variantLogic';

interface PufferJacket3DStageProps {
  activeVariant: ProductVariant;
  reducedMotion: boolean;
  forceFallback: boolean;
  resetTrigger: number;
  onRotationChange: (isRotated: boolean) => void;
  onModelStatusChange?: (status: 'loading' | 'ready' | 'fallback') => void;
}

/**
 * Creates a soft radial contact shadow texture in memory (zero external dependency).
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(128, 128, 12, 128, 128, 120);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.58)');
    gradient.addColorStop(0.45, 'rgba(0, 0, 0, 0.28)');
    gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.06)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const PufferJacket3DStage: React.FC<PufferJacket3DStageProps> = ({
  activeVariant,
  reducedMotion,
  forceFallback,
  resetTrigger,
  onRotationChange,
  onModelStatusChange,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fallbackImgRef = useRef<HTMLImageElement | null>(null);

  const [webglStatus, setWebglStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isDragging, setIsDragging] = useState(false);

  // Refs for mutable state inside requestAnimationFrame without re-mounting WebGLRenderer
  const activeVariantIdRef = useRef<VariantId>(activeVariant.id);
  const reducedMotionRef = useRef<boolean>(reducedMotion);
  const pointerNormRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragAngleRef = useRef<{ yaw: number; pitch: number }>({ yaw: 0, pitch: 0 });
  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);

  // Scene object refs for GSAP variant choreography
  const jacketGroupRef = useRef<THREE.Group | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const materialsByVariantRef = useRef<Record<VariantId, THREE.MeshStandardMaterial> | null>(null);
  const gltfSceneRef = useRef<THREE.Object3D | null>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  // Reset user drag rotation when requested
  useEffect(() => {
    if (resetTrigger === 0) return;
    if (reducedMotionRef.current) {
      dragAngleRef.current.yaw = 0;
      dragAngleRef.current.pitch = 0;
      onRotationChange(false);
      requestRenderRef.current?.();
      return;
    }
    gsap.to(dragAngleRef.current, {
      yaw: 0,
      pitch: 0,
      duration: 0.55,
      ease: 'power3.out',
      onUpdate: () => {
        requestRenderRef.current?.();
      },
      onComplete: () => {
        onRotationChange(false);
      },
    });
  }, [resetTrigger, onRotationChange]);

  // Initialize Three.js WebGLRenderer, studio lighting, GLB model & variant PBR materials once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    let frameId = 0;

    // Detect software WebGL (SwiftShader / llvmpipe) per threejs skill
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl =
          probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglStatus('error');
      onModelStatusChange?.('fallback');
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    const isMobileViewport = window.innerWidth < 768;
    const maxDpr = isSoftwareGl ? 1 : isMobileViewport ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = Math.max(container.clientWidth, 300);
    const height = Math.max(container.clientHeight, 300);
    renderer.setSize(width, height, false);
    renderer.domElement.className = 'w-full h-full block select-none';
    renderer.domElement.setAttribute('data-testid', 'puffer-webgl-canvas');

    // Clear container and mount canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Front-facing camera matching README.md spec ([0, 0, 2.35])
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 20);
    camera.position.set(0, 0.02, 2.32);
    camera.lookAt(0, 0, 0);

    // Studio Environment Reflection (RoomEnvironment immediate + studio-softbox.hdr upgrade)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const fallbackEnvTexture = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    scene.environment = fallbackEnvTexture;

    // Load local studio-softbox.hdr via HDRLoader
    const hdrLoader = new HDRLoader();
    hdrLoader.load(
      ASSET_PATHS.studioHdr,
      (hdrTex) => {
        if (isDisposed) {
          hdrTex.dispose();
          return;
        }
        const envMap = pmremGenerator.fromEquirectangular(hdrTex).texture;
        scene.environment = envMap;
        hdrTex.dispose();
        requestRender();
      },
      undefined,
      () => {
        // Keep RoomEnvironment fallback silently
      }
    );

    // 3-Point Studio Lighting Rig (Warm Key, Cool Hemisphere Fill, Subtle Back Rim)
    const hemiLight = new THREE.HemisphereLight(0xfff5ed, 0x261a14, 0.82);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff3e6, 1.75);
    keyLight.position.set(1.6, 2.4, 2.6);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 8;
      const d = 1.2;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xdce8ff, 0.68);
    fillLight.position.set(-2.2, 0.6, 1.8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.95);
    rimLight.position.set(0.2, 1.8, -2.2);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    // Parent group for animated entrance, variant transitions, idle float & parallax
    const jacketGroup = new THREE.Group();
    scene.add(jacketGroup);
    jacketGroupRef.current = jacketGroup;

    // Coherent soft contact shadow plane beneath the jacket
    const shadowTexture = createContactShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(1.65, 0.72);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.56, -0.05);
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // Preload standalone local WebP textures & build calibrated PBR materials for all 3 variants
    const texLoader = new THREE.TextureLoader();
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const loadTex = (url: string, isColor: boolean): Promise<THREE.Texture> =>
      new Promise((resolve, reject) => {
        texLoader.load(
          url,
          (t) => {
            t.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
            t.flipY = false; // glTF UV convention
            t.anisotropy = maxAnisotropy;
            t.needsUpdate = true;
            resolve(t);
          },
          undefined,
          reject
        );
      });

    // Software-WebGL-safe frame scheduling (per threejs skill)
    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (isDisposed) return;
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    const startTime = performance.now();
    let currentRotX = 0;
    let currentRotY = 0;
    let currentPosX = 0;
    let currentPosY = 0;

    function renderFrame() {
      if (isDisposed) return;

      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      const isReduced = reducedMotionRef.current;
      const parallax = isReduced
        ? { offsetX: 0, offsetY: 0, rotX: 0, rotY: 0 }
        : clampParallaxOffset(pointerNormRef.current.x, pointerNormRef.current.y, 0.05, 0.14);

      const idleFloatY = isReduced || isSoftwareGl ? 0 : Math.sin(elapsed * 1.7) * 0.022;
      const idleRotZ = isReduced || isSoftwareGl ? 0 : Math.cos(elapsed * 1.1) * 0.012;

      const targetRotY = parallax.rotY + dragAngleRef.current.yaw;
      const targetRotX = parallax.rotX + dragAngleRef.current.pitch;
      const targetPosX = parallax.offsetX;
      const targetPosY = parallax.offsetY + idleFloatY;

      const dampFactor = isReduced ? 1 : 0.14;
      currentRotY += (targetRotY - currentRotY) * dampFactor;
      currentRotX += (targetRotX - currentRotX) * dampFactor;
      currentPosX += (targetPosX - currentPosX) * dampFactor;
      currentPosY += (targetPosY - currentPosY) * dampFactor;

      if (gltfSceneRef.current) {
        gltfSceneRef.current.rotation.y = currentRotY;
        gltfSceneRef.current.rotation.x = currentRotX;
        gltfSceneRef.current.rotation.z = idleRotZ;
        gltfSceneRef.current.position.x = currentPosX;
        gltfSceneRef.current.position.y = currentPosY;
      }

      if (shadowMeshRef.current && jacketGroupRef.current) {
        const groupScale = jacketGroupRef.current.scale.x;
        const floatScale = 1 - currentPosY * 0.6;
        shadowMeshRef.current.scale.setScalar(Math.max(0.6, groupScale * floatScale));
        shadowMeshRef.current.position.x = currentPosX * 0.65;
      }

      renderer.render(scene, camera);
    }

    let renderBusy = false;
    let renderDirty = false;
    function requestRender() {
      if (isDisposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (isDisposed) return;
        renderDirty = false;
        renderFrame();
        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }
    requestRenderRef.current = requestRender;

    // Continuous loop on hardware GPU when reduced motion is off; on-demand on software WebGL
    function startLoop() {
      if (isDisposed) return;
      if (isSoftwareGl) {
        requestRender();
        return;
      }
      const tick = () => {
        if (isDisposed) return;
        renderFrame();
        frameId = requestAnimationFrame(tick);
      };
      frameId = requestAnimationFrame(tick);
    }

    // Load GLB + standalone textures
    const gltfLoader = new GLTFLoader();

    Promise.all([
      new Promise<any>((resolve, reject) => {
        gltfLoader.load(ASSET_PATHS.glbModel, resolve, undefined, reject);
      }),
      loadTex(PRODUCT_VARIANTS[0].baseColorTexturePath, true),
      loadTex(PRODUCT_VARIANTS[1].baseColorTexturePath, true),
      loadTex(PRODUCT_VARIANTS[2].baseColorTexturePath, true),
      loadTex(PRODUCT_VARIANTS[0].normalTexturePath, false),
      loadTex(PRODUCT_VARIANTS[0].ormTexturePath, false),
    ])
      .then(([gltf, orangeMap, oliveMap, pearlMap, normalMap, ormMap]) => {
        if (isDisposed) return;

        const buildVariantMaterial = (
          baseMap: THREE.Texture,
          name: string,
          roughnessVal: number,
          tintHex: number
        ) => {
          return new THREE.MeshStandardMaterial({
            name,
            color: tintHex,
            map: baseMap,
            normalMap,
            normalScale: new THREE.Vector2(0.28, 0.28),
            roughnessMap: ormMap,
            metalnessMap: ormMap,
            aoMap: ormMap,
            aoMapIntensity: 0.9,
            roughness: roughnessVal,
            metalness: 0.05,
            envMapIntensity: 0.55,
          });
        };

        const materialsMap: Record<VariantId, THREE.MeshStandardMaterial> = {
          orange: buildVariantMaterial(orangeMap, 'Puffer_Orange', 0.54, 0xfff5ee),
          olive: buildVariantMaterial(oliveMap, 'Puffer_Olive', 0.58, 0xf2ebd9),
          pearl: buildVariantMaterial(pearlMap, 'Puffer_Pearl', 0.5, 0xe8e4f0),
        };
        materialsByVariantRef.current = materialsMap;

        const model = gltf.scene as THREE.Group;

        // Center & normalize bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSpan = 1.62;
        const normalizedScale = maxDim > 0 ? targetSpan / maxDim : 1;

        const modelHolder = new THREE.Group();
        model.scale.setScalar(normalizedScale);
        modelHolder.add(model);

        const initialMat = materialsMap[activeVariantIdRef.current] || materialsMap.orange;
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = !isSoftwareGl;
            child.receiveShadow = !isSoftwareGl;
            if (
              child.geometry &&
              child.geometry.attributes.uv &&
              !child.geometry.attributes.uv2
            ) {
              child.geometry.setAttribute('uv2', child.geometry.attributes.uv);
            }
            child.material = initialMat;
          }
        });

        jacketGroup.add(modelHolder);
        gltfSceneRef.current = modelHolder;

        if (!isSoftwareGl) {
          renderer.compile(scene, camera);
        }

        // Initial hero product entrance animation (0.9 -> 1.0 with subtle vertical settle)
        if (reducedMotionRef.current) {
          jacketGroup.scale.setScalar(1);
          jacketGroup.position.set(0, 0, 0);
          requestRender();
        } else {
          jacketGroup.scale.setScalar(0.89);
          jacketGroup.position.set(0, -0.06, 0);
          gsap.to(jacketGroup.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.95,
            ease: 'back.out(1.35)',
            onUpdate: () => requestRender(),
          });
          gsap.to(jacketGroup.position, {
            y: 0,
            duration: 0.95,
            ease: 'power3.out',
            onUpdate: () => requestRender(),
          });
        }

        setWebglStatus('ready');
        onModelStatusChange?.('ready');
        startLoop();
      })
      .catch((err) => {
        console.warn('3D GLB load fallback triggered:', err);
        if (!isDisposed) {
          setWebglStatus('error');
          onModelStatusChange?.('fallback');
        }
      });

    // Responsive ResizeObserver
    const handleResize = () => {
      if (isDisposed || !mountRef.current) return;
      const w = Math.max(mountRef.current.clientWidth, 260);
      const h = Math.max(mountRef.current.clientHeight, 260);
      camera.aspect = w / h;
      // Adjust camera distance slightly on narrow portrait screens so the wide sleeves never clip
      camera.position.z = w < 480 ? 2.68 : w < 768 ? 2.48 : 2.32;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      requestRender();
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // WebGL context loss listeners
    const onContextLost = (e: Event) => {
      e.preventDefault();
      if (!isDisposed) {
        setWebglStatus('error');
        onModelStatusChange?.('fallback');
      }
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost, false);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      gsap.killTweensOf(jacketGroup.scale);
      gsap.killTweensOf(jacketGroup.position);
      gsap.killTweensOf(jacketGroup.rotation);
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
      fallbackEnvTexture.dispose();
      pmremGenerator.dispose();
      if (materialsByVariantRef.current) {
        Object.values(materialsByVariantRef.current).forEach((mat) => {
          mat.map?.dispose();
          mat.dispose();
        });
      }
      renderer.dispose();
    };
  }, []);

  // Synchronized Variant Transition Timeline (500-800ms) when activeVariant changes
  useEffect(() => {
    const prevId = activeVariantIdRef.current;
    activeVariantIdRef.current = activeVariant.id;

    const group = jacketGroupRef.current;
    const materialsMap = materialsByVariantRef.current;
    const modelHolder = gltfSceneRef.current;

    if (modelHolder && materialsMap) {
      const targetMat = materialsMap[activeVariant.id];
      if (targetMat) {
        modelHolder.traverse((child: any) => {
          if (child.isMesh) {
            child.material = targetMat;
            child.material.needsUpdate = true;
          }
        });
      }
    }

    if (prevId !== activeVariant.id) {
      const variantConfig = getVariantById(activeVariant.id);
      if (keyLightRef.current) {
        const tint =
          variantConfig.id === 'orange'
            ? 0xfff3e6
            : variantConfig.id === 'olive'
              ? 0xfff8e7
              : 0xf9f2ff;
        keyLightRef.current.color.setHex(tint);
      }

      if (group && !reducedMotion) {
        gsap.killTweensOf(group.scale);
        gsap.killTweensOf(group.position);
        gsap.killTweensOf(group.rotation);

        const tl = gsap.timeline({
          onUpdate: () => {
            requestRenderRef.current?.();
          },
        });

        tl.fromTo(
          group.scale,
          { x: 0.91, y: 0.91, z: 0.91 },
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.68,
            ease: 'back.out(1.5)',
          },
          0
        )
          .fromTo(
            group.position,
            { y: -0.035 },
            { y: 0, duration: 0.65, ease: 'power3.out' },
            0
          )
          .fromTo(
            group.rotation,
            { y: -0.14 },
            { y: 0, duration: 0.68, ease: 'power3.out' },
            0
          );
      } else {
        requestRenderRef.current?.();
      }

      // Also animate fallback image if visible
      if (fallbackImgRef.current && !reducedMotion) {
        gsap.fromTo(
          fallbackImgRef.current,
          { scale: 0.91, opacity: 0.72, y: 10 },
          { scale: 1, opacity: 1, y: 0, duration: 0.62, ease: 'power3.out' }
        );
      }
    }
  }, [activeVariant.id, reducedMotion]);

  // Pointer parallax & bounded drag rotation handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (forceFallback || webglStatus !== 'ready') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      yaw: dragAngleRef.current.yaw,
      pitch: dragAngleRef.current.pitch,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerNormRef.current = { x: nx, y: ny };
    }

    if (dragStartRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      // Bounded rotation: ±0.75 rad (~43 deg) yaw, ±0.30 rad (~17 deg) pitch
      const nextYaw = Math.max(
        -0.75,
        Math.min(0.75, dragStartRef.current.yaw + dx * 0.0055)
      );
      const nextPitch = Math.max(
        -0.3,
        Math.min(0.3, dragStartRef.current.pitch + dy * 0.0035)
      );
      dragAngleRef.current = { yaw: nextYaw, pitch: nextPitch };
      if (Math.abs(nextYaw) > 0.05 || Math.abs(nextPitch) > 0.05) {
        onRotationChange(true);
      }
    }

    requestRenderRef.current?.();
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if not captured
      }
      dragStartRef.current = null;
      setIsDragging(false);
    }
  };

  const handlePointerLeave = () => {
    pointerNormRef.current = { x: 0, y: 0 };
    if (!dragStartRef.current) {
      requestRenderRef.current?.();
    }
  };

  const showFallbackImage =
    forceFallback || webglStatus === 'error' || webglStatus === 'loading';

  return (
    <div
      data-testid="hero-3d-stage"
      data-render-mode={forceFallback || webglStatus === 'error' ? 'fallback-2d' : webglStatus}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpOrCancel}
      onPointerCancel={handlePointerUpOrCancel}
      onPointerLeave={handlePointerLeave}
      onDoubleClick={() => {
        dragAngleRef.current = { yaw: 0, pitch: 0 };
        onRotationChange(false);
        requestRenderRef.current?.();
      }}
      role="region"
      aria-label={`Interactive 3D showcase of ${activeVariant.displayName}. Drag horizontally to inspect or double-click to reset view.`}
      className={`relative w-full h-full flex items-center justify-center select-none ${
        !forceFallback && webglStatus === 'ready'
          ? isDragging
            ? 'cursor-grabbing'
            : 'cursor-grab'
          : 'cursor-default'
      }`}
    >
      {/* Dedicated WebGL Mount Container */}
      <div
        ref={mountRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          showFallbackImage ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />

      {/* Instant LCP / Reduced-Motion / Non-WebGL Transparent Fallback Render */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none transition-opacity duration-500 ${
          showFallbackImage ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          ref={fallbackImgRef}
          src={activeVariant.fallbackImagePath}
          alt={activeVariant.alt}
          referrerPolicy="no-referrer"
          className="w-[82%] max-w-[440px] sm:max-w-[500px] md:max-w-[540px] lg:max-w-[580px] h-auto object-contain drop-shadow-[0_28px_36px_rgba(0,0,0,0.45)] select-none"
        />
        {webglStatus === 'loading' && !forceFallback && (
          <span className="sr-only" role="status">
            Loading interactive 3D model...
          </span>
        )}
      </div>
    </div>
  );
};
