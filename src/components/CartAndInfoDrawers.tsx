import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShieldCheck, CheckCircle2, Sparkles, Layers, Compass, Mail } from 'lucide-react';
import {
  CartSummary,
  GarmentSize,
  PRODUCT_VARIANTS,
  ProductVariant,
  VariantId,
} from '../utils/variantLogic';
import { NavSectionId } from './TopNavHeader';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartSummary: CartSummary;
  onUpdateQuantity: (variantId: VariantId, size: GarmentSize, nextQty: number) => void;
  onClearCart: () => void;
  onSelectVariant: (variantId: VariantId) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartSummary,
  onUpdateQuantity,
  onClearCart,
  onSelectVariant,
}) => {
  const [demoOrderCompleted, setDemoOrderCompleted] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  if (!isOpen) return null;

  const handleCompleteDemoOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      setEmailError('Please enter a valid email address for the demo receipt.');
      return;
    }
    setEmailError('');
    setDemoOrderCompleted(true);
  };

  const handleResetDemo = () => {
    setDemoOrderCompleted(false);
    setCustomerEmail('');
    onClearCart();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-neutral-950 text-white shadow-2xl border-l border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 id="cart-drawer-title" className="font-display text-lg font-semibold">
              Shopping Bag ({cartSummary.totalQuantity})
            </h2>
            <p className="text-xs text-neutral-400">
              Interactive Demo Storefront — No real charges
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {demoOrderCompleted ? (
            <div
              data-testid="demo-order-confirmation"
              className="flex flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/10 p-6 text-center my-4"
            >
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-3" />
              <h3 className="font-display text-xl font-semibold text-white">
                Demo Checkout Preview Complete
              </h3>
              <p className="mt-2 text-xs text-neutral-300 leading-relaxed">
                This is a standalone interactive 3D product prototype. No real order was submitted and no payment was processed for{' '}
                <span className="font-medium text-white">{customerEmail}</span>.
              </p>
              <div className="mt-4 w-full rounded-xl bg-black/40 p-4 text-left text-xs text-neutral-300 space-y-1.5 border border-white/10">
                <div className="flex justify-between">
                  <span>Prototype Status:</span>
                  <span className="font-semibold text-amber-300">Demo Simulation Only</span>
                </div>
                <div className="flex justify-between">
                  <span>Items Simulated:</span>
                  <span className="tabular-nums">{cartSummary.totalQuantity}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-1.5 font-semibold text-white">
                  <span>Demo Total:</span>
                  <span className="tabular-nums">{cartSummary.formattedSubtotal}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetDemo}
                className="mt-6 w-full rounded-full bg-white py-2.5 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Clear Demo Bag & Return to 3D Stage
              </button>
            </div>
          ) : cartSummary.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-neutral-300 font-medium">
                Your shopping bag is currently empty.
              </p>
              <p className="mt-1 text-xs text-neutral-400 max-w-xs">
                Select a puffer jacket colorway below or click Buy Now on the stage to test the demo bag flow.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2.5 w-full">
                {PRODUCT_VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      onSelectVariant(v.id);
                      onClose();
                    }}
                    className="flex flex-col items-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 p-3 transition-colors cursor-pointer"
                  >
                    <img
                      src={v.fallbackImagePath}
                      alt={v.label}
                      className="h-14 w-auto object-contain"
                    />
                    <span className="mt-2 text-[11px] font-medium text-white">
                      {v.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cartSummary.items.map((item) => (
                <div
                  key={`${item.variantId}-${item.size}`}
                  className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/10 p-3.5"
                >
                  <img
                    src={item.fallbackImagePath}
                    alt={item.displayName}
                    className="h-16 w-16 rounded-xl bg-black/30 object-contain p-1.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {item.displayName}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Size: {item.size} · ${item.unitPrice.toFixed(2)} each
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.variantId, item.size, item.quantity - 1)
                        }
                        aria-label={`Decrease quantity of ${item.displayName}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span
                        data-testid={`cart-qty-${item.variantId}-${item.size}`}
                        className="w-6 text-center text-xs font-semibold tabular-nums"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.variantId, item.size, item.quantity + 1)
                        }
                        aria-label={`Increase quantity of ${item.displayName}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-semibold tabular-nums">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.variantId, item.size, 0)}
                      aria-label={`Remove ${item.displayName} size ${item.size} from bag`}
                      className="text-neutral-400 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartSummary.items.length > 0 && !demoOrderCompleted && (
          <form
            onSubmit={handleCompleteDemoOrder}
            noValidate
            className="border-t border-white/10 bg-neutral-900/80 px-6 py-5 space-y-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Shipping (Demo Prototype)</span>
                <span>Complimentary</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-white">
                <span>Estimated Total</span>
                <span data-testid="cart-subtotal" className="tabular-nums">
                  {cartSummary.formattedSubtotal}
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="demo-checkout-email"
                className="block text-xs font-medium text-neutral-300 mb-1"
              >
                Email for Demo Confirmation
              </label>
              <input
                id="demo-checkout-email"
                type="email"
                required
                value={customerEmail}
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-black/50 border border-white/15 px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-2 focus:outline-white"
              />
              {emailError && (
                <p role="alert" className="mt-1 text-[11px] text-rose-400">
                  {emailError}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-400/20 rounded-xl px-3 py-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Demo Checkout only — no real payment or order is submitted.</span>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-white py-3 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Simulate Demo Checkout ({cartSummary.formattedSubtotal})
            </button>
          </form>
        )}
      </aside>
    </div>
  );
};

