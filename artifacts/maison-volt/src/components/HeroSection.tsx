import { ArrowDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const scrolled = window.scrollY;
      bgRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background with Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-background">
        <div 
          ref={bgRef}
          className="absolute inset-[-10%] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen transition-transform duration-75"
          style={{ backgroundImage: 'url(/attached_assets/generated_images/hero-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 text-center flex flex-col items-center max-w-4xl animate-fade-in-up">
        <span className="text-primary text-xs tracking-[0.3em] uppercase mb-6 opacity-80">
          The New Standard of Excellence
        </span>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-foreground mb-8 text-balance">
          Technology, Crafted as <span className="italic text-primary/90">Art</span>.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mb-12 text-balance leading-relaxed">
          Elevate your daily rituals with uncompromising performance wrapped in exceptional materials. A curation for the discerning few.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button 
            onClick={scrollToCollection}
            className="bg-primary text-primary-foreground px-10 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500 w-full sm:w-auto"
          >
            Explore Collection
          </button>
          <a 
            href="#laptops"
            className="border-b border-primary text-primary pb-1 text-sm tracking-widest uppercase hover:text-white hover:border-white transition-colors duration-300 w-full sm:w-auto text-center"
          >
            View Flagship
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-4 opacity-50 animate-pulse cursor-pointer hover:opacity-100 transition-opacity" onClick={scrollToCollection}>
        {/*<span className="text-[10px] tracking-[0.2em] uppercase writing-vertical">Scroll</span>*/}
        <ArrowDown size={16} strokeWidth={1} />
      </div>
    </section>
  );
}
