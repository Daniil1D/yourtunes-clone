'use client';

import { Container } from './container';
import { Title } from './title';
import { PlanCard } from './plan-card';
import { PlanWithFeatures } from '@/@types/prisma';

interface PlansProps {
  plans: PlanWithFeatures[];
}

export const Plans: React.FC<PlansProps> = ({ plans }) => {
  return (
    <Container className="my-10">
      <Title text="Выберите тариф" size="md" className="font-bold mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <PlanCard
            key={plan.id}
            title={plan.title}
            description={plan.description}
            price={plan.price}
            oldPrice={plan.oldPrice ?? undefined}
            highlighted={plan.highlighted}
            features={plan.features}
          />
        ))}
      </div>
    </Container>
  );
};