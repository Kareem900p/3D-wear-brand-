/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  CartItem,
  GarmentSize,
  VariantId,
  addItemToCart,
  calculateCartSummary,
  getNextVariantId,
  getPrevVariantId,
  getPeripheralMiniatures,
  getVariantById,
} from './utils/variantLogic';
import { NavSectionId, TopNavHeader } from './components/TopNavHeader';
import { PufferJacket3DStage } from './components/PufferJacket3DStage';
import { PeripheralMiniatures } from './components/PeripheralMiniatures';
import { VariantControls } from './components/VariantControls';
import { ProductDetailsAndCTA } from './components/ProductDetailsAndCTA';
import { CartDrawer, InfoSectionModal } from './components/CartAndInfoDrawers';

export default function App() {
  // Parse optional query params for deterministic QA testing (?variant=olive&fallback=1)
  const initialParams = useMemo(() => {
    if (typeof window === 'undefined') {
      return { variant: 'orange' as VariantId, fallback: false };
    }
    const params = new URLSearchParams(window.location.search);
    const v = params.get('variant');
    const validVariant: VariantId =
      v === 'olive' || v === 'pearl' || v === 'orange' ? v : 'orange';
    const fallback = params.get('fallback') === '1';
    return { variant: validVariant, fallback };
  }, []);

  const [activeVariantId, setActiveVariantId] = useState<VariantId>(initialParams.variant);
  const [selectedSize, setSelectedSize] = useState<GarmentSize>('L');
  const [activeNav, setActiveNav] = useState<NavSectionId>('products');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [wishlistedIds, setWishlistedIds] = useState<VariantId[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [forceFallback, setForceFallback] = useState(initialParams.fallback);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  const envRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);

  const activeVariant = useMemo(
    () => getVariantById(activeVariantId),
    [activeVariantId]
  );

  const miniatures = useMemo(
    () => getPeripheralMiniatures(activeVariantId),
    [activeVariantId]
  );

  const cartSummary = useMemo(
    () => calculateCartSummary(cartItems),
    [cartItems]
  );

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Initial page entrance animation (reveal hero card with opacity/scale settle, 0 blur at end)
  useEffect(() => {
    if (!cardRef.current) return;
    if (reducedMotion) {
      gsap.set(cardRef.current, { opacity: 1, scale: 1, y: 0, clearProps: 'filter' });
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      cardRef.current,
      {
        opacity: 0,
        scale: 0.94,
        y: 18,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'filter',
      }
    );

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // Synchronized color choreography on variant change (500–800ms)
  useEffect(() => {
    document.body.setAttribute('data-active-variant', activeVariant.id);

    if (!envRef.current || !cardRef.current) return;

    if (reducedMotion) {
      envRef.current.style.backgroundColor = activeVariant.hexPalette.environment;
      cardRef.current.style.backgroundColor = activeVariant.hexPalette.card;
      return;
    }

    const tl = gsap.timeline();
    tl.to(
      envRef.current,
      {
        backgroundColor: activeVariant.hexPalette.environment,
        duration: 0.65,
        ease: 'power2.out',
      },
      0
    ).to(
      cardRef.current,
      {
        backgroundColor: activeVariant.hexPalette.card,
        duration: 0.65,
        ease: 'power2.out',
      },
      0
    );

    return () => {
      tl.kill();
    };
  }, [activeVariant, reducedMotion]);

  // Optional Showcase Auto-Cycle Loop (Orange -> Olive -> Pearl)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = window.setInterval(() => {
      setActiveVariantId((prev) => getNextVariantId(prev));
    }, 3400);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying]);

  // Keyboard Left/Right Arrow support for variant switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (isCartOpen || activeNav !== 'products') return;

      if (e.key === 'ArrowRight') {
        setIsAutoPlaying(false);
        setActiveVariantId((prev) => getNextVariantId(prev));
      } else if (e.key === 'ArrowLeft') {
        setIsAutoPlaying(false);
        setActiveVariantId((prev) => getPrevVariantId(prev));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, activeNav]);

  const handleSelectVariant = useCallback((nextId: VariantId) => {
    setIsAutoPlaying(false);
    setActiveVariantId(nextId);
  }, []);

  const handleQuickAdd = useCallback(() => {
    setCartItems((prev) => addItemToCart(prev, activeVariantId, selectedSize, 1));
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }, [activeVariantId, selectedSize]);

  const handleBuyNow = useCallback(() => {
    setCartItems((prev) => addItemToCart(prev, activeVariantId, selectedSize, 1));
    setIsCartOpen(true);
  }, [activeVariantId, selectedSize]);

  const handleUpdateCartQuantity = useCallback(
    (variantId: VariantId, size: GarmentSize, nextQty: number) => {
      setCartItems((prev) => {
        const rounded = Math.floor(nextQty);
        if (rounded <= 0) {
          return prev.filter(
            (item) => !(item.variantId === variantId && item.size === size)
          );
        }
        return prev.map((item) =>
          item.variantId === variantId && item.size === size
            ? { ...item, quantity: Math.min(99, rounded) }
            : item
        );
      });
    },
    []
  );

  const handleToggleWishlist = useCallback(() => {
    setWishlistedIds((prev) =>
      prev.includes(activeVariantId)
        ? prev.filter((id) => id !== activeVariantId)
        : [...prev, activeVariantId]
    );
  }, [activeVariantId]);

  const handleResetView = useCallback(() => {
    setResetTrigger((c) => c + 1);
  }, []);

  return (
    <div
      ref={envRef}
      data-testid="environment-backdrop"
      data-variant={activeVariant.id}
      style={{ backgroundColor: activeVariant.hexPalette.environment }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 lg:p-12 overflow-x-hidden select-none"
    >
      {/* Subtle Architectural Grid Texture on Outer Environment (Matching Reference Video Backdrop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Central Wide Product Stage Card */}
      <main
        ref={cardRef}
        data-testid="product-stage-card"
        style={{
          backgroundColor: activeVariant.hexPalette.card,
          backgroundImage: `radial-gradient(circle at 52% 42%, ${activeVariant.hexPalette.cardGradientStart} 0%, ${activeVariant.hexPalette.card} 52%, ${activeVariant.hexPalette.cardGradientEnd} 100%)`,
        }}
        className="relative z-10 w-full max-w-[1220px] min-h-[600px] sm:min-h-[640px] md:h-[min(78vh,720px)] md:min-h-[580px] rounded-[28px] sm:rounded-[36px] md:rounded-[42px] shadow-[0_38px_80px_-15px_rgba(0,0,0,0.48),0_12px_28px_-8px_rgba(0,0,0,0.32)] border border-white/15 flex flex-col justify-between overflow-hidden"
      >
        {/* Top Navigation Bar */}
        <TopNavHeader
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          cartCount={cartSummary.totalQuantity}
          onOpenCart={() => setIsCartOpen(true)}
          isAutoPlaying={isAutoPlaying}
          onToggleAutoPlay={() => setIsAutoPlaying((prev) => !prev)}
          forceFallback={forceFallback || reducedMotion}
          onToggleFallback={() => setForceFallback((prev) => !prev)}
          isRotated={isRotated}
          onResetView={handleResetView}
        />

        {/* Peripheral Miniatures & Orbital Energy Curves */}
        <PeripheralMiniatures
          activeVariantId={activeVariant.id}
          miniatures={miniatures}
          onSelectVariant={handleSelectVariant}
          reducedMotion={reducedMotion}
        />

        {/* Center Hero 3D Puffer Jacket Stage */}
        <div className="order-2 md:order-none relative z-10 flex-1 w-full min-h-[260px] sm:min-h-[320px] md:min-h-0 md:absolute md:inset-0 flex items-center justify-center pointer-events-auto">
          <div className="w-full h-[270px] sm:h-[330px] md:h-[88%] md:max-w-[680px] lg:max-w-[740px] flex items-center justify-center">
            <PufferJacket3DStage
              activeVariant={activeVariant}
              reducedMotion={reducedMotion}
              forceFallback={forceFallback || reducedMotion}
              resetTrigger={resetTrigger}
              onRotationChange={setIsRotated}
            />
          </div>
        </div>

        {/* Variant Controls (Right Rail on Desktop/Tablet, Accessible Row on Mobile) */}
        <VariantControls
          activeVariantId={activeVariant.id}
          onSelectVariant={handleSelectVariant}
        />

        {/* Left Headline, Size Controls, Price ($59.99), and Buy Now CTA */}
        <ProductDetailsAndCTA
          activeVariant={activeVariant}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onBuyNow={handleBuyNow}
          onQuickAdd={handleQuickAdd}
          justAdded={justAdded}
          isWishlisted={wishlistedIds.includes(activeVariant.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      </main>

      {/* Subtle Bottom Accessibility & Keyboard Hint Bar */}
      <footer className="relative z-10 mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-medium text-white/85 px-4 text-center">
        <span>Active Variant: {activeVariant.displayName}</span>
        <span aria-hidden="true">·</span>
        <span>Drag 3D Jacket to Inspect · Use ← / → Keys to Cycle Variants</span>
      </footer>

      {/* Honest Demo Shopping Bag & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartSummary={cartSummary}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={() => setCartItems([])}
        onSelectVariant={handleSelectVariant}
      />

      {/* Interactive Modals for About, Company, and Contact Nav Links */}
      <InfoSectionModal
        activeNav={activeNav}
        onClose={() => setActiveNav('products')}
        activeVariant={activeVariant}
        onSelectVariant={handleSelectVariant}
      />
    </div>
  );
}
