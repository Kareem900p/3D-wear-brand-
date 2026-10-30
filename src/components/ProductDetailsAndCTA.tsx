import React from 'react';
import { Heart, Plus, Check } from 'lucide-react';
import { GarmentSize, ProductVariant } from '../utils/variantLogic';

interface ProductDetailsAndCTAProps {
  activeVariant: ProductVariant;
  selectedSize: GarmentSize;
  onSelectSize: (size: GarmentSize) => void;
  onBuyNow: () => void;
  onQuickAdd: () => void;
  justAdded: boolean;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

const SIZES: GarmentSize[] = ['S', 'M', 'L', 'XL'];

export const ProductDetailsAndCTA: React.FC<ProductDetailsAndCTAProps> = ({
  activeVariant,
  selectedSize,
  onSelectSize,
  onBuyNow,
  onQuickAdd,
  justAdded,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <>
      {/* Left-Aligned Compact Multi-Line Editorial Headline (Upper region on mobile, left-aligned on desktop) */}
      <div className="order-1 md:order-none relative z-20 px-5 pt-2 sm:px-8 md:px-0 md:absolute md:left-8 lg:left-11 md:top-[19%] lg:top-[20%] md:max-w-[240px] lg:max-w-[280px] pointer-events-auto flex items-center justify-between md:block">
        <div>
          <p className="text-[11px] sm:text-xs font-medium tracking-wide text-white/80 mb-1">
            {activeVariant.displayName} · {activeVariant.sku}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-[32px] lg:text-[38px] font-semibold tracking-tight text-white leading-[1.12] drop-shadow-sm">
            Wear your
            <br />
            Style with
            <br />
            Comfort
          </h1>
        </div>

        {/* Compact Size Selector Row */}
        <div
          role="group"
          aria-label="Select Garment Size"
          className="mt-2 md:mt-4 inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 rounded-2xl sm:rounded-full bg-black/20 border border-white/15 p-1"
        >
          {SIZES.map((sz) => {
            const isSelected = selectedSize === sz;
            return (
              <button
                key={sz}
                type="button"
                onClick={() => onSelectSize(sz)}
                aria-pressed={isSelected}
                aria-label={`Size ${sz}`}
                className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full text-[11px] font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isSelected
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar: Lower-Left Secondary Copy, Centered $59.99 Price, and Lower-Right Buy Now CTA */}
      <div className="order-4 md:order-none relative z-30 mt-auto grid grid-cols-1 md:grid-cols-3 items-end gap-3 md:gap-4 px-5 pb-5 pt-1 sm:px-8 sm:pb-7 md:px-10 md:pb-8">
        {/* Lower-Left Secondary Product Copy */}
        <div className="order-2 md:order-1 max-w-xs">
          <p className="text-[11px] sm:text-xs leading-relaxed text-white/85 font-normal">
            {activeVariant.description}
          </p>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/75 font-medium">
            <span>{activeVariant.specs.fillPower}</span>
            <span aria-hidden="true">·</span>
            <span>{activeVariant.stockStatus}</span>
          </div>
        </div>

        {/* Center Price ($59.99 as shown in the reference) */}
        <div className="order-1 md:order-2 flex flex-col items-center justify-center text-center">
          <span className="sr-only">Price</span>
          <div
            data-testid="product-price"
            className="font-display text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-white tabular-nums drop-shadow-sm"
          >
            {activeVariant.formattedPrice}
          </div>
        </div>

        {/* Lower-Right Actions: Quick Utility Icons + High-Contrast White "Buy Now" Pill Button */}
        <div className="order-3 flex items-center justify-between md:justify-end gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleWishlist}
              aria-pressed={isWishlisted}
              aria-label={isWishlisted ? 'Remove from saved items' : 'Save jacket to wishlist'}
              title={isWishlisted ? 'Saved' : 'Save for Later'}
              className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                isWishlisted
                  ? 'bg-white text-rose-600 border-white shadow-sm'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/25'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onQuickAdd}
              aria-label={`Quick add ${activeVariant.label} size ${selectedSize} to bag`}
              title="Quick Add to Bag"
              className="flex items-center gap-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 px-3 py-2 text-xs font-medium text-white transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            data-testid="buy-now-cta"
            onClick={onBuyNow}
            className="px-6 py-2.5 sm:px-7 sm:py-2.5 rounded-full bg-white text-neutral-950 font-semibold text-xs sm:text-sm tracking-tight shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:bg-neutral-100 hover:scale-[1.03] active:scale-[0.98] transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Buy Now
          </button>
        </div>
      </div>
    </>
  );
};
