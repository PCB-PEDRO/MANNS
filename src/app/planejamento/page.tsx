"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Bell,
  Calendar,
  ChevronDown,
  ArrowRight,
  MoreHorizontal,
  Plus,
  Wallet,
  ArrowLeftRight,
  X,
  CheckCircle2,
  Clock,
  CalendarDays,
  TrendingUp,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";

// Tipos e Interfaces
interface FixedEntry {
  id: string;
  description: string;
  amount: number;
  dueDay: number;
  type: "income" | "expense";
}

interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
  color: string;
}

interface ForecastItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  amount: number;
  status: "Confirmado" | "Estimado";
  dotColor: string;
}

interface CategorySpending {
  id: string;
  name: string;
  amount: number;
  percent: number;
  color: string;
}

interface CategoryEvolution {
  id: string;
  name: string;
  current: number;
  target: number;
  previous: number;
}

export default function PlanejamentoPage() {
  // 1. Estado do Cabeçalho e Filtros
  const [selectedMonth, setSelectedMonth] = useState("Novembro de 2025");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  // 2. Estado de Notificações
  const [notifications, setNotifications] = useState([
    {
      id: "n1",
      title: "Vencimento próximo",
      desc: "Quarto da república vence em 3 dias (R$ 680,00)",
      time: "Há 10 min",
      read: false,
    },
    {
      id: "n2",
      title: "Meta de Alimentação",
      desc: "Você utilizou 85% do limite planejado para o mês",
      time: "Há 2 horas",
      read: false,
    },
    {
      id: "n3",
      title: "Previsão de Bolsa",
      desc: "Crédito de R$ 1.200,00 da Bolsa confirmado para o dia 15",
      time: "Ontem",
      read: false,
    },
  ]);

  // 3. Estados das Receitas e Despesas Fixas
  const [fixedIncomes, setFixedIncomes] = useState<FixedEntry[]>([
    { id: "fi-1", description: "Bolsa de estágio", amount: 1200, dueDay: 15, type: "income" },
    { id: "fi-2", description: "Auxílio permanência / Família", amount: 650, dueDay: 10, type: "income" },
  ]);

  const [fixedExpenses, setFixedExpenses] = useState<FixedEntry[]>([
    { id: "fe-1", description: "Quarto em república", amount: 680, dueDay: 10, type: "expense" },
    { id: "fe-2", description: "Rateio internet & luz", amount: 115, dueDay: 15, type: "expense" },
    { id: "fe-3", description: "Passe transporte estudantil", amount: 95, dueDay: 5, type: "expense" },
    { id: "fe-4", description: "Streaming & nuvem acadêmica", amount: 45, dueDay: 20, type: "expense" },
  ]);

  // Formulário Rápido de Receita Fixa
  const [incomeDesc, setIncomeDesc] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeDueDay, setIncomeDueDay] = useState("Dia 10");

  // Formulário Rápido de Despesa Fixa
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDueDay, setExpenseDueDay] = useState("Dia 10");

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // 4. Estado de Transações do Mês Atual
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-1",
      title: "Supermercado & Feira",
      category: "Alimentação",
      date: "18 nov.",
      amount: -146.32,
      type: "expense",
      color: "#FF85A1",
    },
    {
      id: "tx-2",
      title: "Bolsa de estágio",
      category: "Receita fixa",
      date: "15 nov.",
      amount: 1200.0,
      type: "income",
      color: "#4DE8B3",
    },
    {
      id: "tx-3",
      title: "Quarto em república",
      category: "Moradia",
      date: "10 nov.",
      amount: -680.0,
      type: "expense",
      color: "#FF85A1",
    },
    {
      id: "tx-4",
      title: "Auxílio permanência",
      category: "Receita fixa",
      date: "08 nov.",
      amount: 650.0,
      type: "income",
      color: "#4DE8B3",
    },
    {
      id: "tx-5",
      title: "Xerox e livros acadêmicos",
      category: "Estudos",
      date: "05 nov.",
      amount: -68.5,
      type: "expense",
      color: "#FF85A1",
    },
    {
      id: "tx-6",
      title: "Restaurante Universitário",
      category: "Alimentação",
      date: "02 nov.",
      amount: -42.0,
      type: "expense",
      color: "#FF85A1",
    },
  ]);

  // 5. Estado de Previsão do Próximo Mês
  const [forecastItems, setForecastItems] = useState<ForecastItem[]>([
    {
      id: "fc-1",
      title: "Quarto em república",
      category: "Moradia",
      dueDate: "10 dez.",
      amount: 680.0,
      status: "Confirmado",
      dotColor: "#9D4EDD",
    },
    {
      id: "fc-2",
      title: "Bolsa de estágio",
      category: "Receita fixa",
      dueDate: "15 dez.",
      amount: 1200.0,
      status: "Confirmado",
      dotColor: "#00E5FF",
    },
    {
      id: "fc-3",
      title: "Rateio internet da república",
      category: "Serviços",
      dueDate: "18 dez.",
      amount: 65.0,
      status: "Estimado",
      dotColor: "#9D4EDD",
    },
    {
      id: "fc-4",
      title: "Passe de ônibus / metrô",
      category: "Transporte",
      dueDate: "22 dez.",
      amount: 95.0,
      status: "Estimado",
      dotColor: "#9D4EDD",
    },
    {
      id: "fc-5",
      title: "Rateio de luz da república",
      category: "Moradia",
      dueDate: "24 dez.",
      amount: 50.0,
      status: "Estimado",
      dotColor: "#9D4EDD",
    },
  ]);

  // 6. Dados da Distribuição Mensal (Gastos por Subcategoria)
  const [categoriesSpending, setCategoriesSpending] = useState<CategorySpending[]>([
    { id: "moradia", name: "Moradia (República)", amount: 680, percent: 46, color: "#9D4EDD" },
    { id: "alimentacao", name: "Alimentação (RU/Feira)", amount: 385, percent: 26, color: "#4DE8B3" },
    { id: "estudos", name: "Estudos & Cópias", amount: 145, percent: 10, color: "#FF85A1" },
    { id: "transporte", name: "Transporte Estudantil", amount: 130, percent: 9, color: "#00E5FF" },
    { id: "lazer", name: "Lazer Universitário", amount: 95, percent: 6, color: "#FFB703" },
    { id: "outros", name: "Outros", amount: 45, percent: 3, color: "#7B2CBF" },
  ]);

  // 7. Dados da Evolução por Categoria
  const evolutionData: CategoryEvolution[] = [
    { id: "moradia", name: "Moradia", current: 680, target: 700, previous: 680 },
    { id: "alimentacao", name: "Alimentação", current: 385, target: 420, previous: 360 },
    { id: "estudos", name: "Estudos", current: 145, target: 180, previous: 130 },
    { id: "transporte", name: "Transporte", current: 130, target: 150, previous: 125 },
    { id: "lazer", name: "Lazer", current: 95, target: 140, previous: 110 },
  ];

  // Modais
  const [showAllTransactionsModal, setShowAllTransactionsModal] = useState(false);
  const [modalFilter, setModalFilter] = useState<"all" | "income" | "expense">("all");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(10);
  const [showDistributionMenu, setShowDistributionMenu] = useState(false);

  // Estados de Hover interativo nos gráficos
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredEvolutionCategory, setHoveredEvolutionCategory] = useState<CategoryEvolution | null>(null);

  // Cálculos dinâmicos
  const totalFixedIncomes = useMemo(
    () => fixedIncomes.reduce((acc, curr) => acc + curr.amount, 0),
    [fixedIncomes]
  );

  const totalFixedExpenses = useMemo(
    () => fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0),
    [fixedExpenses]
  );

  const totalSpentCategories = useMemo(
    () => categoriesSpending.reduce((acc, curr) => acc + curr.amount, 0),
    [categoriesSpending]
  );

  // Formatação em Moeda
  const formatCurrency = (val: number, decimals = true) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0,
    });
  };

  // Submissão de Receita Fixa
  const handleAddFixedIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(incomeAmount.replace(",", "."));
    if (!incomeDesc.trim() || isNaN(cleanAmount) || cleanAmount <= 0) {
      showToast("Por favor, preencha a descrição e um valor válido.");
      return;
    }

    const dayNum = parseInt(incomeDueDay.replace(/\D/g, ""), 10) || 10;
    const newEntry: FixedEntry = {
      id: `fi-${Date.now()}`,
      description: incomeDesc.trim(),
      amount: cleanAmount,
      dueDay: dayNum,
      type: "income",
    };

    setFixedIncomes((prev) => [newEntry, ...prev]);
    setIncomeDesc("");
    setIncomeAmount("");
    showToast(`Receita fixa "${newEntry.description}" adicionada com sucesso!`);
  };

  // Submissão de Despesa Fixa
  const handleAddFixedExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmount = parseFloat(expenseAmount.replace(",", "."));
    if (!expenseDesc.trim() || isNaN(cleanAmount) || cleanAmount <= 0) {
      showToast("Por favor, preencha a descrição e um valor válido.");
      return;
    }

    const dayNum = parseInt(expenseDueDay.replace(/\D/g, ""), 10) || 10;
    const newEntry: FixedEntry = {
      id: `fe-${Date.now()}`,
      description: expenseDesc.trim(),
      amount: cleanAmount,
      dueDay: dayNum,
      type: "expense",
    };

    setFixedExpenses((prev) => [newEntry, ...prev]);
    setExpenseDesc("");
    setExpenseAmount("");
    showToast(`Despesa fixa "${newEntry.description}" adicionada com sucesso!`);
  };

  // Alternar Status da Previsão
  const toggleForecastStatus = (id: string) => {
    setForecastItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === "Confirmado" ? "Estimado" : "Confirmado";
          showToast(`Status de "${item.title}" alterado para ${nextStatus}.`);
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Transações filtradas para a busca
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) => tx.title.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  // Previsões filtradas para a busca
  const filteredForecast = useMemo(() => {
    if (!searchQuery.trim()) return forecastItems;
    const q = searchQuery.toLowerCase();
    return forecastItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [forecastItems, searchQuery]);

  // Gráfico Donut de Distribuição SVG
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;
  const donutSegments = categoriesSpending.map((cat) => {
    const fraction = totalSpentCategories > 0 ? cat.amount / totalSpentCategories : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += fraction;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="max-w-[1240px] mx-auto space-y-7 pb-12 select-none relative">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1A162B] border border-[#D6B2FF]/30 text-white px-4 py-3 rounded-xl shadow-2xl shadow-purple-950/60 transition-all animate-bounce">
          <CheckCircle2 size={18} className="text-[#4DE8B3]" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-zinc-400 hover:text-white ml-2 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 1. CABEÇALHO SUPERIOR */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1">
            Planejamento Financeiro
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Organize hoje. Respire<br />amanhã.
          </h1>
        </div>

        {/* Ações da Direita */}
        <div className="flex items-center gap-3 relative">
          {/* Campo de Busca */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar"
              className="bg-[#131024] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF]/50 transition-colors w-48 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Botão de Notificações */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadNotifications(0);
              }}
              aria-label="Notificações"
              className="w-11 h-11 rounded-xl bg-[#131024] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 transition-all relative cursor-pointer"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#4DE8B3] absolute top-2.5 right-2.5 ring-2 ring-[#131024]" />
              )}
            </button>

            {/* Popover de Notificações */}
            {showNotifications && (
              <div className="absolute right-0 top-13 w-80 bg-[#131024] border border-white/10 rounded-2xl p-4 shadow-2xl z-40 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Alertas do Planejamento
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-[#19152B] hover:bg-[#1f1a36] transition-colors border border-white/5 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#D6B2FF]">{n.title}</span>
                        <span className="text-[10px] text-zinc-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Seletor de Mês (Lilás conforme protótipo) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="bg-[#D6B2FF] text-[#0B0914] hover:bg-[#c79efc] px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-colors shadow-sm font-semibold"
            >
              <Calendar size={16} />
              <span>{selectedMonth}</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isMonthDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Menu Dropdown de Meses */}
            {isMonthDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-[#131024] border border-white/10 rounded-xl p-1.5 shadow-2xl z-40">
                {[
                  "Outubro de 2025",
                  "Novembro de 2025",
                  "Dezembro de 2025",
                  "Janeiro de 2026",
                ].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setIsMonthDropdownOpen(false);
                      showToast(`Período alterado para ${m}`);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                      selectedMonth === m
                        ? "bg-[#D6B2FF] text-[#0B0914] font-semibold"
                        : "text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. ENTRADAS FIXAS RÁPIDAS (Linha 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card: Receitas Fixas */}
        <div className="rounded-2xl border border-white/5 bg-[#131024] p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#10E59B]/10 border border-[#10E59B]/25 flex items-center justify-center text-[#4DE8B3]">
                <Wallet size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Receitas Fixas</h2>
                <p className="text-xs text-zinc-400">Entradas recorrentes mensais</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base sm:text-lg font-bold text-[#4DE8B3]">
                + {formatCurrency(totalFixedIncomes, false)}
              </span>
            </div>
          </div>

          {/* Formulário Inline de Receita */}
          <form
            onSubmit={handleAddFixedIncome}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end pt-2 border-t border-white/5"
          >
            <div className="sm:col-span-4 space-y-1">
              <label className="text-[11px] text-zinc-400 font-medium block">Descrição</label>
              <input
                type="text"
                value={incomeDesc}
                onChange={(e) => setIncomeDesc(e.target.value)}
                placeholder="Ex.: Salário"
                className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#4DE8B3] transition-colors h-[38px]"
              />
            </div>
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[11px] text-zinc-400 font-medium block">Valor mensal</label>
              <input
                type="text"
                value={incomeAmount}
                onChange={(e) => setIncomeAmount(e.target.value)}
                placeholder="R$ 0,00"
                className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#4DE8B3] transition-colors h-[38px]"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] text-zinc-400 font-medium block">Vencimento</label>
              <select
                value={incomeDueDay}
                onChange={(e) => setIncomeDueDay(e.target.value)}
                className="w-full bg-[#19152B] border border-white/10 rounded-xl px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#4DE8B3] transition-colors h-[38px] cursor-pointer"
              >
                <option value="Dia 01">Dia 01</option>
                <option value="Dia 05">Dia 05</option>
                <option value="Dia 10">Dia 10</option>
                <option value="Dia 15">Dia 15</option>
                <option value="Dia 20">Dia 20</option>
                <option value="Dia 25">Dia 25</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full bg-[#4DE8B3] hover:bg-[#3cdca4] text-[#0B0914] font-semibold text-xs px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1 h-[38px] cursor-pointer shadow-sm active:scale-95"
              >
                <Plus size={15} />
                <span>Adicionar</span>
              </button>
            </div>
          </form>
        </div>

        {/* Card: Despesas Fixas */}
        <div className="rounded-2xl border border-white/5 bg-[#131024] p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF85A1]/10 border border-[#FF85A1]/25 flex items-center justify-center text-[#FF85A1]">
                <ArrowLeftRight size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Despesas Fixas</h2>
                <p className="text-xs text-zinc-400">Compromissos recorrentes mensais</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base sm:text-lg font-bold text-[#FF85A1]">
                - {formatCurrency(totalFixedExpenses, false)}
              </span>
            </div>
          </div>

          {/* Formulário Inline de Despesa */}
          <form
            onSubmit={handleAddFixedExpense}
            className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end pt-2 border-t border-white/5"
          >
            <div className="sm:col-span-4 space-y-1">
              <label className="text-[11px] text-zinc-400 font-medium block">Descrição</label>
              <input
                type="text"
                value={expenseDesc}
                onChange={(e) => setExpenseDesc(e.target.value)}
                placeholder="Ex.: Aluguel"
                className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF85A1] transition-colors h-[38px]"
              />
            </div>
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[11px] text-zinc-400 font-medium block">Valor mensal</label>
              <input
                type="text"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="R$ 0,00"
                className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF85A1] transition-colors h-[38px]"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] text-zinc-400 font-medium block">Vencimento</label>
              <select
                value={expenseDueDay}
                onChange={(e) => setExpenseDueDay(e.target.value)}
                className="w-full bg-[#19152B] border border-white/10 rounded-xl px-2 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#FF85A1] transition-colors h-[38px] cursor-pointer"
              >
                <option value="Dia 01">Dia 01</option>
                <option value="Dia 05">Dia 05</option>
                <option value="Dia 10">Dia 10</option>
                <option value="Dia 15">Dia 15</option>
                <option value="Dia 20">Dia 20</option>
                <option value="Dia 25">Dia 25</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full bg-[#FF85A1] hover:bg-[#ff7091] text-[#0B0914] font-semibold text-xs px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1 h-[38px] cursor-pointer shadow-sm active:scale-95"
              >
                <Plus size={15} />
                <span>Adicionar</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. TRANSAÇÕES DO MÊS E PREVISÃO FUTURA (Linha 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card: Transações do Mês Atual */}
        <div className="rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block">
                  Novembro de 2025
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Transações do Mês Atual
                </h3>
              </div>
              <button
                onClick={() => setShowAllTransactionsModal(true)}
                className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Ver todas</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Barra de Resumo */}
            <div className="bg-[#19152B]/80 rounded-xl p-3 flex items-center justify-between border border-white/[0.04] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Movimentado</span>
                <span className="text-xs sm:text-sm font-semibold text-white">R$ 12.424,72</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Saldo do mês</span>
                <span className="text-xs sm:text-sm font-bold text-[#4DE8B3]">+ R$ 2.059,08</span>
              </div>
            </div>

            {/* Lista de Transações */}
            <div className="space-y-3">
              {filteredTransactions.slice(0, 4).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: tx.color }}
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white">{tx.title}</h4>
                      <p className="text-[11px] text-zinc-500">{tx.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-xs text-zinc-400 hidden sm:inline">{tx.date}</span>
                    <span
                      className={`text-xs sm:text-sm font-semibold ${
                        tx.amount > 0 ? "text-[#4DE8B3]" : "text-[#FF85A1]"
                      }`}
                    >
                      {tx.amount > 0 ? `+ ${formatCurrency(tx.amount)}` : `- ${formatCurrency(Math.abs(tx.amount))}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card: Previsão do Próximo Mês */}
        <div className="rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block">
                  Dezembro de 2025
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Previsão do Próximo Mês
                </h3>
              </div>
              <button
                onClick={() => setShowCalendarModal(true)}
                className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Ver calendário</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Barra de Resumo */}
            <div className="bg-[#19152B]/80 rounded-xl p-3 flex items-center justify-between border border-white/[0.04] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Saldo previsto</span>
                <span className="text-xs sm:text-sm font-semibold text-white">R$ 4.816,20</span>
              </div>
              <div>
                <span className="text-[11px] font-medium text-[#D6B2FF] bg-[#9D4EDD]/20 px-2.5 py-1 rounded-full border border-[#9D4EDD]/30">
                  82% das contas mapeadas
                </span>
              </div>
            </div>

            {/* Lista de Contas Futuras */}
            <div className="space-y-3">
              {filteredForecast.slice(0, 4).map((fc) => (
                <div
                  key={fc.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: fc.dotColor }}
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-white">{fc.title}</h4>
                      <p className="text-[11px] text-zinc-500">{fc.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Badge de Status Interativo */}
                    <button
                      type="button"
                      onClick={() => toggleForecastStatus(fc.id)}
                      title="Clique para alternar status"
                      className={`text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                        fc.status === "Confirmado"
                          ? "bg-[#10E59B]/15 text-[#10E59B] border border-[#10E59B]/30 hover:bg-[#10E59B]/25"
                          : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-zinc-200"
                      }`}
                    >
                      {fc.status}
                    </button>

                    <span className="text-xs text-zinc-400 hidden sm:inline">{fc.dueDate}</span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {formatCurrency(fc.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. DISTRIBUIÇÃO E EVOLUÇÃO COMPARATIVA (Linha 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card: Gastos por Subcategoria (Donut Chart) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block">
                  Distribuição Mensal
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Gastos por Subcategoria
                </h3>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowDistributionMenu(!showDistributionMenu)}
                  aria-label="Opções"
                  className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <MoreHorizontal size={18} />
                </button>
                {showDistributionMenu && (
                  <div className="absolute right-0 top-8 w-44 bg-[#19152B] border border-white/10 rounded-xl p-1.5 shadow-2xl z-30">
                    <button
                      onClick={() => {
                        setShowDistributionMenu(false);
                        showToast("Dados exportados para CSV com sucesso!");
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <FileSpreadsheet size={14} className="text-[#4DE8B3]" />
                      Exportar dados
                    </button>
                    <button
                      onClick={() => {
                        setShowDistributionMenu(false);
                        showToast("Visualização redefinida para o padrão.");
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <AlertCircle size={14} className="text-[#D6B2FF]" />
                      Ver detalhes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Layout em 2 colunas: Donut e Legenda */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              {/* Gráfico Donut SVG */}
              <div className="sm:col-span-5 flex justify-center items-center relative">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                    {/* Anel de fundo escuro */}
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke="#1C1832"
                      strokeWidth={strokeWidth}
                    />

                    {/* Fatias das Categorias */}
                    {donutSegments.map((segment) => {
                      const isHovered = hoveredCategory === segment.id;
                      return (
                        <circle
                          key={segment.id}
                          cx="90"
                          cy="90"
                          r={radius}
                          fill="none"
                          stroke={segment.color}
                          strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                          strokeDasharray={segment.strokeDasharray}
                          strokeDashoffset={segment.strokeDashoffset}
                          className="transition-all duration-300 cursor-pointer"
                          style={{
                            opacity: hoveredCategory && !isHovered ? 0.35 : 1,
                            filter: isHovered ? `drop-shadow(0 0 8px ${segment.color})` : "none",
                          }}
                          onMouseEnter={() => setHoveredCategory(segment.id)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        />
                      );
                    })}
                  </svg>

                  {/* Texto Central do Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[11px] text-zinc-400 font-medium">Total gasto</span>
                    <span className="text-xl font-bold text-white tracking-tight">
                      {hoveredCategory
                        ? formatCurrency(
                            categoriesSpending.find((c) => c.id === hoveredCategory)?.amount || 0,
                            false
                          )
                        : formatCurrency(totalSpentCategories, false)}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-semibold mt-0.5">
                      {hoveredCategory
                        ? `${categoriesSpending.find((c) => c.id === hoveredCategory)?.percent}% do total`
                        : "58% da renda"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lista e Legenda de Categorias */}
              <div className="sm:col-span-7 space-y-2">
                {categoriesSpending.map((cat) => {
                  const isHovered = hoveredCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onMouseEnter={() => setHoveredCategory(cat.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`flex items-center justify-between p-1.5 rounded-lg transition-all cursor-pointer ${
                        isHovered ? "bg-white/[0.06] translate-x-1" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: cat.color,
                            boxShadow: isHovered ? `0 0 6px ${cat.color}` : "none",
                          }}
                        />
                        <span
                          className={`text-xs ${
                            isHovered ? "text-white font-semibold" : "text-zinc-300"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-white">
                          {formatCurrency(cat.amount, false)}
                        </span>
                        <span className="text-[11px] text-zinc-500 w-7 text-right">
                          {cat.percent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card: Evolução por Categoria (Grouped Bar Chart) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between relative">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block">
                  Evolução por Categoria
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Gasto Atual vs Meta vs Gasto Mês Passado
                </h3>
              </div>

              {/* Legenda do Gráfico */}
              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D6B2FF]" />
                  <span>Gasto atual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4DE8B3]" />
                  <span>Meta</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4A3B69]" />
                  <span>Mês passado</span>
                </div>
              </div>
            </div>

            {/* Gráfico de Barras Agrupadas SVG Puro */}
            <div className="relative pt-2">
              <svg
                viewBox="0 0 520 200"
                className="w-full h-52 sm:h-56 overflow-visible select-none"
              >
                {/* Linhas de Grade e Eixo Y */}
                <line
                  x1="55"
                  y1="25"
                  x2="510"
                  y2="25"
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
                <text x="15" y="29" fill="#71717A" fontSize="10" fontFamily="sans-serif">
                  R$ 2 mil
                </text>

                <line
                  x1="55"
                  y1="90"
                  x2="510"
                  y2="90"
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
                <text x="15" y="94" fill="#71717A" fontSize="10" fontFamily="sans-serif">
                  R$ 1 mil
                </text>

                <line
                  x1="55"
                  y1="155"
                  x2="510"
                  y2="155"
                  stroke="rgba(255,255,255,0.12)"
                />
                <text x="25" y="159" fill="#71717A" fontSize="10" fontFamily="sans-serif">
                  R$ 0
                </text>

                {/* Categorias no Eixo X e Barras Agrupadas */}
                {evolutionData.map((item, idx) => {
                  const groupWidth = 85;
                  const startX = 65 + idx * groupWidth;
                  const barWidth = 8;
                  const maxVal = 2400;
                  const chartBaseY = 155;
                  const availableHeight = 130;

                  const currentH = (item.current / maxVal) * availableHeight;
                  const targetH = (item.target / maxVal) * availableHeight;
                  const prevH = (item.previous / maxVal) * availableHeight;

                  const isHovered = hoveredEvolutionCategory?.id === item.id;

                  return (
                    <g
                      key={item.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredEvolutionCategory(item)}
                      onMouseLeave={() => setHoveredEvolutionCategory(null)}
                    >
                      {/* Área de Captura Hover invisível */}
                      <rect
                        x={startX - 10}
                        y="15"
                        width={groupWidth - 5}
                        height="150"
                        fill="transparent"
                      />

                      {/* Barra 1: Gasto Atual (Lilás) */}
                      <rect
                        x={startX + 8}
                        y={chartBaseY - currentH}
                        width={barWidth}
                        height={currentH}
                        rx="3"
                        fill="#D6B2FF"
                        style={{
                          opacity: hoveredEvolutionCategory && !isHovered ? 0.4 : 1,
                          filter: isHovered ? "drop-shadow(0 0 6px #D6B2FF)" : "none",
                        }}
                        className="transition-all duration-300"
                      />

                      {/* Barra 2: Meta (Menta) */}
                      <rect
                        x={startX + 20}
                        y={chartBaseY - targetH}
                        width={barWidth}
                        height={targetH}
                        rx="3"
                        fill="#4DE8B3"
                        style={{
                          opacity: hoveredEvolutionCategory && !isHovered ? 0.4 : 1,
                          filter: isHovered ? "drop-shadow(0 0 6px #4DE8B3)" : "none",
                        }}
                        className="transition-all duration-300"
                      />

                      {/* Barra 3: Mês Passado (Roxo Escuro / Índigo) */}
                      <rect
                        x={startX + 32}
                        y={chartBaseY - prevH}
                        width={barWidth}
                        height={prevH}
                        rx="3"
                        fill="#4A3B69"
                        style={{
                          opacity: hoveredEvolutionCategory && !isHovered ? 0.4 : 1,
                        }}
                        className="transition-all duration-300"
                      />

                      {/* Rótulo da Categoria */}
                      <text
                        x={startX + 24}
                        y="175"
                        textAnchor="middle"
                        fill={isHovered ? "#FFFFFF" : "#71717A"}
                        fontSize="11"
                        fontWeight={isHovered ? "600" : "400"}
                        className="transition-colors duration-200"
                      >
                        {item.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip Dinâmico do Gráfico de Barras */}
              {hoveredEvolutionCategory && (
                <div className="absolute top-0 right-4 bg-[#19152B] border border-white/10 rounded-xl p-3 shadow-2xl z-30 pointer-events-none animate-fadeIn">
                  <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-white/5">
                    <span className="text-xs font-bold text-white">
                      {hoveredEvolutionCategory.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        hoveredEvolutionCategory.current <= hoveredEvolutionCategory.target
                          ? "bg-[#10E59B]/15 text-[#10E59B]"
                          : "bg-[#FF85A1]/15 text-[#FF85A1]"
                      }`}
                    >
                      {hoveredEvolutionCategory.current <= hoveredEvolutionCategory.target
                        ? "Dentro da meta"
                        : "Acima da meta"}
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between gap-4 text-zinc-300">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-[#D6B2FF]" />
                        Gasto Atual:
                      </span>
                      <span className="font-semibold text-white">
                        {formatCurrency(hoveredEvolutionCategory.current)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-zinc-300">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-[#4DE8B3]" />
                        Meta Estabelecida:
                      </span>
                      <span className="font-semibold text-white">
                        {formatCurrency(hoveredEvolutionCategory.target)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-zinc-300">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-[#4A3B69]" />
                        Mês Anterior:
                      </span>
                      <span className="font-semibold text-white">
                        {formatCurrency(hoveredEvolutionCategory.previous)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODAL: TODAS AS TRANSAÇÕES */}
      {showAllTransactionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Todas as Transações — Novembro de 2025
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Histórico completo de entradas e saídas registradas
                </p>
              </div>
              <button
                onClick={() => setShowAllTransactionsModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filtros por Abas */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModalFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  modalFilter === "all"
                    ? "bg-[#D6B2FF] text-[#0B0914]"
                    : "bg-[#19152B] text-zinc-400 hover:text-white"
                }`}
              >
                Todas ({transactions.length})
              </button>
              <button
                onClick={() => setModalFilter("income")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  modalFilter === "income"
                    ? "bg-[#4DE8B3] text-[#0B0914]"
                    : "bg-[#19152B] text-zinc-400 hover:text-white"
                }`}
              >
                Receitas ({transactions.filter((t) => t.type === "income").length})
              </button>
              <button
                onClick={() => setModalFilter("expense")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  modalFilter === "expense"
                    ? "bg-[#FF85A1] text-[#0B0914]"
                    : "bg-[#19152B] text-zinc-400 hover:text-white"
                }`}
              >
                Despesas ({transactions.filter((t) => t.type === "expense").length})
              </button>
            </div>

            {/* Lista com Rolagem */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {transactions
                .filter((tx) => (modalFilter === "all" ? true : tx.type === modalFilter))
                .map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#19152B] hover:bg-[#1e1933] transition-colors border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: tx.color }}
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white">{tx.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span>{tx.category}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm font-bold ${
                          tx.amount > 0 ? "text-[#4DE8B3]" : "text-[#FF85A1]"
                        }`}
                      >
                        {tx.amount > 0
                          ? `+ ${formatCurrency(tx.amount)}`
                          : `- ${formatCurrency(Math.abs(tx.amount))}`}
                      </span>
                      <button
                        onClick={() => {
                          setTransactions((prev) => prev.filter((t) => t.id !== tx.id));
                          showToast(`Transação "${tx.title}" removida.`);
                        }}
                        title="Remover transação"
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Rodapé do Modal */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                Mostrando {transactions.filter((tx) => (modalFilter === "all" ? true : tx.type === modalFilter)).length} itens
              </span>
              <button
                onClick={() => setShowAllTransactionsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#D6B2FF] text-[#0B0914] font-semibold text-xs hover:bg-[#c79efc] transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: CALENDÁRIO DE VENCIMENTOS */}
      {showCalendarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D6B2FF]/10 text-[#D6B2FF] flex items-center justify-center">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Calendário de Vencimentos — Dezembro de 2025
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Acompanhe as datas de compromissos mapeados
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCalendarModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mini Grade do Calendário */}
            <div className="bg-[#19152B] border border-white/5 rounded-xl p-4">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-zinc-500 mb-2">
                <span>DOM</span>
                <span>SEG</span>
                <span>TER</span>
                <span>QUA</span>
                <span>QUI</span>
                <span>SEX</span>
                <span>SÁB</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {/* Dias do mês */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  // Dias especiais de vencimento mapeados
                  const hasDue = [10, 15, 18, 22, 24].includes(day);
                  const isSelected = selectedCalendarDay === day;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedCalendarDay(day)}
                      className={`h-9 rounded-lg flex flex-col items-center justify-center font-medium transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-[#D6B2FF] text-[#0B0914] font-bold shadow-md shadow-purple-950/40"
                          : hasDue
                          ? "bg-[#9D4EDD]/20 text-white border border-[#9D4EDD]/40 hover:bg-[#9D4EDD]/30"
                          : "text-zinc-400 hover:bg-white/5"
                      }`}
                    >
                      <span>{day}</span>
                      {hasDue && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-[#4DE8B3] absolute bottom-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detalhes do Dia Selecionado */}
            <div className="bg-[#19152B] border border-white/5 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-[#D6B2FF] uppercase tracking-wider">
                Eventos para o Dia {selectedCalendarDay} de Dezembro
              </h4>
              {selectedCalendarDay === 10 && (
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF85A1]" />
                    <span>Aluguel residencial (Moradia)</span>
                  </div>
                  <span className="font-semibold text-white">R$ 2.100,00</span>
                </div>
              )}
              {selectedCalendarDay === 15 && (
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4DE8B3]" />
                    <span>Salário mensal (Receita fixa)</span>
                  </div>
                  <span className="font-semibold text-[#4DE8B3]">+ R$ 8.450,00</span>
                </div>
              )}
              {selectedCalendarDay === 18 && (
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                    <span>Internet e celular (Serviços)</span>
                  </div>
                  <span className="font-semibold text-white">R$ 214,80</span>
                </div>
              )}
              {selectedCalendarDay === 22 && (
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                    <span>Seguro do carro (Transporte)</span>
                  </div>
                  <span className="font-semibold text-white">R$ 287,00</span>
                </div>
              )}
              {selectedCalendarDay === 24 && (
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                    <span>Conta de Energia Elétrica (Moradia)</span>
                  </div>
                  <span className="font-semibold text-white">R$ 195,00</span>
                </div>
              )}
              {![10, 15, 18, 22, 24].includes(selectedCalendarDay || 0) && (
                <p className="text-xs text-zinc-500">
                  Nenhum vencimento ou recebimento programado para este dia.
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowCalendarModal(false)}
                className="px-4 py-2 rounded-xl bg-[#D6B2FF] text-[#0B0914] font-semibold text-xs hover:bg-[#c79efc] transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}