interface InfoSectionModalProps {
  activeNav: NavSectionId;
  onClose: () => void;
  activeVariant: ProductVariant;
  onSelectVariant: (id: VariantId) => void;
}

export const InfoSectionModal: React.FC<InfoSectionModalProps> = ({
  activeNav,
  onClose,
  activeVariant,
  onSelectVariant,
}) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  if (activeNav === 'products') return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nav-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-xl rounded-3xl bg-neutral-950 text-white border border-white/15 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            {activeNav === 'about' && <Layers className="w-5 h-5 text-white/80" />}
            {activeNav === 'company' && <Compass className="w-5 h-5 text-white/80" />}
            {activeNav === 'contact' && <Mail className="w-5 h-5 text-white/80" />}
            <h2 id="nav-modal-title" className="font-display text-xl font-semibold capitalize">
              {activeNav === 'about'
                ? 'About the 3D Garment Architecture'
                : activeNav === 'company'
                  ? 'AERO-PUFF Outerwear Studio'
                  : 'Contact & Press Inquiries'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {activeNav === 'about' && (
          <div className="mt-5 space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <p>
              The <strong className="text-white">AERO-PUFF Down Jacket</strong> combines 5-chamber high-loft quilted baffles with a 20D DWR-treated matte ripstop shell. In this interactive showcase, the real-time glTF 2.0 mesh (<code className="text-white">54,000 vertices / 105,938 triangles</code>) responds to pointer parallax, drag inspection, and synchronized color choreography.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                <div className="text-[11px] text-neutral-400">Insulation</div>
                <div className="mt-0.5 font-semibold text-white">{activeVariant.specs.fillPower}</div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                <div className="text-[11px] text-neutral-400">Outer Shell</div>
                <div className="mt-0.5 font-semibold text-white">{activeVariant.specs.shellFabric}</div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                <div className="text-[11px] text-neutral-400">Garment Weight</div>
                <div className="mt-0.5 font-semibold text-white">{activeVariant.specs.weight}</div>
              </div>
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
                <div className="text-[11px] text-neutral-400">Thermal Rating</div>
                <div className="mt-0.5 font-semibold text-white">{activeVariant.specs.tempRating}</div>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-neutral-400">Switch active stage colorway:</span>
              <div className="flex gap-2">
                {PRODUCT_VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      onSelectVariant(v.id);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border ${
                      v.id === activeVariant.id
                        ? 'bg-white text-neutral-950 border-white'
                        : 'bg-white/5 text-white border-white/15 hover:bg-white/15'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeNav === 'company' && (
          <div className="mt-5 space-y-4 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            <p>
              <strong className="text-white">AERO-PUFF</strong> is an original technical outerwear concept focused on lightweight alpine insulation, recycled down fill, and interactive 3D digital product presentation.
            </p>
            <p>
              All 3D models, tangent-space ripstop normal maps, ORM maps, studio softbox HDR lighting, and vector marks in this showcase are original CC0 1.0 procedural works bundled locally with zero external dependencies.
            </p>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <span className="text-xs text-neutral-200">
                100% locally bundled glTF 2.0 binary asset pipeline with accessible WebP fallback support.
              </span>
            </div>
          </div>
        )}

        {activeNav === 'contact' && (
          <div className="mt-5">
            {contactSubmitted ? (
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/30 p-5 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="font-semibold text-white text-sm">Demo Inquiry Recorded</h3>
                <p className="text-xs text-neutral-300">
                  Thank you! Your message has been logged in this demo session.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactMessage('');
                    onClose();
                  }}
                  className="mt-2 inline-block rounded-full bg-white px-5 py-2 text-xs font-semibold text-neutral-950 cursor-pointer"
                >
                  Return to Product Stage
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!contactMessage.trim()) return;
                  setContactSubmitted(true);
                }}
                className="space-y-3"
              >
                <p className="text-xs text-neutral-300">
                  Have a question about sizing, 3D garment rendering, or wholesale availability? Send a demo note below:
                </p>
                <div>
                  <label htmlFor="contact-note" className="block text-xs font-medium text-neutral-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="contact-note"
                    rows={3}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Ask about the Solar Coral, Tactical Olive, or Pearl Silver puffer..."
                    className="w-full rounded-xl bg-black/50 border border-white/15 p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-2 focus:outline-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-medium text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-white hover:bg-neutral-200 px-5 py-2 text-xs font-semibold text-neutral-950 cursor-pointer"
                  >
                    Send Demo Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
