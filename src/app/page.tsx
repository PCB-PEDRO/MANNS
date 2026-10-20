"use client";

import { useState } from "react";
import {
  Bell,
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";

interface Account {
  id: string;
  badge: string;
  badgeColor: string;
  lastDigits: string;
  type: string;
  balance: number;
  bankName: string;
  footerRight: string;
  footerRightColor: string;
  glowColor: string;
}

interface CategoryExpense {
  id: string;
  name: string;
  amount: number;
  color: string;
}

interface BudgetItem {
  id: string;
  initials: string;
  name: string;
  spent: number;
  limit: number;
  color: string;
}

export default function VisaoGeralPage() {
  // Estado das Contas Bancárias
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "nubank",
      badge: "nu",
      badgeColor: "#9D4EDD",
      lastDigits: "4821",
      type: "Conta corrente",
      balance: 1004.65,
      bankName: "Nubank",
      footerRight: "+4,6%",
      footerRightColor: "#4DE8B3",
      glowColor: "rgba(77, 232, 179, 0.08)",
    },
    {
      id: "inter",
      badge: "I",
      badgeColor: "#00E5FF",
      lastDigits: "7390",
      type: "Reserva estudantil",
      balance: 420.0,
      bankName: "Inter",
      footerRight: "+2,1%",
      footerRightColor: "#00E5FF",
      glowColor: "rgba(0, 229, 255, 0.08)",
    },
    {
      id: "c6",
      badge: "C",
      badgeColor: "#B583FF",
      lastDigits: "1044",
      type: "Fatura do cartão",
      balance: 600.0,
      bankName: "C6 Bank",
      footerRight: "Vence em 28 nov.",
      footerRightColor: "#71717A",
      glowColor: "rgba(157, 78, 221, 0.06)",
    },
  ]);

  // Estado das Despesas por Categoria
  const [categories, setCategories] = useState<CategoryExpense[]>([
    { id: "moradia", name: "Moradia", amount: 760, color: "#10E59B" },
    { id: "alimentacao", name: "Alimentação", amount: 425, color: "#00E5FF" },
    { id: "estudos", name: "Estudos", amount: 310, color: "#9D4EDD" },
    { id: "outros", name: "Outros", amount: 305, color: "#F4A261" },
  ]);

  // Estado do Orçamento Restante
  const [budgets, setBudgets] = useState<BudgetItem[]>([
    {
      id: "mercado",
      initials: "MA",
      name: "Mercado e alimentação",
      spent: 325,
      limit: 500,
      color: "#10E59B",
    },
    {
      id: "livros",
      initials: "LM",
      name: "Livros e materiais",
      spent: 190,
      limit: 350,
      color: "#00E5FF",
    },
    {
      id: "lazer",
      initials: "LP",
      name: "Lazer e passeios",
      spent: 240,
      limit: 300,
      color: "#F4A261",
    },
  ]);

  // Estados de Interatividade da UI
  const [selectedMonth, setSelectedMonth] = useState("Novembro");
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryExpense | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // Estado do Modal (Adicionar Receita / Despesa)
  const [modalType, setModalType] = useState<"receita" | "despesa" | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("nubank");
  const [selectedCategoryId, setSelectedCategoryId] = useState("alimentacao");

  // Cálculos dinâmicos
  const totalAccountsBalance = accounts.reduce((acc, item) => acc + item.balance, 0);
  const totalSpent = categories.reduce((acc, item) => acc + item.amount, 0);
  const monthlyBudgetLimit = 2400;

  // Configuração do SVG do Gráfico de Rosca
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  // Pré-cálculo das fatias do gráfico de acordo com o percentual de cada categoria
  let accumulatedPercent = 0;
  const donutSegments = categories.map((cat) => {
    const percent = totalSpent > 0 ? cat.amount / totalSpent : 0;
    const arcLength = percent * circumference;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;

    return {
      ...cat,
      percent,
      arcLength,
      strokeDashoffset,
    };
  });

  // Formatação de moeda
  const formatCurrency = (value: number, showDecimals = true) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    });
  };

  // Submissão do Modal de Receita / Despesa
  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseFloat(amountInput.replace(",", "."));
    if (isNaN(numericValue) || numericValue <= 0) return;

    if (modalType === "receita") {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === selectedAccountId
            ? { ...acc, balance: acc.balance + numericValue }
            : acc
        )
      );
    } else if (modalType === "despesa") {
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === selectedAccountId
            ? {
                ...acc,
                balance:
                  acc.id === "c6"
                    ? acc.balance + numericValue
                    : Math.max(0, acc.balance - numericValue),
              }
            : acc
        )
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategoryId
            ? { ...cat, amount: cat.amount + numericValue }
            : cat
        )
      );

      const budgetMap: Record<string, string> = {
        alimentacao: "mercado",
        estudos: "livros",
        outros: "lazer",
      };
      const targetBudgetId = budgetMap[selectedCategoryId];
      if (targetBudgetId) {
        setBudgets((prev) =>
          prev.map((b) =>
            b.id === targetBudgetId ? { ...b, spent: b.spent + numericValue } : b
          )
        );
      }
    }

    setAmountInput("");
    setModalType(null);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-9 pb-10 select-none">
      {/* CABEÇALHO SUPERIOR */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 block mb-1">
            TERÇA-FEIRA, 19 DE NOVEMBRO
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Bom dia, Alex
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Confira como estão suas finanças neste mês.
          </p>
        </div>

        {/* Ações do Topo */}
        <div className="flex items-center gap-3 relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificações"
            className="w-11 h-11 rounded-xl bg-[#131022] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 transition-all relative cursor-pointer"
          >
            <Bell size={18} />
            <span className="w-2 h-2 rounded-full bg-[#4DE8B3] absolute top-2.5 right-2.5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 w-72 rounded-2xl bg-[#161329] border border-white/10 p-4 shadow-2xl z-30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-white">Notificações</span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A fatura do seu <strong className="text-white">C6 Bank</strong> vence em 28 de nov.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setModalType("receita")}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#131022] border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/[0.04] hover:border-white/20 transition-all cursor-pointer"
          >
            <ArrowDown size={15} className="text-zinc-300" />
            <span>Adicionar Receita</span>
          </button>

          <button
            type="button"
            onClick={() => setModalType("despesa")}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#4DE8B3] text-[#090812] text-xs font-bold shadow-[0_0_25px_rgba(77,232,179,0.35)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
          >
            <ArrowUp size={15} strokeWidth={2.5} />
            <span>Adicionar Despesa</span>
          </button>
        </div>
      </header>

      {/* SEÇÃO: MINHAS CONTAS */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1">
              MINHAS CONTAS
            </span>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatCurrency(totalAccountsBalance)}
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-xs font-medium text-[#B583FF] hover:text-[#D6B2FF] transition-colors cursor-pointer"
          >
            <span>Ver todas</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              style={{
                background: `radial-gradient(circle at 90% 90%, ${acc.glowColor}, transparent 60%), #131022`,
              }}
              className="rounded-2xl border border-white/[0.07] p-6 flex flex-col justify-between min-h-[170px] hover:border-white/15 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-sm font-bold tracking-tight"
                    style={{ color: acc.badgeColor }}
                  >
                    {acc.badge}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">
                    •• {acc.lastDigits}
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Opções da conta"
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="my-4">
                <span className="text-xs text-zinc-400 block mb-1">
                  {acc.type}
                </span>
                <span className="text-2xl font-bold text-white tracking-tight">
                  {formatCurrency(acc.balance)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-medium">{acc.bankName}</span>
                <span
                  className="font-semibold"
                  style={{ color: acc.footerRightColor }}
                >
                  {acc.footerRight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO INFERIOR: RESUMO MENSAL E ORÇAMENTO RESTANTE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Esquerdo: Despesas por Categoria */}
        <div className="rounded-2xl bg-[#131022] border border-white/[0.07] p-7 flex flex-col justify-between">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1">
                RESUMO MENSAL
              </span>
              <h2 className="text-lg font-bold text-white">
                Despesas por Categoria
              </h2>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMonthOpen(!isMonthOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#19152B] border border-white/10 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <span>{selectedMonth}</span>
                <ChevronDown size={14} className="text-zinc-400" />
              </button>

              {isMonthOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-[#19152B] border border-white/10 py-1 shadow-xl z-20">
                  {["Outubro", "Novembro", "Dezembro"].map((mes) => (
                    <button
                      key={mes}
                      type="button"
                      onClick={() => {
                        setSelectedMonth(mes);
                        setIsMonthOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                        selectedMonth === mes
                          ? "text-[#4DE8B3] font-semibold bg-white/5"
                          : "text-zinc-300 hover:bg-white/5"
                      }`}
                    >
                      {mes}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Corpo: Gráfico Donut + Lista de Categorias */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 my-auto py-2">
            {/* Gráfico de Rosca (Donut Chart) com todas as cores proporcionais */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke="#1C1830"
                  strokeWidth="20"
                />

                {donutSegments.map((seg) => {
                  const isHovered = hoveredCategory?.id === seg.id;
                  const isAnyHovered = hoveredCategory !== null;

                  return (
                    <circle
                      key={seg.id}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth={isHovered ? "24" : "20"}
                      strokeDasharray={`${seg.arcLength} ${circumference}`}
                      strokeDashoffset={seg.strokeDashoffset}
                      strokeLinecap="butt"
                      onMouseEnter={() => setHoveredCategory(seg)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className="transition-all duration-300 cursor-pointer"
                      style={{
                        opacity: isAnyHovered && !isHovered ? 0.3 : 1,
                      }}
                    />
                  );
                })}
              </svg>

              {/* Texto Central do Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                <span className="text-[11px] text-zinc-400">
                  {hoveredCategory ? hoveredCategory.name : "Total gasto"}
                </span>
                <span className="text-2xl font-bold text-white tracking-tight my-0.5">
                  {hoveredCategory
                    ? formatCurrency(hoveredCategory.amount, false)
                    : formatCurrency(totalSpent, false)}
                </span>
                <span className="text-[11px] text-zinc-500">
                  {hoveredCategory
                    ? `${Math.round((hoveredCategory.amount / totalSpent) * 100)}% do total`
                    : `de ${formatCurrency(monthlyBudgetLimit, false)}`}
                </span>
              </div>
            </div>

            {/* Lista de Categorias */}
            <div className="w-full flex flex-col divide-y divide-white/[0.06]">
              {categories.map((cat) => {
                const percent = Math.round((cat.amount / totalSpent) * 100);
                const isHovered = hoveredCategory?.id === cat.id;

                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setHoveredCategory(cat)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="flex items-center justify-between py-3.5 px-2 rounded-lg hover:bg-white/[0.02] transition-all cursor-pointer"
                    style={{
                      opacity: hoveredCategory && !isHovered ? 0.4 : 1,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                        style={{
                          backgroundColor: cat.color,
                          transform: isHovered ? "scale(1.3)" : "scale(1)",
                        }}
                      />
                      <span
                        className={`text-xs transition-colors ${
                          isHovered ? "text-white font-semibold" : "text-zinc-300 font-medium"
                        }`}
                      >
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-bold text-white">
                        {formatCurrency(cat.amount, false)}
                      </span>
                      <span className="text-zinc-500 w-8 text-right">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card Direito: Orçamento Restante */}
        <div className="rounded-2xl bg-[#131022] border border-white/[0.07] p-7 flex flex-col justify-between">
          <div className="mb-6">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1">
              CONTROLE SEUS GASTOS
            </span>
            <h2 className="text-lg font-bold text-white">Orçamento Restante</h2>
          </div>

          <div className="flex flex-col justify-between gap-6 my-auto">
            {budgets.map((item) => {
              const remaining = Math.max(0, item.limit - item.spent);
              const progress = Math.min((item.spent / item.limit) * 100, 100);

              return (
                <div key={item.id} className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{
                      backgroundColor: `${item.color}15`,
                      color: item.color,
                    }}
                  >
                    {item.initials}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {item.name}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {formatCurrency(remaining, false)} restantes
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#1E1A34] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>

                    <span className="text-[11px] text-zinc-500 block">
                      {formatCurrency(item.spent, false)} gastos de{" "}
                      {formatCurrency(item.limit, false)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODAL INTERATIVO PARA ADICIONAR RECEITA OU DESPESA */}
      {modalType && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#151226] border border-white/10 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {modalType === "receita"
                  ? "Adicionar Nova Receita"
                  : "Adicionar Nova Despesa"}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="Ex: 150.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full rounded-xl bg-[#0D0B18] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DE8B3]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">
                  Conta
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full rounded-xl bg-[#0D0B18] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DE8B3]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bankName} ({acc.type})
                    </option>
                  ))}
                </select>
              </div>

              {modalType === "despesa" && (
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">
                    Categoria
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full rounded-xl bg-[#0D0B18] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DE8B3]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#4DE8B3] text-[#090812] text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Confirmar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}