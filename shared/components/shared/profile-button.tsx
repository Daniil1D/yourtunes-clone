import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "../ui";
import { CircleUser, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}

export const ProfileButton: React.FC<Props> = ({
  onClickSignIn,
  className,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  const isAuthenticated = Boolean(session?.user?.id);

  return (
    <div className={className}>
      {isAuthenticated ? (
        <Link href="/account">
          <Button variant="secondary" className="flex items-center gap-2">
            <CircleUser size={18} />
            Профиль
          </Button>
        </Link>
      ) : (
        <Button
          onClick={() => router.push("/login")}
          variant="outline"
          className="flex items-center gap-1"
        >
          <User size={16} />
          Войти
        </Button>
      )}
    </div>
  );
};
