"use client";

import { cn } from "@/shared/lib/utils";
import React from "react";
import {
  User,
  Music,
  LayoutGrid,
  CreditCard,
  Banknote,
  Briefcase,
  HelpCircle,
  LifeBuoy,
} from "lucide-react";

import { useSideMenuStore } from "@/shared/store/side-menu";
import Link from "next/link";

interface Props {
  className?: string;
}

const menu = [
  { id: 1, icon: User, label: "Профиль", href: "/account" },
  { id: 2, icon: Music, label: "Релизы", href: "/releases" },
  { id: 3, icon: Music, label: "Топ чарты", href: "/charts"},
  { id: 4, icon: LayoutGrid, label: "Статистика", href: "/statistics" },
  { id: 5, icon: CreditCard, label: "Баланс", href: "/balance" },
  { id: 6, icon: Banknote, label: "Финансы", href: "/finans-analitica" },
  { id: 7, icon: Briefcase, label: "Услуги", href: "/dop-uslugi" },
  { id: 8, icon: HelpCircle, label: "Помощь", href: "/help" },
  { id: 9, icon: LifeBuoy, label: "Поддержка", href: "/support" },
];

export const SideMenu: React.FC<Props> = ({ className }) => {
  const sideMenuActiveId = useSideMenuStore((state) => state.activeId);
  const setSideMenuActiveId = useSideMenuStore((state) => state.setActiveId);

  return (
    <div
      className={cn(
        "h-full w-[240px] m-8 bg-white border rounded-2xl flex flex-col py-6 px-4 gap-2",
        className
      )}
    >
      {menu.map(({ id, icon: Icon, href, label }) => (
        <Link
          key={id}
          href={href}
          onClick={() => setSideMenuActiveId(id)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-black hover:bg-gray-50 transition",
            sideMenuActiveId === id && "text-black bg-gray-100 font-medium"
          )}
        >
          <Icon className="w-6 h-6" />
          <span className="text-sm">{label}</span>
        </Link>
      ))}
    </div>
  );
};

