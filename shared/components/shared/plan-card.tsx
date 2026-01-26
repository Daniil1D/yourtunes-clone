'use client';

import React from 'react'
import { Button } from '@/shared/components/ui';
import { useCartStore } from '@/shared/store/cart-store';
import { Spinner } from './spinner';

interface PlanCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  highlighted?: boolean;
  features: { text: string }[];
}

export const PlanCard: React.FC<PlanCardProps> = ({ id, title, price, oldPrice, features}) => {
  const { addCartItem, items } = useCartStore();
  
  const [loading, setLoading] = React.useState(false)

  const isInCart = items.some(item => item.planId === id);

   const onAddToCart = async () => {
    if (isInCart) return
    try {
      setLoading(true)
      await addCartItem({ planId: id })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="border rounded-2xl p-6 bg-white">
      <h3 className="text-xl font-bold mb-1">{title}</h3>

      <div className="mb-4">
        <span className="text-3xl font-bold">{price}₽</span>
        <span className="text-gray-400 ml-1">/ мес</span>
        {oldPrice && <div className="line-through">{oldPrice}₽</div>}
      </div>

      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li key={i}>• {f.text}</li>
        ))}
      </ul>

      <Button
        onClick={onAddToCart}
        disabled={isInCart}
        className="w-full flex items-center justify-center gap-2"
      >
        {loading && <Spinner />}
        {isInCart ? 'Выбран' : loading ? 'Добавляем…' : 'Выбрать'}
      </Button>
    </div>
  );
};