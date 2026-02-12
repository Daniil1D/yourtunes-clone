'use client';

import { Title } from "@/shared/components/shared";
import { Button } from "@/shared/components/ui";
import { useRouter } from "next/navigation";

interface Props {
  hasSubscription: boolean;
}

export function StaticsClient({ hasSubscription }: Props) {
  const router = useRouter();

  if (!hasSubscription) {
    return (
      <div className="space-y-10">
        <Title
          text="Оплатите подписку, чтобы раздел со статистикой был доступен"
          size="2xl"
          className="font-bold"
        />

        <Button onClick={() => router.push('/account')}>
          Оплатить
        </Button>
      </div>
    );
  }

  return (
    <Title
      text="Теперь страница доступна"
      size="2xl"
      className="font-bold"
    />
  );
}
