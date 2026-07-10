import { Link } from 'wouter';
import { ShoppingCart, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { useState, useEffect } from 'react';
import { useConcierge } from '@/store/useConcierge';

export function Header() {
  const { getTotals, setIsOpen: setCartOpen } = useCart();
  const { setIsOpen: setConciergeOpen } = useConcierge();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count } = getTotals();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Laptops', href: '#laptops' },
    { name: 'Smartphones', href: '#smartphones' },
    { name: 'Audio', href: '#audio' },
    { name: 'Desk Setup', href: '#desk-setup' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-white/5 py-4'
            : 'bg-transparent py-8'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              <Menu size={24} strokeWidth={1} />
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
            {navLinks.slice(0, 2).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/70 hover:text-primary transition-colors link-underline pb-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
            <span className="font-serif text-2xl md:text-3xl tracking-wide text-foreground group-hover:text-primary transition-colors duration-500">
              MAISON VOLT
            </span>
          </Link>

          <div className="flex items-center gap-6 justify-end">
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase mr-4">
              {navLinks.slice(2).map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-foreground/70 hover:text-primary transition-colors link-underline pb-1"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <button
              onClick={() => setConciergeOpen(true)}
              className="text-foreground/80 hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <Sparkles size={20} strokeWidth={1} className="group-hover:scale-110 transition-transform duration-500" />
              <span className="hidden lg:inline text-xs tracking-widest uppercase font-medium">Concierge</span>
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-foreground/80 hover:text-primary transition-colors"
            >
              <ShoppingCart size={20} strokeWidth={1} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md animate-fade-in flex flex-col">
          <div className="p-6 flex justify-end">
            <button onClick={() => setMobileMenuOpen(false)} className="text-foreground/80 hover:text-primary">
              <X size={32} strokeWidth={1} />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-8 pb-20">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-3xl text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="w-12 h-[1px] bg-border my-4" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setConciergeOpen(true);
              }}
              className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors mt-4"
            >
              <Sparkles size={20} strokeWidth={1} />
              <span className="tracking-widest uppercase text-sm">Product Concierge</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
