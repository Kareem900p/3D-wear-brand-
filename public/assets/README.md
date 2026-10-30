# Animated E-Commerce 3D Puffer Jacket Asset Bundle

This archive provides a verified, self-contained 3D product asset bundle for the three-variant animated e-commerce puffer jacket showcase (`orange`, `olive`, and `pearl`). All assets are original works licensed under **CC0 1.0 Universal** with zero third-party trademarks or external network dependencies.

## 1. Coordinate System, Origin, Scale & Mesh Specifications

- **File Path:** `models/puffer-jacket.glb` (glTF 2.0 Binary)
- **World Origin / Pivot (`[0, 0, 0]`):** Centered directly at the geometric center of the jacket torso (`[-0.8000, -0.4784, -0.3215]` to `[+0.8000, +0.4784, +0.3215]`). Zero arbitrary world offset.
- **Axes Convention (Standard glTF 2.0 / Three.js Right-Handed):**
  - **`+Y`:** Up (from bottom waist hem `-0.4784` to top of stand-up collar `+0.4784`).
  - **`+Z`:** Front view (facing directly toward the camera at `[0, 0, +Z]`).
  - **`+X`:** Viewer's right / Jacket's left sleeve (`-0.8000` to `+0.8000`).
- **Normalized Scale:** `1.6000` units wide (sleeve cuff to sleeve cuff) × `0.9569` units tall × `0.6430` units deep.
- **Polygon Budget:** `54,000` vertices / `105,938` indexed triangles across 4 watertight sub-components (5-baffle quilted torso with center zipper trench and diagonal pocket welts, 2-baffle plush stand-up collar with sealed inner neck cap, and left/right articulated 5-baffle sleeves with elastic cuffs).
- **Embedded vs. External Textures:**
  - `models/puffer-jacket.glb` embeds all 5 PBR textures (`orange`, `olive`, `pearl` basecolor maps, tangent-space normal map, and packed ORM map) as native `image/png` bufferViews so it loads out-of-the-box in any glTF 2.0 viewer, Three.js `GLTFLoader`, React Three Fiber, or `<model-viewer>` without external path resolution issues.
  - High-efficiency standalone `.webp` textures (`1024x1024`) are also provided in `textures/` for custom runtime material swapping.

## 2. Switching Material Variants (`orange`, `olive`, `pearl`)

All three variants share the exact same mesh, origin, scale, and UV layout:
1. **Via `KHR_materials_variants` Extension:** The GLB includes the official `KHR_materials_variants` extension with variant names `"orange"` (index `0`), `"olive"` (index `1`), and `"pearl"` (index `2`).
2. **Via Named Materials in GLB:** The GLB `materials` array contains all three pre-configured PBR materials:
   - `Puffer_Orange` (Material index `0`, default active)
   - `Puffer_Olive` (Material index `1`)
   - `Puffer_Pearl` (Material index `2`)
3. **Via Standalone WebP Textures (`textures/`):** Swap `material.map` using `textures/puffer-orange-basecolor.webp`, `textures/puffer-olive-basecolor.webp`, and `textures/puffer-pearl-basecolor.webp` while sharing `textures/puffer-normal.webp` and `textures/puffer-orm.webp`.

## 3. Transparent Image Fallbacks (`fallback/`)

For devices or fallback modes where WebGL is disabled or still loading, `fallback/` contains `1600x1600` lossless transparent WebP renders (`puffer-orange-transparent.webp`, `puffer-olive-transparent.webp`, `puffer-pearl-transparent.webp`) rendered from the exact same camera (`position = [0, 0, 2.40]`) with 2×2 SSAA anti-aliased alpha edges and zero background bleed.

## 4. Note on `models/puffer-jacket-source.blend`

