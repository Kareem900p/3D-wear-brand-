import React from 'react';
import { ShoppingBag, RotateCcw, Box, Sparkles } from 'lucide-react';
import { ASSET_PATHS } from '../utils/variantLogic';

export type NavSectionId = 'products' | 'about' | 'company' | 'contact';

interface TopNavHeaderProps {
  activeNav: NavSectionId;
  onSelectNav: (nav: NavSectionId) => void;
  cartCount: number;
  onOpenCart: () => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  forceFallback: boolean;
  onToggleFallback: () => void;
  isRotated: boolean;
  onResetView: () => void;
}

const NAV_ITEMS: { id: NavSectionId; label: string }[] = [
  { id: 'products', label: 'Products' },
  { id: 'about', label: 'About' },
  { id: 'company', label: 'Company' },
  { id: 'contact', label: 'Contact' },
];

export const TopNavHeader: React.FC<TopNavHeaderProps> = ({
  activeNav,
  onSelectNav,
  cartCount,
  onOpenCart,
  isAutoPlaying,
  onToggleAutoPlay,
  forceFallback,
  onToggleFallback,
  isRotated,
  onResetView,
}) => {
  return (
    <header className="relative z-30 flex flex-wrap items-center justify-between gap-y-2.5 gap-x-3 px-4 pt-4 pb-1 sm:flex-nowrap sm:px-8 sm:pt-7 md:px-10 md:pt-8">
      {/* Zone 1: Original Neutral Brand Mark */}
      <div className="flex items-center gap-2 shrink-0 order-1">
        <button
          type="button"
          onClick={() => onSelectNav('products')}
          aria-label="AERO-PUFF Home — Return to Product Showcase"
          className="group flex items-center gap-2 rounded-full p-1 text-white transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white cursor-pointer"
        >
          <img
            src={ASSET_PATHS.brandMarkSvg}
            alt="AERO-PUFF Original Brand Crest"
            className="h-6 w-auto sm:h-7 select-none pointer-events-none drop-shadow-sm"
            referrerPolicy="no-referrer"
          />
          <span className="sr-only">AERO-PUFF</span>
        </button>
      </div>

      {/* Zone 2: Compact Centered Navigation matching reference video */}
      <nav
        aria-label="Primary Storefront Navigation"
        className="order-3 sm:order-2 w-full sm:w-auto flex items-center justify-between sm:justify-center gap-1 sm:gap-2 md:gap-3 rounded-full bg-black/15 px-1.5 py-1 sm:px-2.5 sm:py-1.5 border border-white/15"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectNav(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex-1 sm:flex-initial text-center px-2.5 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-full transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Interactive Stage Utilities & Cart Action */}
      <div className="order-2 sm:order-3 flex items-center gap-1.5 sm:gap-2 shrink-0">
        {isRotated && !forceFallback && (
          <button
            type="button"
            onClick={onResetView}
            aria-label="Reset 3D camera angle"
            title="Reset 3D View"
            className="flex items-center gap-1.5 rounded-full bg-black/25 hover:bg-black/40 border border-white/20 px-2.5 py-1.5 text-[11px] font-medium text-white transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset View</span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleAutoPlay}
          aria-pressed={isAutoPlaying}
          aria-label={isAutoPlaying ? 'Pause color showcase loop' : 'Play color showcase loop'}
          title={isAutoPlaying ? 'Pause Showcase Loop' : 'Auto-Cycle Variants'}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            isAutoPlaying
              ? 'bg-white text-neutral-900 border-white shadow-sm'
              : 'bg-black/20 hover:bg-black/35 text-white/90 border-white/20'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">{isAutoPlaying ? 'Looping' : 'Showcase'}</span>
        </button>

        <button
          type="button"
          onClick={onToggleFallback}
          aria-pressed={forceFallback}
          aria-label={forceFallback ? 'Switch to interactive 3D WebGL model' : 'Switch to 2D image fallback mode'}
          title={forceFallback ? 'Enable 3D WebGL View' : 'Test 2D Fallback Image'}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
            forceFallback
              ? 'bg-white text-neutral-900 border-white'
              : 'bg-black/20 hover:bg-black/35 text-white/90 border-white/20'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{forceFallback ? '2D Fallback' : '3D Live'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenCart}
          aria-label={`Open shopping bag (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`}
          className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white transition-all duration-150 cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          {cartCount > 0 && (
            <span
              data-testid="cart-badge"
              className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-neutral-900 shadow-sm tabular-nums"
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
