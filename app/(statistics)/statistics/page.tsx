import { getUserSession } from "@/shared/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";
import { Title } from "@/shared/components/shared";
import { StaticsClient } from "./_components/statics-client";

export default async function StatisticsPage() {
  const user = await getUserSession();

  if (!user) {
    return (
      <Title
        text="Вы не авторизованы"
        size="2xl"
        className="font-bold"
      />
    );
  }

  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      active: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  const hasSubscription = Boolean(activeSubscription);

  return <StaticsClient hasSubscription={hasSubscription} />;
}
