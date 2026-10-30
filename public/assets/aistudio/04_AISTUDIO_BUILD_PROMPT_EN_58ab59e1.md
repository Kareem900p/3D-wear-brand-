# Google AI Studio Build Prompt — Animated 3D E-commerce Product Page

Act as a senior creative developer, React/TypeScript engineer, Three.js/WebGL specialist, motion designer, and QA engineer. Build a real, responsive, working website that recreates the *After* product-page experience in the attached reference video. Do not return only a plan, wireframe, or static mockup.

## Attached inputs
Use the attached reference MP4, the supplied master prompt and analysis/spec documents, and `animated-ecommerce-3d-assets.zip`. Read the documents before coding.

## Mandatory asset verification before implementation
Inspect the asset ZIP and verify/extract its actual contents into the project under `public/assets/animated-ecommerce-3d-assets/`. Do not leave the ZIP as the only asset and do not invent or rename fake files. If this environment cannot extract the archive or place its files into the project, stop and state exactly which files/folders I must upload individually; do not silently substitute placeholders.

Expected asset paths after extraction:
- `models/puffer-jacket.glb`
- `textures/puffer-orange-basecolor.webp`
- `textures/puffer-olive-basecolor.webp`
- `textures/puffer-pearl-basecolor.webp`
- `textures/puffer-normal.webp`
- `textures/puffer-orm.webp`
- `environment/studio-softbox.hdr`
- `fallback/puffer-orange-transparent.webp`
- `fallback/puffer-olive-transparent.webp`
- `fallback/puffer-pearl-transparent.webp`
- `ui/original-brand-mark.svg`
- `ui/orbit-lines.svg`
- `data/product-variants.json`
- `ASSET_MANIFEST.json`

The GLB is a genuine glTF 2.0 model with three material variants (orange, olive, pearl). It has no embedded animation clips. Animate its parent group and the page through code. Do not claim that the mesh itself includes baked animation. Do not assume vanilla GLTFLoader automatically applies `KHR_materials_variants`; if necessary, explicitly swap the model's material/maps using the supplied local textures and verify the result visually.

## Target design
Create a premium product showcase with a full-viewport, variant-responsive environment; one large rounded product stage/card; a dominant floating puffer jacket; compact top navigation and original neutral brand mark; a compact editorial headline; `$59.99` price; alternate-color thumbnails; three color swatches; thin orbit/energy lines; and a clear `Buy Now` CTA. Match the reference's color choreography: coral/orange → olive/brown → lavender/pearl. Do not copy a third-party logo, video watermark, “Before/After” labels, or the video-editing interstitial into the final storefront.

Recreate the inner website experience as a responsive webpage. Do not reproduce the vertical video's empty portrait margins, and do not use the video itself as the website background or as a substitute for interface/3D.

## Implementation
- Use the existing project stack if already configured; otherwise use React + TypeScript, a compatible Vite setup, Three.js with React Three Fiber (or plain Three.js if simpler and more reliable), and GSAP for coordinated timelines.
- Use local supplied files. Do not hotlink textures/models or invent paths.
- If a real-time 3D scene is available, use the GLB as the hero. Use the supplied transparent WebP for loading, WebGL failure, or reduced-motion fallback.
- Make the jacket material, page background, card color, thumbnails, selected swatch and accessible labels update together from one shared selected-variant state.
- Implement a short initial reveal; subtle idle floating; tightly limited pointer parallax; and synchronized 500–800 ms variant transitions. Keep text/CTA stable and readable. No endless aggressive spin, excessive particles, fake cursor, scroll hijacking, or permanent blur.
- Use HDR/environment lighting only if it improves the model and can run reliably. Keep performance suitable for mobile; reduce pixel ratio on lower-powered devices and respect `prefers-reduced-motion`.
- `Buy Now` must provide honest demo feedback unless a real cart/checkout integration is already present. Never claim that an order or payment has actually been completed.
- Add loading/error states, semantic accessible controls, keyboard focus styles, and responsive layouts.

## Required verification
1. Confirm the model and local assets exist in the project tree and all runtime URLs resolve.
2. Run the project/build checks available in this environment and fix actual errors.
3. Inspect the live preview at mobile and desktop sizes. Verify all three variants, smooth transitions, fallback behavior and no horizontal overflow.
4. Create `ANIMATION_MAP.md`, `QA_REPORT.md`, and update `ASSET_MANIFEST.json` with real paths/statuses. Only report tests that were actually run.
5. If a check cannot be run in this environment, state the limitation explicitly.
6. Export/package the completed source project as a ZIP when supported.

## Execution order
First verify attachments and extract assets. Then implement the full working page, run checks, compare the live preview against the video’s *After* state, fix major differences, and report what is complete and what remains. Do not stop after analysis or a visual plan.
