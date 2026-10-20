"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Sidebar from "@/components/sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isHelpPage = pathname === "/ajuda" || pathname?.startsWith("/ajuda");

  const handleBack = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  if (isHelpPage) {
    return (
      <div className="min-h-screen w-full bg-[#0B0914] text-white flex flex-col">
        {/* Barra Superior em largura total com o Botão de Voltar no Canto Superior Esquerdo */}
        <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0B0914]/90 backdrop-blur-md px-6 sm:px-10 py-4 flex items-center justify-between">
          <Link
            href="/"
            onClick={handleBack}
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-[#9D4EDD]/40 bg-[#131024] hover:bg-[#1C1832] hover:border-[#D6B2FF] text-white text-sm font-semibold transition-all group shadow-lg shadow-[#9D4EDD]/10 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#D6B2FF] group-hover:-translate-x-1 transition-transform" />
            <span>Voltar</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="font-semibold text-white">MANNS</span>
            <span>/</span>
            <span className="text-[#D6B2FF]">Central de Ajuda</span>
          </div>
        </header>

        <main className="flex-1 w-full p-4 sm:p-8 max-w-7xl mx-auto transition-all">
          {children}
        </main>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </>
  );
}
