import { useState } from 'react';
import { create } from 'zustand';

interface CheckoutStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
