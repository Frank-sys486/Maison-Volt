import { X, Send, Sparkles, User } from 'lucide-react';
import { useConcierge } from '@/store/useConcierge';
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const WAIT_MESSAGES = [
  'Reviewing the product details with care.',
  'Matching your question to the collection notes.',
  'Preparing a concise concierge reply.',
  'Checking the relevant specifications.',
  'Looking over the product context.',
  'Refining the answer for clarity.',
  'Reading the details before responding.',
  'Comparing your question against the catalog.',
  'Composing a polished response.',
  'Verifying the available product information.',
  'Keeping the answer precise.',
  'Reviewing compatibility details.',
  'Distilling the essentials for you.',
  'Checking the concierge notes.',
  'Preparing the most useful guidance.',
  'Aligning the reply with the collection data.',
  'Reviewing the selected piece.',
  'Writing a careful recommendation.',
  'Checking policy and product context.',
  'Making sure the answer stays accurate.',
  'Gathering the relevant highlights.',
  'Preparing a tailored response.',
  'Reviewing your request thoughtfully.',
  'Checking the fine details.',
  'Keeping this concise and useful.',
  'Looking for the best answer in the catalog.',
  'Preparing a refined product note.',
  'Making the response easy to act on.',
  'Checking the product specifications once more.',
  'Almost ready with your concierge reply.',
];

function playConciergeReadyTone() {
  const AudioContextCtor = window.AudioContext || (window as Window & {
    webkitAudioContext?: typeof AudioContext;
  }).webkitAudioContext;

  if (!AudioContextCtor) return;

  const audio = new AudioContextCtor();
  const now = audio.currentTime;
  const masterGain = audio.createGain();

  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.exponentialRampToValueAtTime(1, now + 0.04);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
  masterGain.connect(audio.destination);

  [659.25, 880, 1318.51].forEach((frequency, index) => {
    const start = now + index * 0.12;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.22 / (index + 1), start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.75);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(start);
    oscillator.stop(start + 0.8);
  });

  window.setTimeout(() => {
    void audio.close();
  }, 1400);
}

export function ConciergePanel() {
  const { isOpen, setIsOpen, messages, sendMessage, contextProduct, isResponding } = useConcierge();
  const [input, setInput] = useState('');
  const [waitMessageIndex, setWaitMessageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wasRespondingRef = useRef(false);
  const waitMessage = WAIT_MESSAGES[waitMessageIndex];

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
  }, [messages, isOpen, isResponding, waitMessageIndex]);

  useEffect(() => {
    if (!isResponding) return;

    setWaitMessageIndex(0);
    const interval = window.setInterval(() => {
      setWaitMessageIndex((index) => (index + 1) % WAIT_MESSAGES.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, [isResponding]);

  useEffect(() => {
    if (wasRespondingRef.current && !isResponding) {
      try {
        playConciergeReadyTone();
      } catch {
        // Sound is a progressive enhancement; browsers may block it.
      }

      toast({
        title: 'Concierge reply ready',
        description: 'Your response has been prepared.',
      });
    }

    wasRespondingRef.current = isResponding;
  }, [isResponding]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isResponding) return;
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
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {isResponding ? 'Preparing reply' : 'Available'}
                  </span>
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
          {isResponding && (
            <div className="flex gap-4 animate-fade-in-up">
              <div className="w-8 h-8 shrink-0 flex items-center justify-center border bg-primary/5 text-primary border-primary/20">
                <Sparkles size={14} />
              </div>
              <div className="max-w-[80%] text-left">
                <div className="inline-block p-4 text-sm leading-relaxed bg-primary/5 text-foreground/85 border border-primary/10 font-light" aria-live="polite">
                  <span className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-primary animate-pulse" />
                    <span>{waitMessage}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-white/5 bg-background">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isResponding}
              placeholder={isResponding ? waitMessage : 'Ask about details, specs, or tracking...'}
              className="w-full bg-card border border-white/10 pl-4 pr-12 py-4 focus:outline-none focus:border-primary transition-colors text-sm font-light placeholder:text-muted-foreground/50 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isResponding}
              aria-label={isResponding ? 'Concierge reply in progress' : 'Send message'}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={18} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
