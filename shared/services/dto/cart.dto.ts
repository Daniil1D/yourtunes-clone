import { CartItem, Plan } from '@prisma/client';

export type CartItemDTO = CartItem & {
  plan: Plan;
};

export interface CartDTO {
  items: CartItemDTO[];
}

export interface CreateCartItemValues {
  planId: string;
  quantity?: number;
}