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
  sendMessage: (text) => {
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text, timestamp: Date.now() };
    set((state) => ({ messages: [...state.messages, userMsg] }));

    // Rule-based logic
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyText = '';

      if (lower.includes('shipping') || lower.includes('delivery')) {
        replyText = 'We offer complimentary expedited shipping on all orders. Standard delivery typically takes 3-5 business days, while express delivery guarantees arrival within 1-2 business days.';
      } else if (lower.includes('return') || lower.includes('refund')) {
        replyText = 'Your satisfaction is our priority. Returns are graciously accepted within 7 days of delivery for any damaged, defective, or incorrect items in their original packaging.';
      } else if (lower.includes('warranty')) {
        replyText = 'All Maison Volt pieces are protected by a comprehensive 1-year limited warranty, covering any manufacturing defects. We stand behind the craftsmanship of our curation.';
      } else if (lower.includes('track') || /ord-2026-\d{4}/i.test(text)) {
        const match = text.match(/ord-2026-\d{4}/i);
        if (match) {
          const orderId = match[0].toUpperCase();
          const status = useOrders.getState().getStatus(orderId);
          if (status === 'Out for delivery') {
            replyText = `Order ${orderId} is currently out for delivery and should arrive before evening.`;
          } else if (status === 'Processing') {
            replyText = `Order ${orderId} is currently processing in our fulfillment boutique. It will be dispatched shortly.`;
          } else if (status === 'Delivered') {
            replyText = `Order ${orderId} has been marked as delivered. We hope you are enjoying your new piece.`;
          } else {
            replyText = `I could not locate an order matching ${orderId}. Please confirm the reference and try again.`;
          }
        } else {
          replyText = 'Please provide your specific order ID (e.g., ORD-2026-XXXX) so I may check its status for you.';
        }
      } else if (lower.includes('recommend')) {
        replyText = 'Based on our current curation, I highly recommend the Monolith 4K Monitor. It is a stunning centerpiece that elevates both aesthetics and productivity. Alternatively, the VantaPhone X1 is exceptional for mobile professionals.';
      } else {
        // Check for two product names for comparison
        let mentionedProducts = products.filter(p => lower.includes(p.name.toLowerCase().split(' ')[0]));
        if (mentionedProducts.length >= 2) {
          replyText = `Comparing the ${mentionedProducts[0].name} and ${mentionedProducts[1].name}: They both represent the pinnacle of our collection in their respective categories. The ${mentionedProducts[0].name} features ${mentionedProducts[0].specs[0]}, while the ${mentionedProducts[1].name} excels with ${mentionedProducts[1].specs[0]}.`;
        } else {
          // Contextual reply
          const { contextProduct } = get();
          if (contextProduct) {
            replyText = `Regarding the ${contextProduct.name}: ${contextProduct.description} Is there a specific specification or compatibility question you have?`;
          } else {
            replyText = 'I am here to guide your selection. Could you specify which piece in our collection you are inquiring about, or describe what you are looking to achieve with your setup?';
          }
        }
      }

      const conciergeMsg: Message = { id: Date.now().toString() + '-reply', sender: 'concierge', text: replyText, timestamp: Date.now() };
      set((state) => ({ messages: [...state.messages, conciergeMsg] }));
    }, 800);
  }
}));
