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
  CreditCard,
  CheckCircle2,
  SlidersHorizontal,
  Sparkles,
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

interface CreditCardData {
  id: string;
  name: string;
  bank: string;
  brand: string;
  lastDigits: string;
  color: string;
  accentColor: string;
  totalLimit: number;
  usedLimit: number;
  closingDay: string;
  dueDay: string;
  status: "aberta" | "fechada" | "paga";
}

export default function VisaoGeralPage() {
  // Estado das Contas Bancárias (Exclusivamente Contas com Saldo Líquido)
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: "nubank",
      badge: "nu",
      badgeColor: "#9D4EDD",
      lastDigits: "4821",
      type: "Conta corrente",
      balance: 842.5,
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
      id: "bb",
      badge: "BB",
      badgeColor: "#FFD166",
      lastDigits: "3104",
      type: "Conta universitária",
      balance: 587.5,
      bankName: "Banco do Brasil",
      footerRight: "Bolsa ativa",
      footerRightColor: "#FFD166",
      glowColor: "rgba(255, 209, 102, 0.08)",
    },
  ]);

  // Estado dos Cartões de Crédito (Lista Discreta e Minimalista)
  const [creditCards, setCreditCards] = useState<CreditCardData[]>([
    {
      id: "card-nubank",
      name: "Nubank Roxinho",
      bank: "Nubank",
      brand: "Mastercard",
      lastDigits: "4821",
      color: "#9D4EDD",
      accentColor: "#D6B2FF",
      totalLimit: 1000.0,
      usedLimit: 380.0,
      closingDay: "21 nov.",
      dueDay: "28 nov.",
      status: "aberta",
    },
    {
      id: "card-c6",
      name: "C6 Standard",
      bank: "C6 Bank",
      brand: "Mastercard",
      lastDigits: "1044",
      color: "#B583FF",
      accentColor: "#00E5FF",
      totalLimit: 600.0,
      usedLimit: 145.0,
      closingDay: "03 dez.",
      dueDay: "10 dez.",
      status: "aberta",
    },
  ]);

  // Estado das Despesas por Categoria
  const [categories, setCategories] = useState<CategoryExpense[]>([
    { id: "moradia", name: "Moradia", amount: 680, color: "#10E59B" },
    { id: "alimentacao", name: "Alimentação", amount: 385, color: "#00E5FF" },
    { id: "estudos", name: "Estudos", amount: 180, color: "#9D4EDD" },
    { id: "outros", name: "Outros", amount: 235, color: "#F4A261" },
  ]);

  // Estado do Orçamento Restante
  const [budgets, setBudgets] = useState<BudgetItem[]>([
    {
      id: "mercado",
      initials: "MA",
      name: "Mercado e alimentação",
      spent: 245,
      limit: 380,
      color: "#10E59B",
    },
    {
      id: "livros",
      initials: "LM",
      name: "Livros e materiais",
      spent: 95,
      limit: 180,
      color: "#00E5FF",
    },
    {
      id: "lazer",
      initials: "LP",
      name: "Lazer e passeios",
      spent: 110,
      limit: 200,
      color: "#F4A261",
    },
  ]);

  // Estados de Interatividade da UI
  const [selectedMonth, setSelectedMonth] = useState("Novembro");
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<CategoryExpense | null>(
    null
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados dos Modais
  const [modalType, setModalType] = useState<"receita" | "despesa" | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("nubank");
  const [selectedCategoryId, setSelectedCategoryId] = useState("alimentacao");

  // Estados de Pagamento e Ajuste de Limite de Cartão
  const [selectedCardForAction, setSelectedCardForAction] =
    useState<string>("card-nubank");
  const [showPayInvoiceModal, setShowPayInvoiceModal] = useState(false);
  const [payingAccount, setPayingAccount] = useState("nubank");
  const [payAmountType, setPayAmountType] = useState<"total" | "custom">("total");
  const [customPayAmount, setCustomPayAmount] = useState("");

  const [showAdjustLimitModal, setShowAdjustLimitModal] = useState(false);
  const [tempLimit, setTempLimit] = useState(1000);

  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newCardName, setNewCardName] = useState("");
  const [newCardLimit, setNewCardLimit] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cálculos dinâmicos
  const totalAccountsBalance = accounts.reduce(
    (acc, item) => acc + item.balance,
    0
  );
  const totalSpent = categories.reduce((acc, item) => acc + item.amount, 0);
  const monthlyBudgetLimit = 1850;

  const totalUsedLimit = creditCards.reduce((acc, c) => acc + c.usedLimit, 0);
  const totalLimitApproved = creditCards.reduce((acc, c) => acc + c.totalLimit, 0);
  const totalAvailableLimit = Math.max(0, totalLimitApproved - totalUsedLimit);

  const activeCardForModal =
    creditCards.find((c) => c.id === selectedCardForAction) || creditCards[0];

  // Configuração do SVG do Gráfico de Rosca
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

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
      showToast(`Receita de ${formatCurrency(numericValue)} adicionada com sucesso!`);
    } else if (modalType === "despesa") {
      if (selectedAccountId.startsWith("card-")) {
        setCreditCards((prev) =>
          prev.map((c) =>
            c.id === selectedAccountId
              ? {
                  ...c,
                  usedLimit: c.usedLimit + numericValue,
                }
              : c
          )
        );
        showToast(
          `Despesa de ${formatCurrency(numericValue)} lançada no cartão!`
        );
      } else {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === selectedAccountId
              ? { ...acc, balance: Math.max(0, acc.balance - numericValue) }
              : acc
          )
        );
        showToast(
          `Despesa de ${formatCurrency(numericValue)} registrada na conta!`
        );
      }

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

  // Pagamento da Fatura do Cartão Selecionado
  const handlePayInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const amountToPay =
      payAmountType === "total"
        ? activeCardForModal.usedLimit
        : parseFloat(customPayAmount.replace(",", "."));

    if (isNaN(amountToPay) || amountToPay <= 0) return;

    const sourceAccount = accounts.find((acc) => acc.id === payingAccount);
    if (!sourceAccount || sourceAccount.balance < amountToPay) {
      showToast("Saldo insuficiente na conta selecionada para este pagamento.");
      return;
    }

    // Deduz da conta de pagamento
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === payingAccount
          ? { ...acc, balance: acc.balance - amountToPay }
          : acc
      )
    );

    // Atualiza o limite usado e status do cartão
    setCreditCards((prev) =>
      prev.map((c) =>
        c.id === selectedCardForAction
          ? {
              ...c,
              usedLimit: Math.max(0, c.usedLimit - amountToPay),
              status: c.usedLimit - amountToPay <= 0 ? "paga" : "aberta",
            }
          : c
      )
    );

    setShowPayInvoiceModal(false);
    setCustomPayAmount("");
    showToast(
      `Fatura de ${formatCurrency(amountToPay)} do ${activeCardForModal.name} paga com sucesso!`
    );
  };

  // Ajuste do Limite do Cartão Selecionado
  const handleSaveLimit = () => {
    setCreditCards((prev) =>
      prev.map((c) =>
        c.id === selectedCardForAction ? { ...c, totalLimit: tempLimit } : c
      )
    );
    setShowAdjustLimitModal(false);
    showToast(
      `Limite do ${activeCardForModal.name} ajustado para ${formatCurrency(tempLimit, false)}!`
    );
  };

  // Criação de Novo Cartão
  const handleAddNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    const numericLimit = parseFloat(newCardLimit.replace(",", "."));
    if (!newCardName || isNaN(numericLimit) || numericLimit <= 0) return;

    const newCard: CreditCardData = {
      id: `card-${Date.now()}`,
      name: newCardName,
      bank: newCardName.split(" ")[0] || "Banco",
      brand: "Mastercard",
      lastDigits: String(Math.floor(1000 + Math.random() * 9000)),
      color: "#00E5FF",
      accentColor: "#4DE8B3",
      totalLimit: numericLimit,
      usedLimit: 0,
      closingDay: "05 dez.",
      dueDay: "12 dez.",
      status: "aberta",
    };

    setCreditCards((prev) => [...prev, newCard]);
    setShowNewCardModal(false);
    setNewCardName("");
    setNewCardLimit("");
    showToast(`Cartão "${newCardName}" adicionado à lista!`);
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 pb-12 select-none relative">
      {/* TOAST FLUTUANTE DE FEEDBACK */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#1C1832] border border-[#4DE8B3]/40 text-white text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles size={16} className="text-[#4DE8B3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CABEÇALHO SUPERIOR */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 block mb-1">
            TERÇA-FEIRA, 19 DE NOVEMBRO
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Bom dia, Arthur
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
            <div className="absolute right-0 top-14 w-80 rounded-2xl bg-[#161329] border border-white/10 p-4 shadow-2xl z-30 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-semibold text-white">
                  Notificações
                </span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                A fatura do seu cartão <strong className="text-white">Nubank</strong> fecha em 21 nov. e vence em 28 nov.
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed pt-1 border-t border-white/5">
                Bolsa de estágio (R$ 1.200) prevista para cair no Banco do Brasil dia 24 nov.
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

      {/* SEÇÃO 1: MINHAS CONTAS (EXCLUSIVAMENTE CONTAS BANCÁRIAS COM SALDO DISPONÍVEL) */}
      <section className="space-y-3.5">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 block mb-0.5">
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

      {/* SEÇÃO 2: CARTÕES DE CRÉDITO (LISTA DISCRETA E MINIMALISTA, UM CARTÃO ABAIXO DO OUTRO) */}
      <section className="rounded-2xl bg-[#131022] border border-white/[0.07] p-5 sm:p-6 space-y-4">
        {/* Cabeçalho Discreto do Card de Cartões */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Cartões de Crédito
            </span>
            <span className="text-[11px] text-zinc-500 font-normal">
              ({creditCards.length})
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-zinc-400">
              <span>
                Faturas: <strong className="text-white font-semibold">{formatCurrency(totalUsedLimit)}</strong>
              </span>
              <span className="text-zinc-600">•</span>
              <span>
                Livre: <strong className="text-[#4DE8B3] font-semibold">{formatCurrency(totalAvailableLimit)}</strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowNewCardModal(true)}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#D6B2FF] hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span>Adicionar cartão</span>
            </button>
          </div>
        </div>

        {/* Lista Minimalista: Um Cartão Abaixo do Outro */}
        <div className="divide-y divide-white/[0.06]">
          {creditCards.map((card) => {
            const availLimit = Math.max(0, card.totalLimit - card.usedLimit);
            const uPercent = Math.min(
              100,
              Math.round((card.usedLimit / card.totalLimit) * 100)
            );
            const aPercent = Math.max(0, 100 - uPercent);

            return (
              <div
                key={card.id}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-6 hover:bg-white/[0.015] -mx-2 px-2 rounded-xl transition-all"
              >
                {/* 1. Nome do Cartão e Status da Fatura */}
                <div className="flex items-center gap-3 min-w-[220px]">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/10"
                    style={{
                      backgroundColor: `${card.color}18`,
                      color: card.accentColor,
                    }}
                  >
                    <CreditCard size={15} />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">
                        {card.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        •• {card.lastDigits}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                      <span className="flex items-center gap-1 text-[#FFD166] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-pulse" />
                        Fatura aberta
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">Vence {card.dueDay}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Barra de Limite Usado e Disponível */}
                <div className="flex-1 max-w-lg w-full space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                      Usado:{" "}
                      <strong className="text-white font-semibold">
                        {formatCurrency(card.usedLimit)}
                      </strong>{" "}
                      <span className="text-[10px] text-zinc-500">
                        ({uPercent}%)
                      </span>
                    </span>

                    <span className="text-zinc-400">
                      Disponível:{" "}
                      <strong className="text-[#4DE8B3] font-semibold">
                        {formatCurrency(availLimit)}
                      </strong>{" "}
                      <span className="text-[10px] text-zinc-500">
                        (de {formatCurrency(card.totalLimit, false)})
                      </span>
                    </span>
                  </div>

                  {/* Barra Fina e Discreta */}
                  <div className="w-full h-2 rounded-full bg-[#1A162B] border border-white/5 overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${uPercent}%`,
                        backgroundColor: card.color,
                      }}
                      title={`Limite usado: ${formatCurrency(card.usedLimit)} (${uPercent}%)`}
                    />
                    <div
                      className="h-full rounded-full transition-all duration-500 opacity-60 ml-0.5"
                      style={{
                        width: `${aPercent}%`,
                        backgroundColor: "#4DE8B3",
                      }}
                      title={`Limite disponível: ${formatCurrency(availLimit)} (${aPercent}%)`}
                    />
                  </div>
                </div>

                {/* 3. Ações Rápidas Discretas */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCardForAction(card.id);
                      setShowPayInvoiceModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#4DE8B3]/10 hover:bg-[#4DE8B3]/20 border border-[#4DE8B3]/25 text-[11px] font-semibold text-[#4DE8B3] transition-colors cursor-pointer"
                  >
                    Pagar fatura
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCardForAction(card.id);
                      setTempLimit(card.totalLimit);
                      setShowAdjustLimitModal(true);
                    }}
                    title="Ajustar limite"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SEÇÃO 3: OS DOIS GRÁFICOS (RESUMO MENSAL E ORÇAMENTO RESTANTE EM 2 COLUNAS) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* GRÁFICO 1: DESPESAS POR CATEGORIA (GRÁFICO DE ROSCA EM SVG) */}
        <div className="rounded-2xl bg-[#131022] border border-white/[0.07] p-7 flex flex-col justify-between hover:border-white/15 transition-all">
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

          {/* Donut Chart lado a lado com a Lista de Categorias */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 my-auto py-2">
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
                    : `da renda de ${formatCurrency(monthlyBudgetLimit, false)}`}
                </span>
              </div>
            </div>

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
                          isHovered
                            ? "text-white font-semibold"
                            : "text-zinc-300 font-medium"
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

        {/* GRÁFICO 2: ORÇAMENTO RESTANTE (BARRAS DE PROGRESSO) */}
        <div className="rounded-2xl bg-[#131022] border border-white/[0.07] p-7 flex flex-col justify-between hover:border-white/15 transition-all">
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

          <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Meta mensal de gastos:</span>
            <span className="font-bold text-white">
              {formatCurrency(monthlyBudgetLimit, false)}
            </span>
          </div>
        </div>
      </section>

      {/* MODAL 1: ADICIONAR RECEITA OU DESPESA */}
      {modalType && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#151226] border border-white/10 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
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
                  {modalType === "receita" ? "Conta de Depósito" : "Forma de Pagamento"}
                </label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full rounded-xl bg-[#0D0B18] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DE8B3]"
                >
                  <optgroup label="Contas Bancárias">
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.bankName} - {acc.type} ({formatCurrency(acc.balance)})
                      </option>
                    ))}
                  </optgroup>
                  {modalType === "despesa" && (
                    <optgroup label="Cartões de Crédito">
                      {creditCards.map((card) => (
                        <option key={card.id} value={card.id}>
                          💳 {card.name} (Fatura Atual: {formatCurrency(card.usedLimit)})
                        </option>
                      ))}
                    </optgroup>
                  )}
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

      {/* MODAL 2: PAGAR FATURA DO CARTÃO */}
      {showPayInvoiceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#151226] border border-white/10 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${activeCardForModal.color}20`,
                    color: activeCardForModal.accentColor,
                  }}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Pagar Fatura
                  </h3>
                  <span className="text-xs text-zinc-400">
                    {activeCardForModal.name} • Final {activeCardForModal.lastDigits}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPayInvoiceModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#1C1832] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block mb-0.5">
                  Valor total da fatura
                </span>
                <span className="text-2xl font-bold text-white">
                  {formatCurrency(activeCardForModal.usedLimit)}
                </span>
              </div>
              <span className="text-xs text-[#FFD166] bg-[#FFD166]/10 px-2.5 py-1 rounded-lg border border-[#FFD166]/20 font-medium">
                Vence em {activeCardForModal.dueDay}
              </span>
            </div>

            <form onSubmit={handlePayInvoice} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-2">
                  Opção de Pagamento
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayAmountType("total")}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      payAmountType === "total"
                        ? "border-[#4DE8B3] bg-[#4DE8B3]/10 text-white"
                        : "border-white/10 bg-[#0D0B18] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="block font-bold">Valor Total</span>
                    <span className="text-[11px] text-[#4DE8B3]">
                      {formatCurrency(activeCardForModal.usedLimit)}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayAmountType("custom")}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      payAmountType === "custom"
                        ? "border-[#4DE8B3] bg-[#4DE8B3]/10 text-white"
                        : "border-white/10 bg-[#0D0B18] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="block font-bold">Outro Valor</span>
                    <span className="text-[11px] text-zinc-400">
                      Parcial / Entrada
                    </span>
                  </button>
                </div>
              </div>

              {payAmountType === "custom" && (
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5">
                    Valor a pagar (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 100.00"
                    value={customPayAmount}
                    onChange={(e) => setCustomPayAmount(e.target.value)}
                    max={activeCardForModal.usedLimit}
                    className="w-full rounded-xl bg-[#0D0B18] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DE8B3]"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">
                  Debitar de qual conta?
                </label>
                <select
                  value={payingAccount}
                  onChange={(e) => setPayingAccount(e.target.value)}
                  className="w-full rounded-xl bg-[#0D0B18] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DE8B3]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bankName} - Saldo: {formatCurrency(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayInvoiceModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={activeCardForModal.usedLimit === 0}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#4DE8B3] text-[#090812] text-xs font-bold hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Confirmar Pagamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: AJUSTAR LIMITE DO CARTÃO */}
      {showAdjustLimitModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#151226] border border-white/10 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: `${activeCardForModal.color}20`,
                    color: activeCardForModal.accentColor,
                  }}
                >
                  <SlidersHorizontal size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Ajustar Limite
                  </h3>
                  <span className="text-xs text-zinc-400">
                    {activeCardForModal.name} • Final {activeCardForModal.lastDigits}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdjustLimitModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-center p-5 rounded-2xl bg-[#1A162B] border border-white/10 space-y-1">
              <span className="text-xs text-zinc-400">Novo limite total</span>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(tempLimit, false)}
              </div>
              <span className="text-[11px] text-[#4DE8B3] block pt-1">
                Novo limite disponível:{" "}
                {formatCurrency(
                  Math.max(0, tempLimit - activeCardForModal.usedLimit),
                  false
                )}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>R$ 300</span>
                <span>R$ 1.800</span>
              </div>
              <input
                type="range"
                min="300"
                max="1800"
                step="50"
                value={tempLimit}
                onChange={(e) => setTempLimit(Number(e.target.value))}
                className="w-full accent-[#4DE8B3] cursor-pointer"
              />
              <span className="text-[11px] text-zinc-500 block text-center">
                Recomendado para perfil universitário com renda de R$ 1.850
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAdjustLimitModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveLimit}
                className="px-5 py-2.5 rounded-xl bg-[#4DE8B3] text-[#090812] text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
              >
                Salvar Novo Limite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADICIONAR NOVO CARTÃO */}
      {showNewCardModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#151226] border border-white/10 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                Adicionar Cartão de Crédito
              </h3>
              <button
                type="button"
                onClick={() => setShowNewCardModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewCard} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">
                  Apelido / Banco do Cartão
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Inter Gold, Caixa Universitário..."
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                  className="w-full rounded-xl bg-[#0D0B18] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DE8B3]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1.5">
                  Limite Total Aprovado (R$)
                </label>
                <input
                  type="number"
                  step="50"
                  required
                  placeholder="Ex: 800.00"
                  value={newCardLimit}
                  onChange={(e) => setNewCardLimit(e.target.value)}
                  className="w-full rounded-xl bg-[#0D0B18] border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DE8B3]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCardModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#4DE8B3] text-[#090812] text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Cadastrar Cartão</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}