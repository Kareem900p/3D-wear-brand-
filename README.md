# AERO-PUFF — Animated 3D E-Commerce Puffer Jacket Showcase

An interactive, responsive 3D e-commerce product showcase built with **React 19**, **TypeScript**, **Vite**, **Three.js (WebGL)**, and **GSAP**. It recreates the *After* product-presentation choreography from the reference video: a full-viewport color-responsive environment, a large rounded product stage, a floating 3D insulated puffer jacket (`models/puffer-jacket.glb`), layered peripheral variant previews, subtle orbital energy lines, and an honest demo shopping bag flow.

---

## 1. Quick Start Commands

```bash
# Install dependencies
npm install

# Run unit tests (Node built-in test runner via tsx)
npx --yes tsx --test src/utils/variantLogic.test.ts

# Start development server on port 3000
npm run dev

# Type-check codebase
npm run lint

# Build production bundle
npm run build
```

---

## 2. Component & File Architecture

- `src/utils/variantLogic.ts` — Pure decoupled domain logic for the three product variants (`orange`, `olive`, `pearl`), peripheral miniature placement choreography (`getPeripheralMiniatures`), pointer parallax clamping (`clampParallaxOffset`), and cart calculations (`addItemToCart`, `updateCartItemQuantity`, `calculateCartSummary`).
- `src/utils/variantLogic.test.ts` — Deterministic unit tests verifying variant cycling, peripheral thumbnail placement, parallax bounds, and cart totals.
- `src/components/TopNavHeader.tsx` — Top navigation inside the hero stage featuring the original geometric brand crest (`original-brand-mark.svg`), centered navigation pills (`Products`, `About`, `Company`, `Contact`), 3D/2D fallback mode toggle, showcase loop toggle, and shopping bag counter badge.
- `src/components/PufferJacket3DStage.tsx` — Real-time Three.js WebGL stage loading `models/puffer-jacket.glb` (`54,000 vertices / 105,938 triangles`), normalizing scale and center pivot (`[0, 0, 0]`), applying standalone WebP baseColor textures (`puffer-orange-basecolor.webp`, `puffer-olive-basecolor.webp`, `puffer-pearl-basecolor.webp`) + tangent-space normal map (`puffer-normal.webp`) + packed ORM map (`puffer-orm.webp`), studio HDR reflections (`studio-softbox.hdr`), a 3-point warm/cool lighting rig, and a soft radial contact shadow. Includes automatic software-WebGL frame pacing (`afterDraw`) and a lossless `1600x1600` transparent WebP fallback (`fallback/puffer-*-transparent.webp`).
- `src/components/PeripheralMiniatures.tsx` — Renders the orbital SVG energy curves (`orbit-lines.svg`) and the upper-right / lower-left alternate variant miniature previews synchronized to the active variant.
- `src/components/VariantControls.tsx` — Desktop right-edge circular color swatches and Prev/Next cycle buttons, plus a touch-friendly (`>= 44x44px`) mobile variant bar.
- `src/components/ProductDetailsAndCTA.tsx` — Compact 3-line editorial headline (`Wear your / Style with / Comfort`), size selector (`S`, `M`, `L`, `XL`), lower-left product microcopy, `$59.99` tabular price display, and high-contrast `Buy Now` CTA.
- `src/components/CartAndInfoDrawers.tsx` — Honest demo shopping bag and checkout drawer (explicitly labeled as a demo simulation with zero real payment claims) and modals for `About`, `Company`, and `Contact`.

---

## 3. Local 3D & Image Assets (`public/assets/animated-ecommerce-3d-assets/`)

All assets are self-contained under `public/assets/animated-ecommerce-3d-assets/` and licensed under **CC0 1.0 Universal**:
- `models/puffer-jacket.glb` — True glTF 2.0 binary mesh (`6,422,036 bytes`)
- `textures/puffer-{orange,olive,pearl}-basecolor.webp` — 1024×1024 sRGB baseColor maps
- `textures/puffer-normal.webp` — 1024×1024 ripstop & seam normal map
- `textures/puffer-orm.webp` — 1024×1024 Occlusion/Roughness/Metallic map
- `environment/studio-softbox.hdr` — 512×256 Radiance RGBE environment map
- `fallback/puffer-{orange,olive,pearl}-transparent.webp` — 1600×1600 transparent WebP renders
- `ui/original-brand-mark.svg` & `ui/orbit-lines.svg` — Original vector UI assets
