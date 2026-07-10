import { X, Send, Sparkles, User } from 'lucide-react';
import { useConcierge } from '@/store/useConcierge';
import { useState, useRef, useEffect } from 'react';

export function ConciergePanel() {
  const { isOpen, setIsOpen, messages, sendMessage, contextProduct } = useConcierge();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-card border-l border-white/10 z-50 flex flex-col animate-slide-in-right shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-background flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Sparkles size={16} />
              </div>
              <div>
                <h2 className="font-serif text-lg tracking-wide text-foreground">Product Concierge</h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Available</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <X size={20} strokeWidth={1} />
            </button>
          </div>
          {contextProduct && (
            <div className="mt-2 text-xs text-primary/80 border-t border-white/5 pt-2 flex items-center gap-2">
              <span className="uppercase tracking-widest text-[10px] opacity-70">Context:</span>
              <span className="truncate">{contextProduct.name}</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-card to-background">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}
            >
              <div className={`w-8 h-8 shrink-0 flex items-center justify-center border ${
                msg.sender === 'concierge' 
                  ? 'bg-primary/5 text-primary border-primary/20' 
                  : 'bg-white/5 text-foreground border-white/10'
              }`}>
                {msg.sender === 'concierge' ? <Sparkles size={14} /> : <User size={14} />}
              </div>
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-4 text-sm leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-white/10 text-foreground' 
                    : 'bg-primary/5 text-foreground/85 border border-primary/10 font-light'
                }`}>
                  {msg.text}
                </div>
                <div className="text-[10px] text-muted-foreground mt-2 opacity-50">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-white/5 bg-background">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about details, specs, or tracking..."
              className="w-full bg-card border border-white/10 pl-4 pr-12 py-4 focus:outline-none focus:border-primary transition-colors text-sm font-light placeholder:text-muted-foreground/50"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
            >
              <Send size={18} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
