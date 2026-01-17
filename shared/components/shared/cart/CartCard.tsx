'use client';

import React from 'react';
import { CartStateItem } from '@/shared/lib/get-cart-details';
import { Button } from '@/shared/components/ui';

interface Props {
  item: CartStateItem;
  onRemove: (id: string) => Promise<void>;
  onUpdateQuantity: (id: string, quantity: number) => Promise<void>;
}

export const CartCard: React.FC<Props> = ({
  item,
  onRemove,
  onUpdateQuantity,
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleUpdate = async (quantity: number) => {
    setLoading(true);
    await onUpdateQuantity(item.id, quantity);
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    await onRemove(item.id);
    setLoading(false);
  };

  return (
    <div
      className={`border rounded-2xl p-6 bg-white relative flex justify-between items-center mb-2 transition-opacity ${
        loading ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div>
        <h4 className="font-bold">{item.name}</h4>
        <p>{item.price}₽</p>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={() => handleUpdate(item.quantity - 1)}>
          −
        </Button>

        <span>{item.quantity}</span>

        <Button onClick={() => handleUpdate(item.quantity + 1)}>
          +
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleRemove}
        >
          {loading ? '...' : '❌'}
        </Button>
      </div>
    </div>
  );
};
