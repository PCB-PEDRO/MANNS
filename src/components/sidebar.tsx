"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Home, 
  CalendarRange, 
  TrendingUp, 
  GraduationCap, 
  MessageSquareText, 
  FileText,
  HelpCircle,
  Settings,
  LogOut
} from "lucide-react";

const menuItems = [
  { 
    name: "Visão Geral", 
    path: "/", 
    icon: Home, 
    color: "#4DE8B3"
  },
  { 
    name: "Planejamento", 
    path: "/planejamento", 
    icon: CalendarRange, 
    color: "#D6B2FF"
  },
  { 
    name: "Investimentos", 
    path: "/investimentos", 
    icon: TrendingUp, 
    color: "#00E5FF"
  },
  { 
    name: "Hub Acadêmico", 
    path: "/hub-academico", 
    icon: GraduationCap, 
    color: "#FFD166"
  },
  { 
    name: "Educação Financeira", 
    path: "/educacao", 
    icon: MessageSquareText, 
    color: "#A8F45D"
  },
  { 
    name: "Relatórios", 
    path: "/relatorios", 
    icon: FileText, 
    color: "#FF85A1" 
  },
];

const secondaryItems = [
  { name: "Central de ajuda", path: "/ajuda", icon: HelpCircle },
  { name: "Configurações", path: "/configuracoes", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#0D0B18] border-r border-white/5 flex flex-col justify-between p-5 fixed left-0 top-0 select-none z-50">
      <div className="flex flex-col">
       {/* Logótipo e Nome */}
        <div className="flex items-center gap-3.5 px-1 mb-8 mt-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#9D4EDD] to-[#00E5FF] p-[1.5px] flex items-center justify-center shadow-[0_0_15px_rgba(157,78,221,0.35)] shrink-0">

            <div className="relative w-full h-full bg-[#131024] rounded-[10px] overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo MANNS"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <span className="text-xl font-bold tracking-wider text-white font-sans">MANNS</span>
        </div>
        {/* Título de Secção */}
        <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-3 mb-3">
          MENU PRINCIPAL
        </span>

        {/* Itens do Menu Principal */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-[#1C1832] shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
                style={
                  isActive
                    ? {
                        color: item.color,
                        boxShadow: `inset 0 0 15px ${item.color}0D`,
                      }
                    : undefined
                }
                >

                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-7 rounded-r-full"
                    style={{
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}`,
                    }}
                  />
                )}

                <Icon 
                  size={19} 
                  style={{ color: isActive ? item.color : undefined }}
                  className={!isActive ? "text-zinc-400 group-hover:text-zinc-200 transition-colors" : ""}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

     {/* Ajuda e Configurações em Ícones + Perfil */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          {secondaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                title={item.name}
                aria-label={item.name}
                className={`flex-1 flex items-center justify-center py-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#1C1832] text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                }`}
              >
                <Icon size={19} />
              </Link>
            );
          })}
        </div>

        <div className="h-[1px] bg-white/5" />

        {/* Perfil */}
        <div className="p-2.5 rounded-2xl bg-[#151226]/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9D4EDD] to-[#4DE8B3] flex items-center justify-center text-xs font-bold text-black shadow-inner">
              AM
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-semibold text-white tracking-wide">Arthur Mendes</span>
              <span className="text-[11px] text-zinc-400">Ciência da Computação</span>
            </div>
          </div>
          <button 
            type="button"
            aria-label="Terminar sessão"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}