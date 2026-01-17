'use client';

import { create } from 'zustand';
import { Api } from '@/shared/services/api-client';
import { CartStateItem, getCartDetails } from '@/shared/lib/get-cart-details';
import { CreateCartItemValues } from '@/shared/services/dto/cart.dto';

export interface CartState {
  loading: boolean;
  error: boolean;
  totalAmount: number;
  items: CartStateItem[];

  fetchCartItems: () => Promise<void>;
  addCartItem: (values: CreateCartItemValues) => Promise<void>;
  updateItemQuantity: (id: string, quantity: number) => Promise<void>;
  removeCartItem: (id: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,
  loading: true,
  error: false,

  fetchCartItems: async () => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.getCart();
      set(getCartDetails(data));
    } catch {
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
  
    addCartItem: async (values: { planId: string; quantity?: number }) => {
        try {
            set({ loading: true, error: false });
            const data = await Api.cart.addCartItem(values);
            set(getCartDetails(data));
        } catch (error) {
            console.error(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

  updateItemQuantity: async (id, quantity) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.updateItemQuantity(id, quantity);
      set(getCartDetails(data));
    } catch {
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  removeCartItem: async (id) => {
    try {
      set({ loading: true, error: false });
      const data = await Api.cart.removeCartItem(id);
      set(getCartDetails(data));
    } catch {
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },
}));
