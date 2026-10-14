"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CalendarRange, 
  TrendingUp, 
  GraduationCap, 
  BookOpen, 
  FileText 
} from "lucide-react";

const menuItems = [
  { name: "Página Inicial", path: "/", icon: LayoutDashboard },
  { name: "Planejamento", path: "/planejamento", icon: CalendarRange },
  { name: "Investimentos", path: "/investimentos", icon: TrendingUp },
  { name: "Hub Acadêmico", path: "/hub-academico", icon: GraduationCap },
  { name: "Educação Financeira", path: "/educacao", icon: BookOpen },
  { name: "Relatórios", path: "/relatorios", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-manns-panel border-r border-manns-border flex flex-col justify-between p-6 fixed left-0 top-0">
      <div>
        {/* Logo e Nome */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-manns-purple/20 border border-manns-purple flex items-center justify-center text-manns-purple font-bold text-xl {/* shadow-[0_0_15px_rgba(157,78,221,0.3)]*/}">
         m  
        
          </div>
          <span className="text-xl f  ont-bold tracking-wider text-white">MANNS</span>
        </div>

        {/* Links de Navegação */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-manns-purple/20 text-manns-green border border-manns-purple/30 shadow-inner"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} className={isActive ? "text-manns-green" : "text-zinc-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Perfil Simplificado na Base */}
      <div className="p-3 rounded-xl bg-white/5 border border-manns-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-manns-purple/40 border border-manns-purple/60 flex items-center justify-center text-xs font-semibold">
          PV
        </div>
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-white">Minha Conta</span>
          <span className="text-zinc-400">Conta Universitária</span>
        </div>
      </div>
    </aside>
  );
}