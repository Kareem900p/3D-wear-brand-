# Official Technical References and Repository Notes

These are implementation references, not claims about the original site's stack. Check the current package compatibility and license terms before use; do not rely on a library name in isolation.

| Tool | Official reference | Use in this project | Notes |
|---|---|---|---|
| Three.js | https://threejs.org/manual/pages/creating-a-scene.html | Scene, camera, renderer, lights, animation loop | Core WebGL layer for real product rendering. |
| GLTFLoader | https://threejs.org/docs/pages/GLTFLoader.html | Load glTF 2.0 / GLB models | Add-on loader; texture/decoder paths must resolve locally. |
| Three.js GitHub | https://github.com/mrdoob/three.js | Source and examples | Repository states MIT license; verify notices for included files. |
| React Three Fiber | https://r3f.docs.pmnd.rs/getting-started/introduction | React renderer for Three.js | Match major versions: docs note Fiber v8 pairs with React 18, v9 with React 19; avoid v10 alpha unless intentionally chosen and tested. |
| GSAP ScrollTrigger | https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | Timeline orchestration / scroll-linked animation | For one-screen hero choreography, basic GSAP timelines may be enough; ScrollTrigger is only needed if behavior is tied to scrolling. |
| GSAP GitHub | https://github.com/greensock/GSAP | Source, React integration, docs | The repository currently advertises the full toolset as free; still inspect the current official license for the exact distribution/use. |
| Motion for React | https://motion.dev/docs/react | UI micro-interactions and in-view/scroll effects | Previously known as Framer Motion. Do not animate the same property with Motion and GSAP concurrently. |
| Lenis | https://github.com/darkroomengineering/lenis | Optional smooth scrolling synchronized with other motion | Add only if a long-scroll page makes it worthwhile; not needed for a single hero by default. The repo describes it as MIT licensed. |
| Theatre.js | https://github.com/theatre-js/theatre | Optional motion authoring for 3D/DOM | Optional, not required. The repository notes Core is Apache 2.0 while Studio is AGPL-3.0; check current license obligations before using Studio. |

## Suggested minimal stack
- **3D:** `three` + (`@react-three/fiber` and compatible `@react-three/drei` only in React).
- **Choreography:** GSAP for a small, explicit set of timelines; use ScrollTrigger only if scrolling genuinely controls the scene.
- **Micro-interactions:** CSS transitions are sufficient for many controls; Motion for React is optional, not mandatory.
- **Smooth scroll:** Lenis optional, only for a long-form page.
- **Assets:** local optimized GLB, local variants/fallback images, original SVG ornamentation, documented sources/licenses.

## Licensing and compatibility caution
A public GitHub repository does not imply that every asset inside it is free for commercial redistribution. Review individual model/texture/font licenses, their attribution requirements, and package peer dependencies. Lock compatible versions in the project and test the production build; do not blindly use `latest` or install experimental versions into a production project.
