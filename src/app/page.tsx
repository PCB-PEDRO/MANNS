export default function Home() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
          <p className="text-zinc-400 text-sm mt-1">Acompanhe seu saldo, despesas e metas do mês.</p>
        </div>
      </header>

      <div className="p-6 rounded-2xl bg-manns-panel border border-manns-border">
        <p className="text-zinc-400 text-sm">Dashboard em desenvolvimento...</p>
      </div>
    </div>
  );
}