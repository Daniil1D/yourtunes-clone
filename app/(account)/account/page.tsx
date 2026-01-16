import { prisma } from "@/prisma/prisma-client";
import { Plans, ProfileForm } from "@/shared/components/shared";
import { getUserSession } from "@/shared/lib/get-user-session";
import { redirect } from "next/navigation";


export default async function Profilepage() {
    const session = await getUserSession();

    if (!session) {
        return redirect("/not-auth")
    }

    const user = await prisma.user.findFirst({ where: { id: String(session?.id) }})

    if (!user) {
        return redirect("/not-auth")
    }
    
    const plans = await prisma.plan.findMany({
        include: {
            features: true,
        },
        orderBy: {
            price: 'asc',
        },
    });
    
    return (
        <div>
            <ProfileForm data={user}/>

            <Plans plans={plans} />
        </div>
    )
}