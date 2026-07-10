import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useCheckoutStore } from '@/store/useCheckout';
import { useEffect } from 'react';

export function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, getTotals } = useCart();
  const { setIsOpen: setCheckoutOpen } = useCheckoutStore();
  const { subtotal } = getTotals();

  // Prevent background scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-card border-l border-white/5 z-50 flex flex-col animate-slide-in-right shadow-2xl">
        <div className="p-8 flex items-center justify-between border-b border-white/5">
          <h2 className="font-serif text-2xl tracking-wide">Your Selection</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
          >
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <ShoppingBag size={48} strokeWidth={0.5} />
              <div className="space-y-2">
                <p className="font-serif text-xl text-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Discover our curation of premium technology.</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-8 text-xs tracking-widest uppercase border-b border-primary text-primary pb-1 link-underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-6 animate-fade-in-up">
                <div className="w-24 h-24 bg-background overflow-hidden relative reveal-border group">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <h3 className="font-medium text-lg leading-tight">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4 border border-white/10 px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-medium tracking-wide">
                        ₱{item.product.price.toLocaleString()}
                      </span>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 border-t border-white/5 bg-background/50 backdrop-blur-md">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm text-muted-foreground uppercase tracking-widest">Subtotal</span>
              <span className="font-serif text-2xl">₱{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">Complimentary standard shipping on all orders. Taxes calculated at checkout.</p>
            <button 
              onClick={() => {
                setIsOpen(false);
                setCheckoutOpen(true);
              }}
              className="w-full bg-primary text-primary-foreground py-4 font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-300 flex items-center justify-center gap-3"
            >
              Proceed to Checkout
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
