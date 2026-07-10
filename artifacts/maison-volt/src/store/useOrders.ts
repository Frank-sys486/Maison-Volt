import { create } from 'zustand';

export type OrderStatus = 'Processing' | 'Out for delivery' | 'Delivered';

interface OrdersStore {
  orders: Record<string, OrderStatus>;
  createOrder: () => string;
  getStatus: (orderId: string) => OrderStatus | undefined;
}

const SEED_ORDERS: Record<string, OrderStatus> = {
  'ORD-2026-4921': 'Out for delivery',
  'ORD-2026-1834': 'Processing',
  'ORD-2026-7750': 'Delivered',
};

export const useOrders = create<OrdersStore>((set, get) => ({
  orders: { ...SEED_ORDERS },
  createOrder: () => {
    let id: string;
    do {
      id = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    } while (get().orders[id]);

    set((state) => ({ orders: { ...state.orders, [id]: 'Processing' } }));
    return id;
  },
  getStatus: (orderId) => get().orders[orderId.toUpperCase()],
}));
