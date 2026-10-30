import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  PRODUCT_VARIANTS,
  VariantId,
  getNextVariantId,
  getPrevVariantId,
} from '../utils/variantLogic';

interface VariantControlsProps {
  activeVariantId: VariantId;
  onSelectVariant: (id: VariantId) => void;
}

export const VariantControls: React.FC<VariantControlsProps> = ({
  activeVariantId,
  onSelectVariant,
}) => {
  const handlePrev = () => {
    onSelectVariant(getPrevVariantId(activeVariantId));
  };

  const handleNext = () => {
    onSelectVariant(getNextVariantId(activeVariantId));
  };

  return (
    <>
      {/* Desktop / Tablet Right-Edge Variant Swatches & Prev/Next Cycle Controls matching Reference Video */}
      <div
        role="group"
        aria-label="Product Color Variant Controls"
        className="hidden md:flex flex-col items-end gap-5 absolute right-6 lg:right-9 top-1/2 -translate-y-1/2 z-30"
      >
        {/* Circular Color Swatches */}
        <div className="flex flex-col items-center gap-2.5 rounded-full bg-black/20 border border-white/20 p-2 shadow-lg">
          {PRODUCT_VARIANTS.map((variant) => {
            const isSelected = variant.id === activeVariantId;
            return (
              <button
                key={variant.id}
                type="button"
                data-testid={`swatch-desktop-${variant.id}`}
                onClick={() => onSelectVariant(variant.id)}
                aria-label={`Select ${variant.label} color variant`}
                aria-pressed={isSelected}
                title={`${variant.displayName} (${variant.formattedPrice})`}
                className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isSelected
                    ? 'ring-2 ring-white scale-110 shadow-md'
                    : 'opacity-80 hover:opacity-100 hover:scale-105'
                }`}
              >
                <span
                  className="w-5.5 h-5.5 rounded-full border border-white/40 shadow-inner"
                  style={{ backgroundColor: variant.hexPalette.swatchFill }}
                />
                <span className="sr-only">{variant.label}</span>
              </button>
            );
          })}
        </div>

        {/* Circular Prev / Next Variant Cycle Arrows (as seen on right side of reference card) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous color variant"
            title="Previous Variant"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 text-white transition-all duration-150 cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next color variant"
            title="Next Variant"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/25 hover:bg-white/40 border border-white/40 text-white transition-all duration-150 cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Touch-Friendly Variant Selector Rail (44x44px touch targets) */}
      <div
        role="group"
        aria-label="Mobile Color Variant Controls"
        className="order-3 flex md:hidden items-center justify-center gap-2.5 px-4 py-1.5 z-30"
      >
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous color variant"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-black/20 hover:bg-black/30 border border-white/25 text-white transition-transform active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 rounded-full bg-black/20 border border-white/20 px-3 py-1.5">
          {PRODUCT_VARIANTS.map((variant) => {
            const isSelected = variant.id === activeVariantId;
            return (
              <button
                key={variant.id}
                type="button"
                data-testid={`swatch-mobile-${variant.id}`}
                onClick={() => onSelectVariant(variant.id)}
                aria-label={`Select ${variant.label} variant`}
                aria-pressed={isSelected}
                className={`flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center px-2.5 rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isSelected
                    ? 'bg-white text-neutral-900 font-semibold shadow-sm'
                    : 'text-white/85 hover:text-white'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                  style={{ backgroundColor: variant.hexPalette.swatchFill }}
                />
                <span className="text-xs whitespace-nowrap">{variant.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next color variant"
          className="flex items-center justify-center w-11 h-11 rounded-full bg-black/20 hover:bg-black/30 border border-white/25 text-white transition-transform active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};
