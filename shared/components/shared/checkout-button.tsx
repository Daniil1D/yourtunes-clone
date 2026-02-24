'use client';

import React from 'react';
import { createOrder } from '@/app/actions/index';
import { Button } from '@/shared/components/ui';
import { Loader2, CreditCard } from 'lucide-react';

export const CheckoutButton: React.FC = () => {
  const [loading, setLoading] = React.useState(false);

  const onCheckout = async () => {
    try {
      setLoading(true);
      const paymentUrl = await createOrder();
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
      className="
        flex items-center gap-2
        bg-black text-white
        hover:bg-neutral-800
        transition-all
        px-6 py-3
        rounded-xl
        text-sm font-semibold
      "
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Переход к оплате…
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          Оплатить через ЮKassa
        </>
      )}
    </Button>
  );
};
