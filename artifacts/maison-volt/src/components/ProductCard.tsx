import { Product } from '@/data/products';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useConcierge } from '@/store/useConcierge';
import { useEffect, useRef, useState } from 'react';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { setIsOpen: openConcierge } = useConcierge();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.35),
      {
        threshold: [0, 0.35],
        rootMargin: '-10% 0px -20% 0px',
      },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={cardRef} className="group relative flex flex-col bg-background/50 border border-white/5 hover:border-primary/30 transition-all duration-700 reveal-border">
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-3 py-1 font-medium shadow-lg">
            {product.badge}
          </div>
        )}
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            openConcierge(true, product);
          }}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-background/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          title="Ask Concierge"
        >
          <Sparkles size={14} />
        </button>

        <div 
          className="aspect-[4/5] overflow-hidden zoom-image-container cursor-pointer bg-card/30 relative"
          onClick={() => setModalOpen(true)}
        >
          <div className={`pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background via-background/30 to-transparent transition-opacity duration-700 ease-out group-hover:opacity-0 ${
            isInView ? 'opacity-35' : 'opacity-100'
          }`} />
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover opacity-95 brightness-90 contrast-105 saturate-90"
          />
        </div>

        <div className="p-6 flex flex-col flex-1 justify-between gap-6 cursor-pointer" onClick={() => setModalOpen(true)}>
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-serif text-xl leading-tight text-foreground/90 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">{product.category}</p>
            <p className="text-sm font-light text-foreground/70 line-clamp-2 pt-2">
              {product.shortDescription}
            </p>
          </div>
          
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <span className="font-medium tracking-wide">
              ₱{product.price.toLocaleString()}
            </span>
            <span className="text-xs uppercase tracking-widest flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0">
              Discover <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </div>

      <ProductModal 
        product={product} 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
}
