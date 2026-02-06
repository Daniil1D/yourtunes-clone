// "use client";

// import { Container } from "@/shared/components/shared"
// import { getUserSession } from "@/shared/lib/get-user-session"
// import { getUserSubscriptions } from "@/shared/lib/get-user-subscriptions"
// import { prisma } from "@/prisma/prisma-client"
// import { redirect } from "next/navigation"

// export async function SubscriptionsSection() {
//   const session = await getUserSession()
//   if (!session) redirect("/not-auth")

//   const user = await prisma.user.findFirst({
//     where: { id: String(session.id) },
//   })
//   if (!user) redirect("/not-auth")

//   const subscriptions = await getUserSubscriptions(user.id)

//   return (
//     <Container>
//       <div className="bg-white border rounded-2xl p-6">
//         <h2 className="text-xl font-bold mb-4">Мои тарифы</h2>

//         {!subscriptions.length && (
//           <p className="text-gray-500">Активных тарифов нет</p>
//         )}

//         <div className="space-y-3">
//           {subscriptions.map(sub => (
//             <div
//               key={sub.id}
//               className="border rounded-lg p-4 flex justify-between items-center"
//             >
//               <div>
//                 <p className="font-bold">{sub.plan.title}</p>
//                 {sub.expiresAt && (
//                   <p className="text-sm text-gray-500">
//                     Активен до{" "}
//                     <b>{new Date(sub.expiresAt).toLocaleDateString()}</b>
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Container>
//   )
// }
