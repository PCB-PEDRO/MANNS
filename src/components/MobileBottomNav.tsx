"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarRange,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

interface BottomTab {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

const bottomTabs: BottomTab[] = [
  {
    label: "Início",
    path: "/",
    icon: Home,
  },
  {
    label: "Planejar",
    path: "/planejamento",
    icon: CalendarRange,
  },
  {
    label: "Investir",
    path: "/investimentos",
    icon: TrendingUp,
  },
  {
    label: "Acadêmico",
    path: "/hub-academico",
    icon: GraduationCap,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal inferior"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0D0B18]/85 backdrop-blur-lg border-t border-white/[0.08] px-2 flex items-center justify-around select-none"
    >
      {bottomTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          tab.path === "/"
            ? pathname === "/"
            : pathname === tab.path || pathname?.startsWith(`${tab.path}/`);

        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`relative flex-1 min-h-[44px] py-1.5 flex flex-col items-center justify-center gap-1 rounded-xl transition-all duration-200 ${
              isActive
                ? "text-[#4DE8B3]"
                : "text-zinc-400 hover:text-zinc-200 active:scale-95"
            }`}
          >
            {/* Indicador Luminoso Superior da Aba Ativa */}
            {isActive && (
              <span
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[#4DE8B3] shadow-[0_0_12px_#4DE8B3]"
              />
            )}

            <Icon
              size={20}
              strokeWidth={isActive ? 2.4 : 1.9}
              className={
                isActive
                  ? "text-[#4DE8B3] drop-shadow-[0_0_8px_rgba(77,232,179,0.45)]"
                  : "text-zinc-400"
              }
            />

            <span
              className={`text-[11px] leading-none tracking-tight ${
                isActive ? "font-bold text-[#4DE8B3]" : "font-medium text-zinc-400"
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

