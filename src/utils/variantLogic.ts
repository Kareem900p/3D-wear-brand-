export type VariantId = 'orange' | 'olive' | 'pearl';

export type GarmentSize = 'S' | 'M' | 'L' | 'XL';

export interface VariantPalette {
  environment: string;
  card: string;
  cardGradientStart: string;
  cardGradientEnd: string;
  cardGlow: string;
  primaryFabric: string;
  seamShadow: string;
  accentHighlight: string;
  swatchFill: string;
}

export interface ProductVariant {
  id: VariantId;
  label: string;
  shortLabel: string;
  displayName: string;
  tagline: string;
  description: string;
  hexPalette: VariantPalette;
  modelPath: string;
  fallbackImagePath: string;
  materialName: string;
  khrMaterialsVariantName: VariantId;
  khrMaterialsVariantIndex: number;
  baseColorTexturePath: string;
  normalTexturePath: string;
  ormTexturePath: string;
  price: number;
  formattedPrice: string;
  stockStatus: string;
  sku: string;
  alt: string;
  specs: {
    fillPower: string;
    shellFabric: string;
    weight: string;
    tempRating: string;
  };
}

export interface PeripheralMiniaturePlacement {
  topRight: ProductVariant | null;
  bottomLeft: ProductVariant | null;
}

export interface CartItem {
  variantId: VariantId;
  size: GarmentSize;
  quantity: number;
  unitPrice: number;
  displayName: string;
  fallbackImagePath: string;
}

export interface CartSummary {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  formattedSubtotal: string;
}

const ASSET_BASE = '/assets/animated-ecommerce-3d-assets';

