import { prisma } from "@/prisma/prisma-client";
import { Plans, ProfileForm } from "@/shared/components/shared";
import { CartList } from "@/shared/components/shared/cart";
import { getUserSession } from "@/shared/lib/get-user-session";
import { getUserSubscriptions } from "@/shared/lib/get-user-subscriptions";
import { redirect } from "next/navigation";
import { deactivateExpiredSubscriptions } from "@/app/actions";

export default async function Profilepage() {
  await deactivateExpiredSubscriptions();

  const session = await getUserSession();

  if (!session) {
    return redirect("/not-auth");
  }

  const user = await prisma.user.findFirst({
    where: { id: String(session.id) },
  });

  if (!user) {
    return redirect("/not-auth");
  }

  // 🔥 АКТИВНЫЕ ПОДПИСКИ
  const subscriptions = await getUserSubscriptions(user.id);

  console.log('subscriptions', subscriptions);

  // 📦 ВСЕ ТАРИФЫ (для покупки)
  const plans = await prisma.plan.findMany({
    include: { features: true },
    orderBy: { price: "asc" },
  });

  return (
    <div className="space-y-10">
      <ProfileForm data={user} />

      {/* 🟢 МОИ ТАРИФЫ */}
      <div className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Мои тарифы</h2>

        {!subscriptions.length && (
          <p className="text-gray-500">Активных тарифов нет</p>
        )}

        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="border rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{sub.plan.title}</p>
                {sub.expiresAt && (
                  <p className="text-sm text-gray-500">
                    Активен до{" "}
                    <b>{new Date(sub.expiresAt).toLocaleDateString()}</b>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🛒 ТАРИФЫ ДЛЯ ПОКУПКИ */}
      <Plans plans={plans} />

      {/* 🧺 КОРЗИНА */}
      <CartList />
    </div>
  );
}
