import { Plan, PlanFeature } from '@prisma/client';

export type PlanWithFeatures = Plan & {
  features: PlanFeature[];
};