export const PRODUCT_VARIANTS: readonly ProductVariant[] = [
  {
    id: 'orange',
    label: 'Orange',
    shortLabel: 'Coral Orange',
    displayName: 'Solar Coral / Orange',
    tagline: 'Wear your Style with Comfort',
    description:
      'Engineered with 750-fill recycled down baffles and a weather-resistant matte ripstop shell that locks in warmth without bulk.',
    hexPalette: {
      environment: '#F5795D',
      card: '#D14722',
      cardGradientStart: '#EA6336',
      cardGradientEnd: '#B93414',
      cardGlow: '#FF9A6C',
      primaryFabric: '#EE601A',
      seamShadow: '#A8340A',
      accentHighlight: '#FE8A42',
      swatchFill: '#F26422',
    },
    modelPath: `${ASSET_BASE}/models/puffer-jacket.glb`,
    fallbackImagePath: `${ASSET_BASE}/fallback/puffer-orange-transparent.webp`,
    materialName: 'Puffer_Orange',
    khrMaterialsVariantName: 'orange',
    khrMaterialsVariantIndex: 0,
    baseColorTexturePath: `${ASSET_BASE}/textures/puffer-orange-basecolor.webp`,
    normalTexturePath: `${ASSET_BASE}/textures/puffer-normal.webp`,
    ormTexturePath: `${ASSET_BASE}/textures/puffer-orm.webp`,
    price: 59.99,
    formattedPrice: '$59.99',
    stockStatus: 'In Stock — Ready to Ship',
    sku: 'AP-PUFF-01-ORG',
    alt: 'Front view of the vivid orange insulated puffer jacket with five horizontal quilted baffles and high stand-up collar',
    specs: {
      fillPower: '750-Fill ThermoLoft™ Down',
      shellFabric: '20D Matte Ripstop Nylon (DWR)',
      weight: '420g (Ultra-Light)',
      tempRating: '-15°C / 5°F Comfort',
    },
  },
  {
    id: 'olive',
    label: 'Olive / Brown',
    shortLabel: 'Tactical Olive',
    displayName: 'Tactical Olive / Umber',
    tagline: 'Wear your Style with Comfort',
    description:
      'Constructed with five articulated chamber baffles, sealed storm welt pockets, and thermal-reflective lining for adaptive everyday comfort.',
    hexPalette: {
      environment: '#79642F',
      card: '#4A3B1C',
      cardGradientStart: '#665226',
      cardGradientEnd: '#2B220E',
      cardGlow: '#A58B47',
      primaryFabric: '#706038',
      seamShadow: '#42361E',
      accentHighlight: '#8E7C50',
      swatchFill: '#6B582C',
    },
    modelPath: `${ASSET_BASE}/models/puffer-jacket.glb`,
    fallbackImagePath: `${ASSET_BASE}/fallback/puffer-olive-transparent.webp`,
    materialName: 'Puffer_Olive',
    khrMaterialsVariantName: 'olive',
    khrMaterialsVariantIndex: 1,
    baseColorTexturePath: `${ASSET_BASE}/textures/puffer-olive-basecolor.webp`,
    normalTexturePath: `${ASSET_BASE}/textures/puffer-normal.webp`,
    ormTexturePath: `${ASSET_BASE}/textures/puffer-orm.webp`,
    price: 59.99,
    formattedPrice: '$59.99',
    stockStatus: 'In Stock — Ready to Ship',
    sku: 'AP-PUFF-01-OLV',
    alt: 'Front view of the muted olive-brown insulated puffer jacket with five horizontal quilted baffles and high stand-up collar',
    specs: {
      fillPower: '750-Fill ThermoLoft™ Down',
      shellFabric: '20D Matte Ripstop Nylon (DWR)',
      weight: '420g (Ultra-Light)',
      tempRating: '-15°C / 5°F Comfort',
    },
  },
  {
    id: 'pearl',
    label: 'Pearl / Silver',
    shortLabel: 'Pearl Silver',
    displayName: 'Pearl Silver / Lavender Mist',
    tagline: 'Wear your Style with Comfort',
    description:
      'Minimalist alpine silhouette featuring high-loft quilted baffles, a plush stand-up collar, and satin-matte pearl finish for effortless layering.',
    hexPalette: {
      environment: '#D3ABDE',
      card: '#AC8FBB',
      cardGradientStart: '#C6A3D3',
      cardGradientEnd: '#8E6FA0',
      cardGlow: '#EED5F5',
      primaryFabric: '#DEDAE6',
      seamShadow: '#A29AB0',
      accentHighlight: '#F5F3FA',
      swatchFill: '#DFDCE5',
    },
    modelPath: `${ASSET_BASE}/models/puffer-jacket.glb`,
    fallbackImagePath: `${ASSET_BASE}/fallback/puffer-pearl-transparent.webp`,
    materialName: 'Puffer_Pearl',
    khrMaterialsVariantName: 'pearl',
    khrMaterialsVariantIndex: 2,
    baseColorTexturePath: `${ASSET_BASE}/textures/puffer-pearl-basecolor.webp`,
    normalTexturePath: `${ASSET_BASE}/textures/puffer-normal.webp`,
    ormTexturePath: `${ASSET_BASE}/textures/puffer-orm.webp`,
    price: 59.99,
    formattedPrice: '$59.99',
    stockStatus: 'In Stock — Ready to Ship',
    sku: 'AP-PUFF-01-PRL',
    alt: 'Front view of the pale pearl-silver insulated puffer jacket with five horizontal quilted baffles and high stand-up collar',
    specs: {
      fillPower: '750-Fill ThermoLoft™ Down',
      shellFabric: '20D Matte Ripstop Nylon (DWR)',
      weight: '420g (Ultra-Light)',
      tempRating: '-15°C / 5°F Comfort',
    },
  },
] as const;

export const ASSET_PATHS = {
  brandMarkSvg: `${ASSET_BASE}/ui/original-brand-mark.svg`,
  orbitLinesSvg: `${ASSET_BASE}/ui/orbit-lines.svg`,
  studioHdr: `${ASSET_BASE}/environment/studio-softbox.hdr`,
  glbModel: `${ASSET_BASE}/models/puffer-jacket.glb`,
} as const;

export function getVariantById(id: string): ProductVariant {
  const found = PRODUCT_VARIANTS.find((v) => v.id === id);
  return found ?? PRODUCT_VARIANTS[0];
}

