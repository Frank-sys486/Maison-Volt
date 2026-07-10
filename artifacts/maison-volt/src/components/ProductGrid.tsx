import { products } from '@/data/products';
import { ProductCard } from './ProductCard';

export function ProductGrid() {
  const categories = ['Laptops', 'Smartphones', 'Audio', 'Desk Setup', 'Smart Home', 'Travel Tech'];

  return (
    <div id="collection" className="bg-background pt-24 pb-32">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-24 max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-4xl md:text-5xl">The Full Collection</h2>
          <div className="w-12 h-[1px] bg-primary mx-auto"></div>
          <p className="text-muted-foreground font-light">Every piece meticulously selected for performance, aesthetics, and lasting value.</p>
        </div>

        <div className="space-y-32">
          {categories.map((category) => {
            const categoryProducts = products.filter(p => p.category === category);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={category} id={category.toLowerCase().replace(' ', '-')} className="scroll-mt-32">
                <div className="flex items-end justify-between border-b border-white/10 pb-4 mb-12">
                  <h3 className="text-2xl font-serif">{category}</h3>
                  <span className="text-xs uppercase tracking-widest text-primary">{categoryProducts.length} Pieces</span>
                </div>
                
                <div className="grid grid-cols-[minmax(0,320px)] sm:grid-cols-[repeat(auto-fit,minmax(280px,320px))] justify-center gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
