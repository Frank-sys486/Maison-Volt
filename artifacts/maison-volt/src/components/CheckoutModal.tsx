import { X, Check } from 'lucide-react';
import { useCheckoutStore } from '@/store/useCheckout';
import { useCart } from '@/store/useCart';
import { useOrders } from '@/store/useOrders';
import { useEffect, useRef, useState } from 'react';

export function CheckoutModal() {
  const { isOpen, setIsOpen } = useCheckoutStore();
  const { clearCart, getTotals } = useCart();
  const { createOrder } = useOrders();
  const { subtotal } = getTotals();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    cancelledRef.current = false;
    // Simulate network request
    setTimeout(() => {
      if (cancelledRef.current) return;
      setIsSubmitting(false);
      const generatedId = createOrder();
      setOrderId(generatedId);
      clearCart();
    }, 2000);
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    setTimeout(() => {
      setOrderId(null);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={orderId ? undefined : closeModal}
      />
      
      <div className="relative w-full max-w-2xl bg-card border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto animate-scale-in flex flex-col">
        {orderId ? (
          <div className="p-12 flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full border-2 border-primary text-primary flex items-center justify-center mb-4">
              <Check size={32} strokeWidth={1.5} />
            </div>
            <h2 className="font-serif text-3xl">Acquisition Confirmed</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your exquisite selection has been secured. Our fulfillment team is preparing your order with the utmost care.
            </p>
            <div className="bg-background border border-white/5 px-8 py-6 w-full max-w-sm mt-8 space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Order Reference</p>
              <p className="font-mono text-xl text-primary">{orderId}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              You may provide this reference to the Product Concierge to check its status.
            </p>
            <button 
              onClick={closeModal}
              className="mt-8 border border-white/20 px-8 py-3 uppercase tracking-widest text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Return to Boutique
            </button>
          </div>
        ) : (
          <>
            <div className="sticky top-0 bg-card/90 backdrop-blur-md p-6 border-b border-white/5 flex items-center justify-between z-10">
              <h2 className="font-serif text-2xl tracking-wide">Secure Checkout</h2>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground">
                <X size={24} strokeWidth={1} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-primary border-b border-white/5 pb-2">Client Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</label>
                    <input required type="text" className="w-full bg-background border border-white/10 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="e.g. Julian Beaufort" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Email Address</label>
                    <input required type="email" className="w-full bg-background border border-white/10 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="julian@example.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-primary border-b border-white/5 pb-2">Delivery Coordinates</h3>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Street Address</label>
                  <input required type="text" className="w-full bg-background border border-white/10 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="123 Luxury Lane, Suite 400" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">City</label>
                    <input required type="text" className="w-full bg-background border border-white/10 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="Makati City" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Postal Code</label>
                    <input required type="text" className="w-full bg-background border border-white/10 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" placeholder="1200" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-primary border-b border-white/5 pb-2">Payment Authorization (Mock)</h3>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">Card Number</label>
                  <input required type="text" className="w-full bg-background border border-white/10 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-mono" placeholder="4000 1234 5678 9010" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">Expiry Date</label>
                    <input required type="text" className="w-full bg-background border border-white/10 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-mono" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground">CVC</label>
                    <input required type="text" className="w-full bg-background border border-white/10 px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm font-mono" placeholder="123" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-4 font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Authorizing...' : `Authorize Payment of ₱${subtotal.toLocaleString()}`}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
