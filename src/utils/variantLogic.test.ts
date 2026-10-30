import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PRODUCT_VARIANTS,
  getVariantById,
  getNextVariantId,
  getPrevVariantId,
  getPeripheralMiniatures,
  clampParallaxOffset,
  addItemToCart,
  updateCartItemQuantity,
  calculateCartSummary,
} from './variantLogic';

test('PRODUCT_VARIANTS includes orange, olive, and pearl with verified local paths', () => {
  assert.equal(PRODUCT_VARIANTS.length, 3);
  assert.deepEqual(
    PRODUCT_VARIANTS.map((v) => v.id),
    ['orange', 'olive', 'pearl']
  );

  for (const variant of PRODUCT_VARIANTS) {
    assert.ok(variant.modelPath.endsWith('/models/puffer-jacket.glb'));
    assert.ok(variant.fallbackImagePath.endsWith('.webp'));
    assert.ok(variant.baseColorTexturePath.endsWith('.webp'));
    assert.equal(variant.formattedPrice, '$59.99');
  }
});

test('getNextVariantId and getPrevVariantId cycle orange -> olive -> pearl', () => {
  assert.equal(getNextVariantId('orange'), 'olive');
  assert.equal(getNextVariantId('olive'), 'pearl');
  assert.equal(getNextVariantId('pearl'), 'orange');

  assert.equal(getPrevVariantId('orange'), 'pearl');
  assert.equal(getPrevVariantId('olive'), 'orange');
  assert.equal(getPrevVariantId('pearl'), 'olive');
});

test('getPeripheralMiniatures matches reference video After choreography', () => {
  const orangeState = getPeripheralMiniatures('orange');
  assert.equal(orangeState.topRight?.id, 'olive');
  assert.equal(orangeState.bottomLeft, null);

  const oliveState = getPeripheralMiniatures('olive');
  assert.equal(oliveState.topRight?.id, 'pearl');
  assert.equal(oliveState.bottomLeft?.id, 'orange');

  const pearlState = getPeripheralMiniatures('pearl');
  assert.equal(pearlState.topRight, null);
  assert.equal(pearlState.bottomLeft?.id, 'olive');
});

test('clampParallaxOffset bounds out-of-range pointer coordinates safely', () => {
  const center = clampParallaxOffset(0, 0);
  assert.deepEqual(center, { offsetX: 0, offsetY: 0, rotX: 0, rotY: 0 });

  const extreme = clampParallaxOffset(5, -5, 0.06, 0.14);
  assert.equal(extreme.offsetX, 0.06);
  assert.equal(extreme.offsetY, 0.045);
  assert.equal(extreme.rotY, 0.14);
  assert.equal(extreme.rotX, -0.077);
});

test('cart state functions add, increment, update, remove, and total items accurately', () => {
  let items = addItemToCart([], 'orange', 'L', 1);
  assert.equal(items.length, 1);
  assert.equal(items[0].quantity, 1);

  items = addItemToCart(items, 'orange', 'L', 2);
  assert.equal(items.length, 1);
  assert.equal(items[0].quantity, 3);

  items = addItemToCart(items, 'olive', 'M', 1);
  assert.equal(items.length, 2);

  const summary = calculateCartSummary(items);
  assert.equal(summary.totalQuantity, 4);
  assert.equal(summary.subtotal, 239.96);
  assert.equal(summary.formattedSubtotal, '$239.96');

  items = updateCartItemQuantity(items, 'orange', 'L', 0);
  assert.equal(items.length, 1);
  assert.equal(items[0].variantId, 'olive');
});

test('getVariantById falls back to orange for unknown variant IDs', () => {
  const fallback = getVariantById('non-existent');
  assert.equal(fallback.id, 'orange');
});
