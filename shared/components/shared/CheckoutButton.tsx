'use client';

import React from 'react';
import { Button } from '@/shared/components/ui';
import { createOrder } from '@/app/actions';

export const CheckoutButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const onCheckout = async () => {
    try {
      setLoading(true);

      const paymentUrl = await createOrder({

      } as any);

      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (err) {
      console.error('Ошибка оплаты', err);
      alert('Не удалось создать оплату');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={onCheckout}
      disabled={loading}
    >
      {loading ? 'Переход к оплате…' : 'Оплатить через ЮKassa'}
    </Button>
  );
};
