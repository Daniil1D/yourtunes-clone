import { Container, Title } from "@/shared/components/shared";
import { BalanceActions } from "./_components/balance-actions";
import { getUserSession } from "@/shared/lib/get-user-session";
import { prisma } from "@/prisma/prisma-client";

export default async function BalancePage() {
    const session = await getUserSession();

    const user = await prisma.user.findFirst({
    where: { id: session?.id },
    });

    const balance = (user?.balance ?? 0);

  return (
    <Container className="my-10">
        <div className="space-y-10">

            <Title text="Баланс" size="xl" />


            <div className="rounded-3xl bg-white p-8 shadow-sm space-y-6">
                <p className="text-gray-500 text-sm">Текущий баланс:</p>

                <h2 className="text-6xl font-bold">
                    {balance.toFixed(2)} ₽
                </h2>

                <BalanceActions />
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-bold mb-6">Транзакции</h2>

                <div className="h-[250px] flex items-center justify-center text-gray-500">
                Здесь будут отображаться твои транзакции
                </div>
            </div>
        </div>
    </Container>
  );
}
