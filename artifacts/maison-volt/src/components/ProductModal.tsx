import { Product } from '@/data/products';
import { X, Sparkles, ShieldCheck, Check, Star } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useConcierge } from '@/store/useConcierge';
import { useState, useEffect } from 'react';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const { setIsOpen: openConcierge } = useConcierge();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else {
      document.body.style.overflow = '';
      setAdded(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-12 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <div className="relative w-full h-full md:h-auto md:max-h-[90vh] max-w-6xl bg-background md:border md:border-white/10 shadow-2xl overflow-hidden animate-scale-in flex flex-col md:flex-row">
        
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20"
        >
          <X size={20} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-card h-[40vh] md:h-auto relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover mix-blend-lighten opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 flex flex-col max-h-full overflow-y-auto custom-scrollbar">
          <div className="sticky top-0 bg-background/90 backdrop-blur-md p-6 md:p-8 flex items-start justify-between z-10 border-b border-white/5">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary mb-2">{product.category}</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{product.name}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center text-primary">
                  <Star size={14} fill="currentColor" className="mr-1" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-border"></span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> In Stock
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="hidden md:flex text-muted-foreground hover:text-primary transition-colors p-2"
            >
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-10 flex-1">
            <div>
              <p className="text-2xl font-medium tracking-wide mb-6">₱{product.price.toLocaleString()}</p>
              <p className="text-foreground/80 leading-relaxed font-light text-sm md:text-base">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-primary border-b border-white/5 pb-2">Technical Specifications</h3>
              <ul className="space-y-3">
                {product.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 font-light">
                    <span className="text-primary mt-1">•</span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-white/5 border border-white/10 p-4">
              <ShieldCheck size={18} className="text-primary" />
              <span>{product.warranty}</span>
            </div>
          </div>

          <div className="sticky bottom-0 p-6 md:p-8 bg-background/90 backdrop-blur-md border-t border-white/5 flex flex-col sm:flex-row gap-4 z-10">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-primary-foreground py-4 font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
            >
              {added ? (
                <><Check size={18} /> Added to Collection</>
              ) : (
                'Add to Cart'
              )}
            </button>
            <button 
              onClick={() => {
                onClose();
                openConcierge(true, product);
              }}
              className="sm:w-auto w-full border border-white/20 py-4 px-6 font-medium tracking-widest uppercase text-xs hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Sparkles size={16} className="group-hover:scale-110 transition-transform" />
              Ask Concierge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
