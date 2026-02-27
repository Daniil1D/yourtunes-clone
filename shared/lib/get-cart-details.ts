import { CartItem } from '@prisma/client';

export type CartStateItem = {
  id: string;
  planId: string;
  quantity: number;
  name: string;
  price: number;
  highlighted?: boolean;
  oldPrice?: number;
  disabled?: boolean;
};

interface ReturnProps {
  items: CartStateItem[];
  totalAmount: number;
}

export const getCartDetails = (data: { items: (CartItem & { plan: { title: string; price: number; oldPrice: number | null; highlighted: boolean } })[] }): ReturnProps => {
  const items: CartStateItem[] = data.items.map((item) => ({
    id: item.id,
    planId: item.planId,
    quantity: item.quantity,
    name: item.plan.title,
    price: item.quantity * item.plan.price,
    highlighted: item.plan.highlighted,
    oldPrice: item.plan.oldPrice ?? undefined,
    disabled: false,
  }));

  const totalAmount = items.reduce((acc, i) => acc + i.price, 0);

  return { items, totalAmount };
};
