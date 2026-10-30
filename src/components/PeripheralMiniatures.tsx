import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  ASSET_PATHS,
  PeripheralMiniaturePlacement,
  VariantId,
} from '../utils/variantLogic';

interface PeripheralMiniaturesProps {
  activeVariantId: VariantId;
  miniatures: PeripheralMiniaturePlacement;
  onSelectVariant: (id: VariantId) => void;
  reducedMotion: boolean;
}

export const PeripheralMiniatures: React.FC<PeripheralMiniaturesProps> = ({
  activeVariantId,
  miniatures,
  onSelectVariant,
  reducedMotion,
}) => {
  const topRightRef = useRef<HTMLButtonElement | null>(null);
  const bottomLeftRef = useRef<HTMLButtonElement | null>(null);
  const orbitRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    if (topRightRef.current && miniatures.topRight) {
      gsap.fromTo(
        topRightRef.current,
        { opacity: 0, scale: 0.72, x: 28, y: -18 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.65,
          ease: 'power3.out',
        }
      );
    }

    if (bottomLeftRef.current && miniatures.bottomLeft) {
      gsap.fromTo(
        bottomLeftRef.current,
        { opacity: 0, scale: 0.76, x: -32, y: 24 },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.68,
          ease: 'power3.out',
        }
      );
    }

    if (orbitRef.current) {
      gsap.fromTo(
        orbitRef.current,
        { opacity: 0.35, scale: 0.96 },
        { opacity: 0.85, scale: 1, duration: 0.75, ease: 'power2.out' }
      );
    }
  }, [activeVariantId, miniatures.topRight?.id, miniatures.bottomLeft?.id, reducedMotion]);

  return (
    <>
      {/* Subtle Orbital & Kinetic Energy Curves Behind Hero Jacket */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
      >
        {/* Radial directional spotlight behind the hero puffer jacket */}
        <div
          className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 w-[68%] h-[68%] rounded-full opacity-50 blur-3xl transition-colors duration-700"
          style={{
            background:
              activeVariantId === 'orange'
                ? 'radial-gradient(circle, rgba(255,175,125,0.58) 0%, rgba(209,71,34,0) 70%)'
                : activeVariantId === 'olive'
                  ? 'radial-gradient(circle, rgba(185,156,86,0.45) 0%, rgba(74,59,28,0) 70%)'
                  : 'radial-gradient(circle, rgba(255,245,255,0.55) 0%, rgba(172,143,187,0) 70%)',
          }}
        />

        {/* Supplied orbital SVG lines */}
        <img
          ref={orbitRef}
          src={ASSET_PATHS.orbitLinesSvg}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[1050px] h-auto object-contain opacity-80 select-none"
        />
      </div>

      {/* Upper-Right Alternate Product Miniature (Visible in Orange & Olive states per reference video) */}
      {miniatures.topRight && (
        <button
          ref={topRightRef}
          type="button"
          data-testid={`miniature-top-right-${miniatures.topRight.id}`}
          onClick={() => onSelectVariant(miniatures.topRight!.id)}
          aria-label={`Switch to ${miniatures.topRight.label} variant`}
          title={`Preview ${miniatures.topRight.displayName}`}
          className={`group hidden md:flex flex-col items-center justify-center absolute z-20 cursor-pointer transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-2xl p-1.5 ${
            activeVariantId === 'orange'
              ? 'right-[11%] lg:right-[13%] top-[9%] lg:top-[8%] w-36 lg:w-44'
              : 'right-[15%] lg:right-[17%] top-[14%] lg:top-[13%] w-24 lg:w-28'
          }`}
        >
          <img
            src={miniatures.topRight.fallbackImagePath}
            alt={miniatures.topRight.alt}
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.42)] transition-transform duration-200 group-hover:-translate-y-1 select-none"
          />
          <span className="sr-only">Select {miniatures.topRight.label}</span>
        </button>
      )}

      {/* Lower-Left Alternate Product Miniature (Visible in Olive & Pearl states per reference video) */}
      {miniatures.bottomLeft && (
        <button
          ref={bottomLeftRef}
          type="button"
          data-testid={`miniature-bottom-left-${miniatures.bottomLeft.id}`}
          onClick={() => onSelectVariant(miniatures.bottomLeft!.id)}
          aria-label={`Switch to ${miniatures.bottomLeft.label} variant`}
          title={`Preview ${miniatures.bottomLeft.displayName}`}
          className={`group hidden md:flex flex-col items-center justify-center absolute z-20 cursor-pointer transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-2xl p-1.5 ${
            activeVariantId === 'olive'
              ? 'left-[7%] lg:left-[8%] bottom-[13%] lg:bottom-[12%] w-40 lg:w-48'
              : 'left-[8%] lg:left-[10%] bottom-[13%] lg:bottom-[12%] w-32 lg:w-38'
          }`}
        >
          <img
            src={miniatures.bottomLeft.fallbackImagePath}
            alt={miniatures.bottomLeft.alt}
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:-translate-y-1 select-none"
          />
          <span className="sr-only">Select {miniatures.bottomLeft.label}</span>
        </button>
      )}
    </>
  );
};
