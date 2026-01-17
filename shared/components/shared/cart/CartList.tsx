'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/shared/store/cart-store';
import { CartCard } from './CartCard';
import { Button } from '@/shared/components/ui';
import { Container } from '../container';
import { CheckoutButton } from '../CheckoutButton';

export const CartList: React.FC = () => {
  const { items, totalAmount, fetchCartItems, updateItemQuantity, removeCartItem } = useCartStore();

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  if (!items.length) return <p>Корзина пуста</p>;

  return (
    <Container className="my-10">
      <div className="border p-4 rounded-2xl bg-white mt-6">
        <h3 className="font-bold mb-4">Корзина</h3>
        {items.map((item) => (
          <CartCard
            key={item.id}
            item={item}
            onRemove={removeCartItem}
            onUpdateQuantity={updateItemQuantity}
          />
        ))}
        <div className="flex justify-between mt-4 items-center">
          <span className="font-bold">Итого: {totalAmount}₽</span>
          <CheckoutButton />
        </div>
      </div>
    </Container>
   
  );
};