export function getNextVariantId(currentId: VariantId): VariantId {
  const idx = PRODUCT_VARIANTS.findIndex((v) => v.id === currentId);
  const nextIdx = (idx + 1) % PRODUCT_VARIANTS.length;
  return PRODUCT_VARIANTS[nextIdx].id;
}

export function getPrevVariantId(currentId: VariantId): VariantId {
  const idx = PRODUCT_VARIANTS.findIndex((v) => v.id === currentId);
  const prevIdx = (idx - 1 + PRODUCT_VARIANTS.length) % PRODUCT_VARIANTS.length;
  return PRODUCT_VARIANTS[prevIdx].id;
}

/**
 * Reproduces the exact peripheral miniature choreography from the reference video's After state:
 * - When 'orange' is hero (00:08–00:10): upper-right shows 'olive', lower-left is null (empty).
 * - When 'olive' is hero (00:11–00:14): lower-left shows 'orange' (previous hero), upper-right shows 'pearl' (next hero).
 * - When 'pearl' is hero (00:15–00:18): lower-left shows 'olive' (previous hero), upper-right is null.
 */
export function getPeripheralMiniatures(activeId: VariantId): PeripheralMiniaturePlacement {
  if (activeId === 'orange') {
    return {
      topRight: getVariantById('olive'),
      bottomLeft: null,
    };
  }
  if (activeId === 'olive') {
    return {
      topRight: getVariantById('pearl'),
      bottomLeft: getVariantById('orange'),
    };
  }
  return {
    topRight: null,
    bottomLeft: getVariantById('olive'),
  };
}

export function clampParallaxOffset(
  normX: number,
  normY: number,
  maxTranslation = 0.06,
  maxRotationRad = 0.14
): { offsetX: number; offsetY: number; rotX: number; rotY: number } {
  const clampedX = Math.max(-1, Math.min(1, Number.isFinite(normX) ? normX : 0));
  const clampedY = Math.max(-1, Math.min(1, Number.isFinite(normY) ? normY : 0));

  return {
    offsetX: Number((clampedX * maxTranslation).toFixed(4)),
    offsetY: Number((-clampedY * maxTranslation * 0.75).toFixed(4)),
    rotX: Number((clampedY * maxRotationRad * 0.55).toFixed(4)),
    rotY: Number((clampedX * maxRotationRad).toFixed(4)),
  };
}

export function addItemToCart(
  currentItems: CartItem[],
  variantId: VariantId,
  size: GarmentSize = 'L',
  quantityToAdd = 1
): CartItem[] {
  const safeQty = Math.max(1, Math.floor(quantityToAdd));
  const variant = getVariantById(variantId);
  const existingIndex = currentItems.findIndex(
    (item) => item.variantId === variantId && item.size === size
  );

  if (existingIndex >= 0) {
    return currentItems.map((item, idx) =>
      idx === existingIndex
        ? { ...item, quantity: Math.min(99, item.quantity + safeQty) }
        : item
    );
  }

  return [
    ...currentItems,
    {
      variantId: variant.id,
      size,
      quantity: safeQty,
      unitPrice: variant.price,
      displayName: variant.displayName,
      fallbackImagePath: variant.fallbackImagePath,
    },
  ];
}

export function updateCartItemQuantity(
  currentItems: CartItem[],
  variantId: VariantId,
  size: GarmentSize,
  nextQuantity: number
): CartItem[] {
  const rounded = Math.floor(nextQuantity);
  if (rounded <= 0) {
    return currentItems.filter(
      (item) => !(item.variantId === variantId && item.size === size)
    );
  }
  return currentItems.map((item) =>
    item.variantId === variantId && item.size === size
      ? { ...item, quantity: Math.min(99, rounded) }
      : item
  );
}

export function calculateCartSummary(items: CartItem[]): CartSummary {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const rawSubtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const subtotal = Number(rawSubtotal.toFixed(2));
  return {
    items,
    totalQuantity,
    subtotal,
    formattedSubtotal: `$${subtotal.toFixed(2)}`,
  };
}
