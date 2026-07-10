import { create } from 'zustand';
import { Product, products } from '@/data/products';
import { useOrders } from '@/store/useOrders';

export interface Message {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  timestamp: number;
}

interface ConciergeStore {
  isOpen: boolean;
  contextProduct: Product | null;
  messages: Message[];
  setIsOpen: (isOpen: boolean, productContext?: Product | null) => void;
  sendMessage: (text: string) => void;
}

function getRuleBasedReply(text: string, get: () => ConciergeStore) {
  const lower = text.toLowerCase();

  if (lower.includes('shipping') || lower.includes('delivery')) {
    return 'We offer complimentary expedited shipping on all orders. Standard delivery typically takes 3-5 business days, while express delivery guarantees arrival within 1-2 business days.';
  }

  if (lower.includes('return') || lower.includes('refund')) {
    return 'Your satisfaction is our priority. Returns are graciously accepted within 7 days of delivery for any damaged, defective, or incorrect items in their original packaging.';
  }

  if (lower.includes('warranty')) {
    return 'All Maison Volt pieces are protected by a comprehensive 1-year limited warranty, covering any manufacturing defects. We stand behind the craftsmanship of our curation.';
  }

  if (lower.includes('track') || /ord-2026-\d{4}/i.test(text)) {
    const match = text.match(/ord-2026-\d{4}/i);

    if (!match) {
      return 'Please provide your specific order ID (e.g., ORD-2026-XXXX) so I may check its status for you.';
    }

    const orderId = match[0].toUpperCase();
    const status = useOrders.getState().getStatus(orderId);

    if (status === 'Out for delivery') {
      return `Order ${orderId} is currently out for delivery and should arrive before evening.`;
    }

    if (status === 'Processing') {
      return `Order ${orderId} is currently processing in our fulfillment boutique. It will be dispatched shortly.`;
    }

    if (status === 'Delivered') {
      return `Order ${orderId} has been marked as delivered. We hope you are enjoying your new piece.`;
    }

    return `I could not locate an order matching ${orderId}. Please confirm the reference and try again.`;
  }

  if (lower.includes('recommend')) {
    return 'Based on our current curation, I highly recommend the Monolith 4K Monitor. It is a stunning centerpiece that elevates both aesthetics and productivity. Alternatively, the VantaPhone X1 is exceptional for mobile professionals.';
  }

  const mentionedProducts = products.filter(p => lower.includes(p.name.toLowerCase().split(' ')[0]));

  if (mentionedProducts.length >= 2) {
    return `Comparing the ${mentionedProducts[0].name} and ${mentionedProducts[1].name}: They both represent the pinnacle of our collection in their respective categories. The ${mentionedProducts[0].name} features ${mentionedProducts[0].specs[0]}, while the ${mentionedProducts[1].name} excels with ${mentionedProducts[1].specs[0]}.`;
  }

  const { contextProduct } = get();

  if (contextProduct) {
    return `Regarding the ${contextProduct.name}: ${contextProduct.description} Is there a specific specification or compatibility question you have?`;
  }

  return 'I am here to guide your selection. Could you specify which piece in our collection you are inquiring about, or describe what you are looking to achieve with your setup?';
}

export const useConcierge = create<ConciergeStore>((set, get) => ({
  isOpen: false,
  contextProduct: null,
  messages: [
    {
      id: 'init-1',
      sender: 'concierge',
      text: 'Good evening. I am the Maison Volt Product Concierge. How may I assist you in finding the perfect addition to your setup?',
      timestamp: Date.now(),
    }
  ],
  setIsOpen: (isOpen, productContext = null) => {
    set((state) => {
      let newMessages = [...state.messages];
      
      // If opening with a new product context and it's different from current
      if (isOpen && productContext && state.contextProduct?.id !== productContext.id) {
        newMessages.push({
          id: Date.now().toString(),
          sender: 'concierge',
          text: `I see you are interested in the ${productContext.name}. It is an exquisite choice. What specific details would you like to know about it?`,
          timestamp: Date.now(),
        });
      }

      return {
        isOpen,
        contextProduct: productContext !== null ? productContext : state.contextProduct,
        messages: newMessages
      };
    });
  },
  sendMessage: async (text) => {
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text, timestamp: Date.now() };
    set((state) => ({ messages: [...state.messages, userMsg] }));

    setTimeout(() => {
      void (async () => {
        let replyText = '';

        try {
          const response = await fetch('/api/concierge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: text,
              contextProduct: get().contextProduct,
              orders: useOrders.getState().orders,
            }),
          });

          if (response.ok) {
            const data = await response.json() as { reply?: string };
            replyText = data.reply?.trim() || '';
          }
        } catch {
          replyText = '';
        }

        if (!replyText) replyText = getRuleBasedReply(text, get);

        const conciergeMsg: Message = { id: Date.now().toString() + '-reply', sender: 'concierge', text: replyText, timestamp: Date.now() };
        set((state) => ({ messages: [...state.messages, conciergeMsg] }));
      })();
    }, 800);
  }
}));
