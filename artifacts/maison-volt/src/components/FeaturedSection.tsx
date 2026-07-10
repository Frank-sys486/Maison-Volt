import { products } from '@/data/products';
import { ProductCard } from './ProductCard';
import { ArrowRight } from 'lucide-react';

export function FeaturedSection() {
  const featured = products.filter(p => p.badge).slice(0, 3);

  return (
    <section className="py-32 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-background mix-blend-overlay opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-primary">Curated Selection</span>
            <h2 className="font-serif text-4xl md:text-5xl text-balance">The Apex of Modern Technology</h2>
          </div>
          <p className="text-muted-foreground font-light text-sm max-w-sm">
            Discover the pieces that define the Maison Volt experience. Uncompromising design meets unparalleled capability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
