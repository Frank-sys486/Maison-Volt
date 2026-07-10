import { Header } from '@/components/Header';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { ConciergePanel } from '@/components/ConciergePanel';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedSection } from '@/components/FeaturedSection';
import { ProductGrid } from '@/components/ProductGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturedSection />
        <ProductGrid />
      </main>

      <footer className="bg-card border-t border-white/5 py-24">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2 space-y-6">
              <span className="font-serif text-2xl tracking-wide">MAISON VOLT</span>
              <p className="text-muted-foreground font-light max-w-sm text-sm leading-relaxed">
                A sanctuary for discerning individuals seeking technology that reflects their exacting standards and refined aesthetic sensibilities.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-widest text-primary">Explore</h4>
              <ul className="space-y-4 text-sm font-light text-muted-foreground">
                <li><a href="#laptops" className="hover:text-primary transition-colors">Laptops</a></li>
                <li><a href="#smartphones" className="hover:text-primary transition-colors">Smartphones</a></li>
                <li><a href="#audio" className="hover:text-primary transition-colors">Audio</a></li>
                <li><a href="#desk-setup" className="hover:text-primary transition-colors">Desk Setup</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs uppercase tracking-widest text-primary">Services</h4>
              <ul className="space-y-4 text-sm font-light text-muted-foreground">
                <li><button className="hover:text-primary transition-colors">Product Concierge</button></li>
                <li><button className="hover:text-primary transition-colors">Shipping & Returns</button></li>
                <li><button className="hover:text-primary transition-colors">Warranty Info</button></li>
                <li><button className="hover:text-primary transition-colors">Track Order</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-light">
            <p>&copy; {new Date().getFullYear()} Maison Volt. All rights reserved.</p>
            <div className="flex gap-6 uppercase tracking-widest">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Cookies</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Overlay Components */}
      <CartDrawer />
      <CheckoutModal />
      <ConciergePanel />
    </div>
  );
}
