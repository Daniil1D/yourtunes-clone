'use client';

import { Button } from '@/shared/components/ui';

interface PlanCardProps {
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  highlighted?: boolean;
  features: { text: string }[];
}

export const PlanCard: React.FC<PlanCardProps> = ({ title, description, price, oldPrice, highlighted, features}) => {
  return (
    <div
      className={`border rounded-2xl p-6 bg-white relative ${
        highlighted ? 'border-black shadow-lg' : ''
      }`}
    >
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>

      <div className="mb-4">
        <span className="text-3xl font-bold">{price}₽</span>
        <span className="text-gray-400 ml-1">/ мес</span>

        {oldPrice && (
          <div className="text-sm text-gray-400 line-through">
            {oldPrice}₽
          </div>
        )}
      </div>

      <ul className="space-y-2 mb-6">
        {
        features.map((f, id) => (
          <li key={id} className="text-sm">
            • {f.text}
          </li>
        ))}
      </ul>

      <Button className="w-full">
        Оплатить
      </Button>
    </div>
  );
};
