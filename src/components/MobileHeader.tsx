"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  CalendarRange,
  TrendingUp,
  GraduationCap,
  MessageSquareText,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
}

const mainMenuItems: NavItem[] = [
  {
    name: "Visão Geral",
    path: "/",
    icon: Home,
    color: "#4DE8B3",
  },
  {
    name: "Planejamento",
    path: "/planejamento",
    icon: CalendarRange,
    color: "#D6B2FF",
  },
  {
    name: "Investimentos",
    path: "/investimentos",
    icon: TrendingUp,
    color: "#00E5FF",
  },
  {
    name: "Hub Acadêmico",
    path: "/hub-academico",
    icon: GraduationCap,
    color: "#FFD166",
  },
  {
    name: "Educação Financeira",
    path: "/educacao",
    icon: MessageSquareText,
    color: "#A8F45D",
  },
  {
    name: "Relatórios",
    path: "/relatorios",
    icon: FileText,
    color: "#FF85A1",
  },
];

const secondaryMenuItems = [
  { name: "Central de ajuda", path: "/ajuda", icon: HelpCircle },
  { name: "Configurações", path: "/configuracoes", icon: Settings },
];

export default function MobileHeader() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fecha o drawer automaticamente ao mudar de rota
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  // Trava o scroll do body quando o drawer estiver aberto
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <>
      {/* Barra Superior Fixa Exclusiva para Mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#0D0B18]/85 backdrop-blur-md border-b border-white/[0.07] px-4 flex items-center justify-between select-none">
        {/* Esquerda: Logo + Nome MANNS */}
        <Link
          href="/"
          className="flex items-center gap-3 min-h-[44px] py-1 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9D4EDD] to-[#00E5FF] p-[1.5px] flex items-center justify-center shadow-[0_0_15px_rgba(157,78,221,0.35)] shrink-0">
            <div className="relative w-full h-full bg-[#131024] rounded-[10px] overflow-hidden">
              <Image
                src="/logo.png"
                alt="Logo MANNS"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
          </div>
          <span className="text-lg font-bold tracking-wider text-white font-sans">
            MANNS
          </span>
        </Link>

        {/* Direita: Botão Hambúrguer com Área de Toque Mínima de 44px */}
        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-label={isDrawerOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          aria-expanded={isDrawerOpen}
          className="min-w-[44px] min-h-[44px] rounded-xl bg-[#131024] border border-white/10 flex items-center justify-center text-zinc-200 hover:text-white hover:border-white/20 active:scale-95 transition-all cursor-pointer"
        >
          {isDrawerOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Drawer Lateral Deslizante (Off-Canvas) */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          isDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isDrawerOpen}
      >
        {/* Backdrop Escuro Translúcido */}
        <div
          onClick={() => setIsDrawerOpen(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Painel Lateral Deslizante */}
        <aside
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[#0D0B18] border-l border-white/10 p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out select-none overflow-y-auto ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col">
            {/* Topo do Drawer */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#9D4EDD] to-[#00E5FF] p-[1.5px] flex items-center justify-center shrink-0">
                  <div className="relative w-full h-full bg-[#131024] rounded-[10px] overflow-hidden">
                    <Image
                      src="/logo.png"
                      alt="Logo MANNS"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <span className="text-base font-bold tracking-wider text-white block leading-none">
                    MANNS
                  </span>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1 block">
                    Navegação Mobile
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="Fechar menu"
                className="min-w-[44px] min-h-[44px] rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Rótulo Menu Principal */}
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-2 mb-2.5">
              MÓDULOS DA PLATAFORMA
            </span>

            {/* Lista Completa de Rotas Principais */}
            <nav className="flex flex-col gap-1.5">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`relative min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#1C1832] font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                    }`}
                    style={
                      isActive
                        ? {
                            color: item.color,
                            boxShadow: `inset 0 0 15px ${item.color}12`,
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

                    <div className="flex items-center gap-3.5">
                      <Icon
                        size={19}
                        style={{ color: isActive ? item.color : undefined }}
                        className={!isActive ? "text-zinc-400" : ""}
                      />
                      <span>{item.name}</span>
                    </div>

                    <ChevronRight
                      size={15}
                      style={{ color: isActive ? item.color : undefined }}
                      className={!isActive ? "text-zinc-600" : ""}
                    />
                  </Link>
                );
              })}
            </nav>

            {/* Links Secundários (Ajuda e Configurações) */}
            <span className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-2 mt-6 mb-2.5">
              SUPORTE & SISTEMA
            </span>

            <div className="flex flex-col gap-1.5">
              {secondaryMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#1C1832] text-white font-semibold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon size={19} className="text-[#D6B2FF]" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight size={15} className="text-zinc-600" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Rodapé do Drawer com Perfil */}
          <div className="pt-4 mt-6 border-t border-white/[0.07]">
            <div className="p-3 rounded-2xl bg-[#151226]/80 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9D4EDD] to-[#4DE8B3] flex items-center justify-center text-xs font-bold text-black shadow-inner shrink-0">
                  AM
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-white tracking-wide">
                    Arthur Mendes
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Ciência da Computação
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label="Terminar sessão"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