Because the local build environment does not have the Blender binary installed, `models/puffer-jacket-source.blend` is marked `not-produced` in `ASSET_MANIFEST.json` (no fake or empty `.blend` file is included). Instead, `models/puffer-jacket.glb` was generated directly via a parametric Python 3D surface and glTF 2.0 binary compiler and can be imported directly into Blender 3.x/4.x (`File -> Import -> glTF 2.0 (.glb/.gltf)`) with full quad-grid topology, UVs, and PBR materials intact.

## 5. Complete File Inventory, Sizes, Dimensions & SHA-256 Checksums

| Relative Path | Status | Size (Bytes) | Dimensions / Geometry | SHA-256 Checksum |
|---|---|---:|---|---|
| `models/puffer-jacket.glb` | `included` | 6,422,036 | 54,000 verts / 105,938 tris | `408e4a29c58adf10ebcc4fd47fb1b2defbbf9690972d3bce48f133fe46d9c839` |
| `models/puffer-jacket-source.blend` | `not-produced` | — | — | N/A (documented in manifest) |
| `textures/puffer-orange-basecolor.webp` | `included` | 7,954 | 1024x1024 | `b7d0eacc67b68186495552d257848f82630cc367490505669b9551e8fed37cfb` |
| `textures/puffer-olive-basecolor.webp` | `included` | 6,804 | 1024x1024 | `46e2339a263056ab7a853eb8a5949a93fc5db93209383537d65927fb9e9b268b` |
| `textures/puffer-pearl-basecolor.webp` | `included` | 6,362 | 1024x1024 | `ba0d510e4a6aecfcc55193b3689ce26a0ea91705f94daf44f3fcf97aec0acc28` |
| `textures/puffer-normal.webp` | `included` | 514,018 | 1024x1024 | `9b2ce6691c3dc67b5fa08aa60ba7b453118ae4a1c0b4c86b564c2259678ecce5` |
| `textures/puffer-orm.webp` | `included` | 103,352 | 1024x1024 | `8838cdacf49f5bc112d8c04fb1c0dc1f2a8443e12e28bad693cecc28051801c6` |
| `environment/studio-softbox.hdr` | `included` | 524,382 | 512x256 | `86444b40d853b0f2e5a21bb84b3976b3353e68bea197962ae68ea0559cb5120e` |
| `fallback/puffer-orange-transparent.webp` | `included` | 317,118 | 1600x1600 | `bdaab938141470c8bb22957690267ac5f91d2f978e87f62686229692b6f90545` |
| `fallback/puffer-olive-transparent.webp` | `included` | 297,612 | 1600x1600 | `81024f224eb5a6d7612eb9d22ef08831a3055a7e08851e61c4c21e4172c8e668` |
| `fallback/puffer-pearl-transparent.webp` | `included` | 184,882 | 1600x1600 | `ceb81c1ab8f5e9dd5391f0ded25c02a190f18a2e455e0cff0ba55cc1d1d5e7ff` |
| `ui/original-brand-mark.svg` | `included` | 473 | N/A | `20c974c45c43a361dad88a0f6c3be08da09521e72cdd518b5445d0e827605abb` |
| `ui/orbit-lines.svg` | `included` | 1,605 | N/A | `0b713f403e8ece7f4d266e5294bd5f6a9a1879a9d8ba237dd018ee7f9e3e9221` |
| `data/product-variants.json` | `included` | 3,070 | N/A | `5531728dad314dabada2a07ab6896f55f855149f24b565b601fd5a54b9e54227` |
| `previews/hero-front.png` | `included` | 415,424 | 1600x1600 | `89d47f85c8d527bec064121fbc569e05088f9cd82c3e2657c41e229a42e50060` |
| `previews/model-wireframe.png` | `included` | 1,222,711 | 1600x1600 | `370573d56144a8a4c0eb0095923e47c573c662b19e2f8cfe215b8359a612e38d` |
| `third_party_licenses/LICENSE-CC0-1.0.txt` | `included` | 755 | N/A | `716f3ec441cdbde5e843fdb1c41f0d23e87d062f3fcfe34d99ad26505ecc51ec` |
