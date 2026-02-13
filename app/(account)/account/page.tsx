import { Suspense } from "react"
import {
  ProfileFormSkeleton,
  SubscriptionsSkeleton,
  PlansSkeleton,
  CartSkeleton,
} from "@/shared/components/shared/skeleton"

import { ProfileFormServer } from "./_components/profile-form-server"
import { SubscriptionsServer } from "./_components/subscriptions-server"
import { PlansServer } from "./_components/plans-server"
import { CartServer } from "./_components/cart-server"
import { PaymentSuccessToast } from "./_components/payment-success-toast";

export default function ProfilePage() {
  return (
    <>
    <PaymentSuccessToast />
    
      <div className="space-y-10">
        
        <Suspense fallback={<ProfileFormSkeleton />}>
          <ProfileFormServer />
        </Suspense>

        <Suspense fallback={<SubscriptionsSkeleton />}>
          <SubscriptionsServer />
        </Suspense>

        <Suspense fallback={<PlansSkeleton />}>
          <PlansServer />
        </Suspense>

        <Suspense fallback={<CartSkeleton />}>
          <CartServer />
        </Suspense>
      </div>
    </>
  )
}
