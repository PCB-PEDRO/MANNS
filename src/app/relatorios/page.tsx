export default function RelatoriosPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Relatórios</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Exporte demonstrativos mensais, gráficos de evolução e balanços.
        </p>
      </div>

      <div className="rounded-2xl border border-white/5 bg-[#131024] p-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#FF85A1]">
          Módulo em Construção
        </span>
        <p className="text-zinc-300 mt-2">Exportação em PDF/CSV e gráficos comparativos.</p>
      </div>
    </div>
  );
}