# Quality Assurance & Verification Report (`QA_REPORT.md`)

## 1. Summary of Executed Verification Checks

All checks listed below were executed in the container environment using `npx --yes tsx --test`, `npm run build` / `compile_applet`, and headless Chromium via `playwright-cli`.

| Check Category | Test / Verification Performed | Result | Evidence / Notes |
|---|---|---|---|
| **1. Unit Tests (Pure Logic)** | `npx --yes tsx --test src/utils/variantLogic.test.ts` | **PASS (6/6)** | Verified `PRODUCT_VARIANTS` paths, `getNextVariantId` / `getPrevVariantId` cycling (`orange -> olive -> pearl`), `getPeripheralMiniatures` reference choreography, `clampParallaxOffset` bounds, and cart subtotal math. |
| **2. TypeScript & Production Build** | `compile_applet` (`tsc --noEmit` & `vite build`) | **PASS** | Compiled with zero TypeScript or bundler errors. |
| **3. Asset Path & Network Audit** | Inspected network requests in headless Chromium (`playwright-cli requests`) | **PASS (0 404s)** | Confirmed HTTP `200 OK` for `/assets/animated-ecommerce-3d-assets/models/puffer-jacket.glb`, `/assets/animated-ecommerce-3d-assets/environment/studio-softbox.hdr`, all `.webp` textures/fallbacks, and `.svg` UI vectors. |
| **4. Desktop Viewport (`1440×900`)** | Captured and inspected `r1-desktop-orange.png`, `r1-desktop-olive.png`, `r1-desktop-pearl.png`, `r2-desktop-orange.png` | **PASS** | Verified full-viewport color-responsive environment (`#F5795D` → `#79642F` → `#D3ABDE`), rounded hero stage card (`#D14722` → `#4A3B1C` → `#AC8FBB`), 3D GLB puffer jacket with PBR material switching, peripheral miniatures, orbital SVG lines, `$59.99` price, and `Buy Now` CTA. |
| **5. Mobile Viewport (`390×844`)** | Captured and inspected `r1-mobile-pearl.png` and `r2-mobile-orange.png`; evaluated `scrollWidth === innerWidth` (`390 === 390`) | **PASS** | Fixed initial Round 1 mobile nav clipping; verified deliberate vertical mobile hierarchy (top navigation -> upper headline & size selector -> center 3D jacket -> touch-friendly variant rail -> bottom price & `Buy Now` CTA) with zero horizontal overflow. |
| **6. Variant Synchronization** | Tested switching across `Orange`, `Olive / Brown`, and `Pearl / Silver` via swatches, peripheral miniatures, and `←`/`→` keys | **PASS** | Confirmed single shared `activeVariantId` state updates the environment backdrop, card gradient, 3D PBR material (`Puffer_Orange`, `Puffer_Olive`, `Puffer_Pearl`), peripheral miniatures, SKU/title, and `aria-pressed` states in unison. |
| **7. Honest Demo Cart & Checkout** | Clicked `Buy Now` (`[data-testid="buy-now-cta"]`) and inspected `r2-desktop-cart.png` | **PASS** | Verified item addition, badge increment, quantity steppers (`+`/`-`), subtotal calculation (`$59.99`), email validation, and explicit Demo Prototype notice ("Demo Checkout only — no real payment or order is submitted"). |
| **8. 2D Fallback & Reduced Motion** | Tested `?fallback=1&variant=olive` (`r2-desktop-fallback-olive.png`) and top-bar `2D Fallback` / `3D Live` toggle | **PASS** | Confirmed `data-render-mode="fallback-2d"` cleanly renders the `1600×1600` transparent WebP render (`fallback/puffer-*-transparent.webp`) with zero layout shift. |

---

## 2. Environment Limitations & Notes

- **Headless Software WebGL Rendering:** The container verification browser runs headless Chromium without a physical hardware GPU (using SwiftShader software WebGL). The `PufferJacket3DStage` component automatically detects software WebGL (`isSoftwareGl`) and paces frames safely via `afterDraw` synchronization so headless captures never stall, while full hardware-accelerated `requestAnimationFrame` loops and shadow maps run on end-user GPUs.
- **Blender Source File (`models/puffer-jacket-source.blend`):** As documented in `ASSET_MANIFEST.json`, the `.blend` editable file is marked `not-produced` because the Blender binary is not installed in the build VM; `models/puffer-jacket.glb` is a genuine, watertight glTF 2.0 binary mesh (`54,000 vertices`, `105,938 triangles`) that can be imported directly into Blender.
