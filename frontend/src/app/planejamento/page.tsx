"use client";

import { useState, useMemo, useRef } from "react";
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
  ChevronRight,
  ChevronLeft,
  Target,
  Receipt,
  CreditCard,
} from "lucide-react";

// Tipos e Interfaces
interface CategoryExpenseItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
}

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
  type: "income" | "expense";
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

  // Modal de Receita / Despesa Fixa (Versão Mobile)
  const [fixedModalType, setFixedModalType] = useState<"income" | "expense" | null>(null);

  // Carrossel Mobile de Transações do Mês vs Previsão do Próximo Mês
  const [activeTxSlide, setActiveTxSlide] = useState<number>(0);
  const txCarouselRef = useRef<HTMLDivElement | null>(null);

  const handleTxCarouselScroll = () => {
    if (!txCarouselRef.current) return;
    const { scrollLeft, clientWidth } = txCarouselRef.current;
    const idx = Math.round(scrollLeft / (clientWidth * 0.85));
    setActiveTxSlide(Math.min(1, Math.max(0, idx)));
  };

  const scrollToTxSlide = (index: number) => {
    if (!txCarouselRef.current) return;
    const cardWidth = txCarouselRef.current.clientWidth * 0.9;
    txCarouselRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setActiveTxSlide(index);
  };

  // Carrossel de Metas Individuais (Barras Horizontais)
  const [activeMetaIndex, setActiveMetaIndex] = useState<number>(0);
  const metaCarouselRef = useRef<HTMLDivElement | null>(null);

  const handleMetaCarouselScroll = () => {
    if (!metaCarouselRef.current) return;
    const { scrollLeft, clientWidth } = metaCarouselRef.current;
    if (clientWidth === 0) return;
    const idx = Math.round(scrollLeft / clientWidth);
    setActiveMetaIndex(Math.min(evolutionData.length - 1, Math.max(0, idx)));
  };

  const scrollToMeta = (index: number) => {
    if (!metaCarouselRef.current) return;
    const width = metaCarouselRef.current.clientWidth;
    metaCarouselRef.current.scrollTo({
      left: index * width,
      behavior: "smooth",
    });
    setActiveMetaIndex(index);
  };

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
      title: "Quarto em república",
      category: "Moradia",
      date: "10 nov.",
      amount: -680.0,
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
      title: "Supermercado & Feira",
      category: "Alimentação",
      date: "18 nov.",
      amount: -385.0,
      type: "expense",
      color: "#FF85A1",
    },
    {
      id: "tx-4",
      title: "Auxílio permanência",
      category: "Receita fixa",
      date: "08 nov.",
      amount: 450.0,
      type: "income",
      color: "#4DE8B3",
    },
    {
      id: "tx-5",
      title: "Monitoria acadêmica",
      category: "Bolsa campus",
      date: "05 nov.",
      amount: 200.0,
      type: "income",
      color: "#4DE8B3",
    },
    {
      id: "tx-6",
      title: "Xerox e livros",
      category: "Estudos",
      date: "05 nov.",
      amount: -180.0,
      type: "expense",
      color: "#FF85A1",
    },
    {
      id: "tx-7",
      title: "Passe estudantil",
      category: "Transporte",
      date: "03 nov.",
      amount: -130.0,
      type: "expense",
      color: "#FF85A1",
    },
    {
      id: "tx-8",
      title: "Lazer universitário",
      category: "Lazer",
      date: "02 nov.",
      amount: -105.0,
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
      type: "expense",
      status: "Confirmado",
      dotColor: "#FF85A1",
    },
    {
      id: "fc-2",
      title: "Bolsa de estágio",
      category: "Receita fixa",
      dueDate: "15 dez.",
      amount: 1200.0,
      type: "income",
      status: "Confirmado",
      dotColor: "#4DE8B3",
    },
    {
      id: "fc-3",
      title: "Supermercado & Feira",
      category: "Alimentação",
      dueDate: "14 dez.",
      amount: 360.0,
      type: "expense",
      status: "Estimado",
      dotColor: "#FF85A1",
    },
    {
      id: "fc-4",
      title: "Auxílio permanência",
      category: "Receita fixa",
      dueDate: "08 dez.",
      amount: 450.0,
      type: "income",
      status: "Confirmado",
      dotColor: "#4DE8B3",
    },
    {
      id: "fc-5",
      title: "Monitoria acadêmica",
      category: "Bolsa campus",
      dueDate: "05 dez.",
      amount: 200.0,
      type: "income",
      status: "Estimado",
      dotColor: "#4DE8B3",
    },
    {
      id: "fc-6",
      title: "Rateio internet & luz",
      category: "Serviços",
      dueDate: "18 dez.",
      amount: 115.0,
      type: "expense",
      status: "Estimado",
      dotColor: "#FF85A1",
    },
    {
      id: "fc-7",
      title: "Passe estudantil",
      category: "Transporte",
      dueDate: "22 dez.",
      amount: 95.0,
      type: "expense",
      status: "Confirmado",
      dotColor: "#FF85A1",
    },
    {
      id: "fc-8",
      title: "Livros & materiais",
      category: "Estudos",
      dueDate: "24 dez.",
      amount: 120.0,
      type: "expense",
      status: "Estimado",
      dotColor: "#FF85A1",
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

  // 7. Dados da Evolução por Categoria (Metas de Gastos)
  const [evolutionData, setEvolutionData] = useState<CategoryEvolution[]>([
    { id: "moradia", name: "Moradia", current: 680, target: 700, previous: 680 },
    { id: "alimentacao", name: "Alimentação", current: 385, target: 420, previous: 360 },
    { id: "estudos", name: "Estudos", current: 145, target: 180, previous: 130 },
    { id: "transporte", name: "Transporte", current: 130, target: 150, previous: 125 },
    { id: "lazer", name: "Lazer", current: 95, target: 140, previous: 110 },
  ]);

  // Modal de Cadastrar Nova Meta de Gastos
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [goalCategoryName, setGoalCategoryName] = useState("");
  const [goalTargetAmount, setGoalTargetAmount] = useState("");
  const [goalCurrentAmount, setGoalCurrentAmount] = useState("");
  const [goalPreviousAmount, setGoalPreviousAmount] = useState("");

  // Totais Consolidados de Metas
  const totalEvolutionCurrent = useMemo(
    () => evolutionData.reduce((acc, curr) => acc + curr.current, 0),
    [evolutionData]
  );
  const totalEvolutionTarget = useMemo(
    () => evolutionData.reduce((acc, curr) => acc + curr.target, 0),
    [evolutionData]
  );
  const totalEvolutionPrevious = useMemo(
    () => evolutionData.reduce((acc, curr) => acc + curr.previous, 0),
    [evolutionData]
  );

  // Modais
  const [showAllTransactionsModal, setShowAllTransactionsModal] = useState(false);
  const [modalFilter, setModalFilter] = useState<"all" | "income" | "expense">("all");
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(10);
  const [showDistributionMenu, setShowDistributionMenu] = useState(false);

  // Modal de Detalhes da Categoria de Gastos
  const [selectedCategoryModal, setSelectedCategoryModal] = useState<CategorySpending | null>(null);
  const [newExpenseDesc, setNewExpenseDesc] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpensePaymentMethod, setNewExpensePaymentMethod] = useState("Conta Nubank");

  // Lista detalhada de gastos por categoria estudantil
  const [categoryExpenses, setCategoryExpenses] = useState<Record<string, CategoryExpenseItem[]>>({
    moradia: [
      { id: "cm-1", description: "Aluguel quarto em república", amount: 565.0, date: "05 nov.", paymentMethod: "Conta Nubank" },
      { id: "cm-2", description: "Rateio de internet da república", amount: 65.0, date: "10 nov.", paymentMethod: "Conta Inter" },
      { id: "cm-3", description: "Rateio conta de energia", amount: 50.0, date: "15 nov.", paymentMethod: "Conta Nubank" },
    ],
    alimentacao: [
      { id: "ca-1", description: "Feira livre do bairro e hortifrúti", amount: 146.32, date: "18 nov.", paymentMethod: "Cartão Nubank" },
      { id: "ca-2", description: "Almoço e janta no RU (Recarga)", amount: 84.0, date: "12 nov.", paymentMethod: "Conta Inter" },
      { id: "ca-3", description: "Supermercado itens básicos (Arroz, feijão, ovos)", amount: 118.68, date: "07 nov.", paymentMethod: "Cartão Nubank" },
      { id: "ca-4", description: "Café da manhã e lanches na cantina", amount: 36.0, date: "03 nov.", paymentMethod: "Conta Nubank" },
    ],
    estudos: [
      { id: "ce-1", description: "Livro de Estrutura de Dados (Sebo)", amount: 68.5, date: "05 nov.", paymentMethod: "Cartão C6" },
      { id: "ce-2", description: "Xerox apostilas & impressão de artigos", amount: 42.5, date: "14 nov.", paymentMethod: "Conta Nubank" },
      { id: "ce-3", description: "Caderno universitário & canetas", amount: 34.0, date: "02 nov.", paymentMethod: "Conta Inter" },
    ],
    transporte: [
      { id: "ct-1", description: "Recarga Bilhete Único Estudantil", amount: 95.0, date: "06 nov.", paymentMethod: "Conta Nubank" },
      { id: "ct-2", description: "Metrô integração campus universitário", amount: 35.0, date: "16 nov.", paymentMethod: "Conta Inter" },
    ],
    lazer: [
      { id: "cl-1", description: "Confraternização dos calouros (Rateio)", amount: 55.0, date: "15 nov.", paymentMethod: "Conta Nubank" },
      { id: "cl-2", description: "Cinema universitário com meia-entrada", amount: 22.0, date: "09 nov.", paymentMethod: "Cartão Nubank" },
      { id: "cl-3", description: "Açaí pós-treino no campus", amount: 18.0, date: "04 nov.", paymentMethod: "Conta Inter" },
    ],
    outros: [
      { id: "co-1", description: "Farmácia (Vitamina C e analgésico)", amount: 28.0, date: "11 nov.", paymentMethod: "Cartão C6" },
      { id: "co-2", description: "Reparo de fone de ouvido", amount: 17.0, date: "08 nov.", paymentMethod: "Conta Nubank" },
    ],
  });

  // Ações sobre a lista de gastos da categoria
  const handleAddExpenseToCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryModal) return;
    const cleanAmount = parseFloat(newExpenseAmount.replace(",", "."));
    if (!newExpenseDesc.trim() || isNaN(cleanAmount) || cleanAmount <= 0) {
      showToast("Preencha a descrição e um valor válido para o gasto.");
      return;
    }

    const newItem: CategoryExpenseItem = {
      id: `ce-${Date.now()}`,
      description: newExpenseDesc.trim(),
      amount: cleanAmount,
      date: "Hoje",
      paymentMethod: newExpensePaymentMethod,
    };

    const catId = selectedCategoryModal.id;
    const updatedList = [newItem, ...(categoryExpenses[catId] || [])];

    setCategoryExpenses((prev) => ({
      ...prev,
      [catId]: updatedList,
    }));

    // Recalcular totais da categoria
    const newTotal = updatedList.reduce((sum, item) => sum + item.amount, 0);
    setCategoriesSpending((prev) => {
      const nextCategories = prev.map((c) =>
        c.id === catId ? { ...c, amount: Math.round(newTotal) } : c
      );
      const overallTotal = nextCategories.reduce((acc, curr) => acc + curr.amount, 0) || 1;
      return nextCategories.map((c) => ({
        ...c,
        percent: Math.round((c.amount / overallTotal) * 100),
      }));
    });

    setNewExpenseDesc("");
    setNewExpenseAmount("");
    showToast(`Gasto "${newItem.description}" adicionado a ${selectedCategoryModal.name}!`);
  };

  const handleRemoveCategoryExpense = (catId: string, expenseId: string) => {
    const currentList = categoryExpenses[catId] || [];
    const itemToRemove = currentList.find((i) => i.id === expenseId);
    const updatedList = currentList.filter((i) => i.id !== expenseId);

    setCategoryExpenses((prev) => ({
      ...prev,
      [catId]: updatedList,
    }));

    const newTotal = updatedList.reduce((sum, item) => sum + item.amount, 0);
    setCategoriesSpending((prev) => {
      const nextCategories = prev.map((c) =>
        c.id === catId ? { ...c, amount: Math.round(newTotal) } : c
      );
      const overallTotal = nextCategories.reduce((acc, curr) => acc + curr.amount, 0) || 1;
      return nextCategories.map((c) => ({
        ...c,
        percent: Math.round((c.amount / overallTotal) * 100),
      }));
    });

    if (itemToRemove) {
      showToast(`Gasto "${itemToRemove.description}" removido.`);
    }
  };

  // Criação ou Atualização de Meta de Gastos
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = parseFloat(goalTargetAmount.replace(",", "."));
    if (!goalCategoryName.trim() || isNaN(cleanTarget) || cleanTarget <= 0) {
      showToast("Por favor, informe a categoria e um teto de meta válido.");
      return;
    }

    const cleanCurrent = goalCurrentAmount ? parseFloat(goalCurrentAmount.replace(",", ".")) : 0;
    const cleanPrevious = goalPreviousAmount ? parseFloat(goalPreviousAmount.replace(",", ".")) : 0;
    const catNameTrimmed = goalCategoryName.trim();

    const existingIndex = evolutionData.findIndex(
      (item) => item.name.toLowerCase() === catNameTrimmed.toLowerCase()
    );

    if (existingIndex >= 0) {
      // Atualizar meta existente
      setEvolutionData((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                target: cleanTarget,
                ...(cleanCurrent > 0 ? { current: cleanCurrent } : {}),
                ...(cleanPrevious > 0 ? { previous: cleanPrevious } : {}),
              }
            : item
        )
      );
      showToast(`Meta para "${catNameTrimmed}" atualizada para ${formatCurrency(cleanTarget, false)}!`);
      scrollToMeta(existingIndex);
    } else {
      // Cadastrar nova meta
      const newId = `meta-${Date.now()}`;
      const newEntry: CategoryEvolution = {
        id: newId,
        name: catNameTrimmed,
        current: isNaN(cleanCurrent) ? 0 : cleanCurrent,
        target: cleanTarget,
        previous: isNaN(cleanPrevious) ? 0 : cleanPrevious,
      };

      setEvolutionData((prev) => [...prev, newEntry]);

      // Sincronizar com categoriesSpending se ainda não existir
      const catExists = categoriesSpending.some(
        (c) => c.name.toLowerCase() === catNameTrimmed.toLowerCase()
      );
      if (!catExists) {
        const colors = ["#FFD166", "#00E5FF", "#A8F45D", "#FF85A1", "#9D4EDD"];
        const color = colors[categoriesSpending.length % colors.length];
        setCategoriesSpending((prev) => [
          ...prev,
          {
            id: newId,
            name: catNameTrimmed,
            amount: newEntry.current,
            percent: 5,
            color,
          },
        ]);
      }

      showToast(`Meta para "${catNameTrimmed}" cadastrada com sucesso!`);
      setTimeout(() => {
        scrollToMeta(evolutionData.length);
      }, 100);
    }

    setGoalCategoryName("");
    setGoalTargetAmount("");
    setGoalCurrentAmount("");
    setGoalPreviousAmount("");
    setShowNewGoalModal(false);
  };

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

  // Formatação em Moeda segura
  const formatCurrency = (val: number, decimals = true) => {
    if (typeof val !== "number" || isNaN(val)) return decimals ? "R$ 0,00" : "R$ 0";
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
    setFixedModalType(null);
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
    setFixedModalType(null);
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

  // Separação em Despesas (Esquerda) e Receitas (Direita) + Totais e Saldo Final
  const expenseTransactions = useMemo(
    () => filteredTransactions.filter((tx) => tx.type === "expense"),
    [filteredTransactions]
  );

  const incomeTransactions = useMemo(
    () => filteredTransactions.filter((tx) => tx.type === "income"),
    [filteredTransactions]
  );

  const totalMonthlyExpenses = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "expense")
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
    [transactions]
  );

  const totalMonthlyIncomes = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "income")
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
    [transactions]
  );

  const monthlyFinalBalance = totalMonthlyIncomes - totalMonthlyExpenses;

  // Previsões filtradas para a busca
  const filteredForecast = useMemo(() => {
    if (!searchQuery.trim()) return forecastItems;
    const q = searchQuery.toLowerCase();
    return forecastItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [forecastItems, searchQuery]);

  // Separação da Previsão em Despesas (Esquerda) e Receitas (Direita) + Totais e Saldo Previsto
  const expenseForecast = useMemo(
    () => filteredForecast.filter((fc) => fc.type === "expense"),
    [filteredForecast]
  );

  const incomeForecast = useMemo(
    () => filteredForecast.filter((fc) => fc.type === "income"),
    [filteredForecast]
  );

  const totalForecastExpenses = useMemo(
    () =>
      forecastItems
        .filter((fc) => fc.type === "expense")
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
    [forecastItems]
  );

  const totalForecastIncomes = useMemo(
    () =>
      forecastItems
        .filter((fc) => fc.type === "income")
        .reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
    [forecastItems]
  );

  const forecastFinalBalance = totalForecastIncomes - totalForecastExpenses;

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
    <div className="max-w-[1240px] w-full mx-auto space-y-6 md:space-y-7 pb-12 select-none relative overflow-x-hidden">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50 flex items-center justify-between gap-3 bg-[#1A162B] border border-[#D6B2FF]/30 text-white px-4 py-3 rounded-xl shadow-2xl shadow-purple-950/60 transition-all">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-[#4DE8B3] shrink-0" />
            <span className="text-xs font-medium">{toastMessage}</span>
          </div>
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 block mb-1">
              TERÇA-FEIRA, 19 DE NOVEMBRO
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Planejamento Financeiro
            </h1>
          </div>

          {/* Botão de Notificações no Mobile (alinhado ao topo direito do título) */}
          <div className="md:hidden relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadNotifications(0);
              }}
              aria-label="Notificações"
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-[#131024] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 transition-all relative cursor-pointer"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#4DE8B3] absolute top-2.5 right-2.5 ring-2 ring-[#131024]" />
              )}
            </button>
          </div>
        </div>

        {/* Ações da Direita (Busca Compacta + Notificações Desktop + Seletor de Mês) */}
        <div className="flex items-center gap-2 sm:gap-3 relative w-full md:w-auto">
          {/* Campo de Busca Compacto no Mobile para não gerar folga lateral */}
          <div className="relative flex-1 min-w-0 md:flex-initial">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full md:w-48 lg:w-56 min-h-[44px] bg-[#131024] border border-white/10 rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF]/50 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Botão de Notificações Desktop */}
          <div className="hidden md:block relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadNotifications(0);
              }}
              aria-label="Notificações"
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-[#131024] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 transition-all relative cursor-pointer"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#4DE8B3] absolute top-2.5 right-2.5 ring-2 ring-[#131024]" />
              )}
            </button>
          </div>

          {/* Popover de Notificações */}
          {showNotifications && (
            <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-36 md:top-13 md:w-80 bg-[#131024] border border-white/10 rounded-2xl p-4 shadow-2xl z-40 space-y-3">
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

          {/* Seletor de Mês (Lilás conforme protótipo) */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="min-h-[44px] bg-[#D6B2FF] text-[#0B0914] hover:bg-[#c79efc] px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Calendar size={15} className="shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-none">{selectedMonth}</span>
              <ChevronDown
                size={15}
                className={`shrink-0 transition-transform duration-200 ${isMonthDropdownOpen ? "rotate-180" : ""
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
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${selectedMonth === m
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
      {/* Versão Mobile: Dois botões lado a lado que abrem um box/modal */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setFixedModalType("income")}
          className="min-h-[76px] rounded-2xl border border-[#4DE8B3]/25 bg-[#131024] hover:bg-[#19152B] p-3.5 flex flex-col justify-between text-left transition-all active:scale-[0.98] cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-[#10E59B]/15 border border-[#10E59B]/30 flex items-center justify-center text-[#4DE8B3]">
              <Wallet size={16} />
            </div>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#4DE8B3] bg-[#4DE8B3]/10 px-2 py-0.5 rounded-full">
              <Plus size={11} />
              Nova
            </span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-zinc-400 block leading-tight">
              Receitas Fixas
            </span>
            <span className="text-sm font-bold text-[#4DE8B3] block mt-0.5">
              + {formatCurrency(totalFixedIncomes, false)}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setFixedModalType("expense")}
          className="min-h-[76px] rounded-2xl border border-[#FF85A1]/25 bg-[#131024] hover:bg-[#19152B] p-3.5 flex flex-col justify-between text-left transition-all active:scale-[0.98] cursor-pointer shadow-lg"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 rounded-xl bg-[#FF85A1]/15 border border-[#FF85A1]/30 flex items-center justify-center text-[#FF85A1]">
              <ArrowLeftRight size={16} />
            </div>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#FF85A1] bg-[#FF85A1]/10 px-2 py-0.5 rounded-full">
              <Plus size={11} />
              Nova
            </span>
          </div>
          <div className="mt-2">
            <span className="text-[11px] font-medium text-zinc-400 block leading-tight">
              Despesas Fixas
            </span>
            <span className="text-sm font-bold text-[#FF85A1] block mt-0.5">
              - {formatCurrency(totalFixedExpenses, false)}
            </span>
          </div>
        </button>
      </div>

      {/* Versão Desktop/Tablet: Cards completos com formulário inline */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-5">
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

      {/* 3. TRANSAÇÕES DO MÊS E PREVISÃO FUTURA (Carrossel no Mobile / Grid no Desktop) */}
      <div className="space-y-2.5">
        <div
          ref={txCarouselRef}
          onScroll={handleTxCarouselScroll}
          className="flex lg:grid lg:grid-cols-2 gap-3.5 lg:gap-5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
        {/* Card: Transações do Mês Atual */}
        <div className="w-[92%] sm:w-[88%] lg:w-auto shrink-0 snap-center rounded-2xl border border-white/5 bg-[#131024] p-3.5 sm:p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-3">
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

          {/* Barra de Saldo Final no Topo */}
          <div className="bg-[#19152B]/90 rounded-xl px-3 py-2 flex items-center justify-between border border-white/[0.06] mb-2.5">
            <span className="text-xs font-medium text-zinc-400">Saldo final do mês</span>
            <span
              className={`text-sm font-bold ${monthlyFinalBalance >= 0 ? "text-[#4DE8B3]" : "text-[#FF85A1]"
                }`}
            >
              {monthlyFinalBalance >= 0
                ? `+ ${formatCurrency(monthlyFinalBalance)}`
                : `- ${formatCurrency(Math.abs(monthlyFinalBalance))}`}
            </span>
          </div>

          {/* Duas Tabelas Lado a Lado sem folga interna: Despesas (Esquerda) e Receitas (Direita) */}
          <div className="grid grid-cols-2 border border-white/[0.07] rounded-xl bg-[#19152B]/40 overflow-hidden divide-x divide-white/[0.07]">
            {/* LADO ESQUERDO: TABELA DE DESPESAS */}
            <div className="min-w-0 flex flex-col">
              {/* Total de Despesas em cima da tabela */}
              <div className="px-2.5 py-2 bg-[#FF85A1]/[0.08] border-b border-white/[0.07] flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF85A1] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-200 truncate">
                    Despesas
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#FF85A1] whitespace-nowrap shrink-0">
                  - {formatCurrency(totalMonthlyExpenses, false)}
                </span>
              </div>

              {/* Tabela de Despesas sem folga */}
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500">
                    <th className="py-1.5 pl-2.5 pr-1 font-semibold w-[62%]">Descrição</th>
                    <th className="py-1.5 pl-1 pr-2.5 font-semibold text-right w-[38%]">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {expenseTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => {
                        const cat = categoriesSpending.find(
                          (c) =>
                            c.name.toLowerCase().includes(tx.category.toLowerCase()) ||
                            tx.category.toLowerCase().includes(c.name.toLowerCase()) ||
                            c.id.toLowerCase().includes(tx.category.toLowerCase())
                        );
                        if (cat) setSelectedCategoryModal(cat);
                      }}
                      title={`Clique para ver os gastos de ${tx.category}`}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      <td className="py-1.5 pl-2.5 pr-1 min-w-0">
                        <p className="text-[11px] sm:text-xs font-medium text-white truncate group-hover:text-[#FF85A1] transition-colors leading-tight">
                          {tx.title}
                        </p>
                        <span className="text-[9px] sm:text-[10px] text-zinc-500 block truncate leading-tight">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-1.5 pl-1 pr-2.5 text-right whitespace-nowrap align-middle">
                        <span className="text-[11px] sm:text-xs font-semibold text-[#FF85A1]">
                          -{formatCurrency(Math.abs(tx.amount), false)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* LADO DIREITO: TABELA DE RECEITAS */}
            <div className="min-w-0 flex flex-col">
              {/* Total de Receitas em cima da tabela */}
              <div className="px-2.5 py-2 bg-[#4DE8B3]/[0.08] border-b border-white/[0.07] flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4DE8B3] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-200 truncate">
                    Receitas
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#4DE8B3] whitespace-nowrap shrink-0">
                  + {formatCurrency(totalMonthlyIncomes, false)}
                </span>
              </div>

              {/* Tabela de Receitas sem folga */}
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500">
                    <th className="py-1.5 pl-2.5 pr-1 font-semibold w-[62%]">Descrição</th>
                    <th className="py-1.5 pl-1 pr-2.5 font-semibold text-right w-[38%]">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {incomeTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setShowAllTransactionsModal(true)}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      <td className="py-1.5 pl-2.5 pr-1 min-w-0">
                        <p className="text-[11px] sm:text-xs font-medium text-white truncate group-hover:text-[#4DE8B3] transition-colors leading-tight">
                          {tx.title}
                        </p>
                        <span className="text-[9px] sm:text-[10px] text-zinc-500 block truncate leading-tight">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-1.5 pl-1 pr-2.5 text-right whitespace-nowrap align-middle">
                        <span className="text-[11px] sm:text-xs font-semibold text-[#4DE8B3]">
                          +{formatCurrency(Math.abs(tx.amount), false)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Card: Previsão do Próximo Mês */}
        <div className="w-[92%] sm:w-[88%] lg:w-auto shrink-0 snap-center rounded-2xl border border-white/5 bg-[#131024] p-3.5 sm:p-5 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-3">
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

          {/* Barra de Saldo Final Previsto no Topo */}
          <div className="bg-[#19152B]/90 rounded-xl px-3 py-2 flex items-center justify-between border border-white/[0.06] mb-2.5">
            <span className="text-xs font-medium text-zinc-400">Saldo final previsto</span>
            <span
              className={`text-sm font-bold ${
                forecastFinalBalance >= 0 ? "text-[#4DE8B3]" : "text-[#FF85A1]"
              }`}
            >
              {forecastFinalBalance >= 0
                ? `+ ${formatCurrency(forecastFinalBalance)}`
                : `- ${formatCurrency(Math.abs(forecastFinalBalance))}`}
            </span>
          </div>

          {/* Duas Tabelas Lado a Lado sem folga interna: Despesas (Esquerda) e Receitas (Direita) */}
          <div className="grid grid-cols-2 border border-white/[0.07] rounded-xl bg-[#19152B]/40 overflow-hidden divide-x divide-white/[0.07]">
            {/* LADO ESQUERDO: TABELA DE DESPESAS PREVISTAS */}
            <div className="min-w-0 flex flex-col">
              {/* Total de Despesas em cima da tabela */}
              <div className="px-2.5 py-2 bg-[#FF85A1]/[0.08] border-b border-white/[0.07] flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF85A1] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-200 truncate">
                    Despesas
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#FF85A1] whitespace-nowrap shrink-0">
                  - {formatCurrency(totalForecastExpenses, false)}
                </span>
              </div>

              {/* Tabela de Despesas Previstas sem folga */}
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500">
                    <th className="py-1.5 pl-2.5 pr-1 font-semibold w-[62%]">Descrição</th>
                    <th className="py-1.5 pl-1 pr-2.5 font-semibold text-right w-[38%]">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {expenseForecast.map((fc) => (
                    <tr
                      key={fc.id}
                      onClick={() => toggleForecastStatus(fc.id)}
                      title={`Status: ${fc.status} (clique para alternar)`}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      <td className="py-1.5 pl-2.5 pr-1 min-w-0">
                        <p className="text-[11px] sm:text-xs font-medium text-white truncate group-hover:text-[#FF85A1] transition-colors leading-tight">
                          {fc.title}
                        </p>
                        <span className="text-[9px] sm:text-[10px] text-zinc-500 block truncate leading-tight">
                          {fc.dueDate} • {fc.status}
                        </span>
                      </td>
                      <td className="py-1.5 pl-1 pr-2.5 text-right whitespace-nowrap align-middle">
                        <span className="text-[11px] sm:text-xs font-semibold text-[#FF85A1]">
                          -{formatCurrency(Math.abs(fc.amount), false)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* LADO DIREITO: TABELA DE RECEITAS PREVISTAS */}
            <div className="min-w-0 flex flex-col">
              {/* Total de Receitas em cima da tabela */}
              <div className="px-2.5 py-2 bg-[#4DE8B3]/[0.08] border-b border-white/[0.07] flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4DE8B3] shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-zinc-200 truncate">
                    Receitas
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-[#4DE8B3] whitespace-nowrap shrink-0">
                  + {formatCurrency(totalForecastIncomes, false)}
                </span>
              </div>

              {/* Tabela de Receitas Previstas sem folga */}
              <table className="w-full table-fixed text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] text-[9px] sm:text-[10px] uppercase tracking-wider text-zinc-500">
                    <th className="py-1.5 pl-2.5 pr-1 font-semibold w-[62%]">Descrição</th>
                    <th className="py-1.5 pl-1 pr-2.5 font-semibold text-right w-[38%]">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {incomeForecast.map((fc) => (
                    <tr
                      key={fc.id}
                      onClick={() => toggleForecastStatus(fc.id)}
                      title={`Status: ${fc.status} (clique para alternar)`}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      <td className="py-1.5 pl-2.5 pr-1 min-w-0">
                        <p className="text-[11px] sm:text-xs font-medium text-white truncate group-hover:text-[#4DE8B3] transition-colors leading-tight">
                          {fc.title}
                        </p>
                        <span className="text-[9px] sm:text-[10px] text-zinc-500 block truncate leading-tight">
                          {fc.dueDate} • {fc.status}
                        </span>
                      </td>
                      <td className="py-1.5 pl-1 pr-2.5 text-right whitespace-nowrap align-middle">
                        <span className="text-[11px] sm:text-xs font-semibold text-[#4DE8B3]">
                          +{formatCurrency(Math.abs(fc.amount), false)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>

        {/* Indicadores de Página do Carrossel (Exclusivo Mobile/Tablet) */}
        <div className="flex lg:hidden items-center justify-center gap-2 pt-0.5">
          {[
            { idx: 0, label: "Mês Atual" },
            { idx: 1, label: "Próximo Mês" },
          ].map((slide) => (
            <button
              key={slide.idx}
              type="button"
              onClick={() => scrollToTxSlide(slide.idx)}
              aria-label={`Ir para ${slide.label}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeTxSlide === slide.idx
                  ? "w-6 bg-[#D6B2FF]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* DIVISOR VISUAL ENTRE SEÇÃO DE TABELAS E SEÇÃO DE GRÁFICOS */}
      <div className="pt-2 pb-1 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-[#D6B2FF]/40" />
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#131024] border border-[#D6B2FF]/25 text-[10px] font-semibold uppercase tracking-widest text-[#D6B2FF] shadow-sm">
            <TrendingUp size={12} className="text-[#D6B2FF]" />
            <span>Análise & Gráficos</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-[#D6B2FF]/40" />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-5 rounded-full bg-[#D6B2FF]" />
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight leading-tight">
              Distribuição e Evolução por Categoria
            </h2>
            <p className="text-[11px] text-zinc-400">
              Proporção dos seus gastos no mês e comparativo com suas metas
            </p>
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
                        setSelectedCategoryModal(categoriesSpending[0]);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <AlertCircle size={14} className="text-[#D6B2FF]" />
                      Ver detalhes de gastos
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategoryModal(segment);
                          }}
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
                    <button
                      type="button"
                      key={cat.id}
                      onMouseEnter={() => setHoveredCategory(cat.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() => setSelectedCategoryModal(cat)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer group select-none text-left ${isHovered ? "bg-white/[0.08] translate-x-1" : "hover:bg-white/[0.04]"
                        }`}
                      title={`Clique para ver todos os gastos em ${cat.name}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{
                            backgroundColor: cat.color,
                            boxShadow: isHovered ? `0 0 8px ${cat.color}` : "none",
                          }}
                        />
                        <span
                          className={`text-xs transition-colors ${isHovered ? "text-white font-semibold" : "text-zinc-300 group-hover:text-white"
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
                        <ChevronRight
                          size={14}
                          className="text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Card: Coletânea de Gráficos de Barras Horizontais (Totais + Carrossel de Metas) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/5 bg-[#131024] p-4 sm:p-6 shadow-lg flex flex-col justify-between relative space-y-4 sm:space-y-5">
          {/* Cabeçalho do Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
            <div>
              <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block">
                Evolução e Metas
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Comparativo de Gastos e Metas
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Legenda Geral de Cores */}
              <div className="flex items-center gap-2.5 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D6B2FF]" />
                  <span className="text-zinc-300">Atual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4DE8B3]" />
                  <span className="text-zinc-300">Meta</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7B2CBF]" />
                  <span className="text-zinc-300">Anterior</span>
                </div>
              </div>

              {/* Botão Cadastrar Nova Meta */}
              <button
                type="button"
                onClick={() => setShowNewGoalModal(true)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#D6B2FF] hover:bg-[#c79efc] text-[#0B0914] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-purple-950/30 cursor-pointer active:scale-95 shrink-0"
              >
                <Plus size={15} strokeWidth={2.5} />
                <span>Nova Meta</span>
              </button>
            </div>
          </div>

          {/* 1. PRIMEIRO GRÁFICO: COMPARAÇÃO DOS TOTAIS GERAIS (Barras Horizontais) */}
          <div className="rounded-xl border border-white/10 bg-[#19152B]/80 p-3.5 sm:p-4 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#D6B2FF]/10 text-[#D6B2FF] flex items-center justify-center">
                  <Target size={15} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    Comparação Geral dos Totais
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400">
                    Soma consolidada de todas as metas
                  </p>
                </div>
              </div>

              {/* Badge de Status Geral */}
              <span
                className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  totalEvolutionCurrent <= totalEvolutionTarget
                    ? "bg-[#10E59B]/15 text-[#10E59B] border border-[#10E59B]/30"
                    : "bg-[#FF85A1]/15 text-[#FF85A1] border border-[#FF85A1]/30"
                }`}
              >
                {totalEvolutionCurrent <= totalEvolutionTarget
                  ? `Dentro do teto (Sobram ${formatCurrency(totalEvolutionTarget - totalEvolutionCurrent, false)})`
                  : `Acima do teto (+${formatCurrency(totalEvolutionCurrent - totalEvolutionTarget, false)})`}
              </span>
            </div>

            {/* Barras Horizontais dos Totais */}
            {(() => {
              const maxTotal =
                Math.max(totalEvolutionCurrent, totalEvolutionTarget, totalEvolutionPrevious, 1) * 1.05;
              const currentPct = Math.min(100, (totalEvolutionCurrent / maxTotal) * 100);
              const targetPct = Math.min(100, (totalEvolutionTarget / maxTotal) * 100);
              const prevPct = Math.min(100, (totalEvolutionPrevious / maxTotal) * 100);

              return (
                <div className="space-y-2.5 pt-1">
                  {/* Barra 1: Gasto Atual Consolidado */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#D6B2FF]" />
                        Gasto atual total
                      </span>
                      <span className="font-bold text-white">
                        {formatCurrency(totalEvolutionCurrent)}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-[#131024] rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#9D4EDD] to-[#D6B2FF] transition-all duration-500 shadow-[0_0_8px_rgba(214,178,255,0.4)]"
                        style={{ width: `${currentPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Barra 2: Meta Global Consolidada */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#4DE8B3]" />
                        Meta global planejada
                      </span>
                      <span className="font-bold text-[#4DE8B3]">
                        {formatCurrency(totalEvolutionTarget)}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-[#131024] rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#10E59B] to-[#4DE8B3] transition-all duration-500 shadow-[0_0_8px_rgba(77,232,179,0.3)]"
                        style={{ width: `${targetPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Barra 3: Mês Anterior Consolidado */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#7B2CBF]" />
                        Total do mês anterior
                      </span>
                      <span className="font-semibold text-zinc-300">
                        {formatCurrency(totalEvolutionPrevious)}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-[#131024] rounded-full overflow-hidden p-0.5 border border-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#3A2A5E] to-[#7B2CBF] transition-all duration-500"
                        style={{ width: `${prevPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Rodapé do Bloco de Totais */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <span>
                Consumido:{" "}
                <strong className="text-white">
                  {((totalEvolutionCurrent / (totalEvolutionTarget || 1)) * 100).toFixed(0)}%
                </strong>{" "}
                da meta geral
              </span>
              <span className="text-[#4DE8B3] font-medium">
                Economia de {formatCurrency(totalEvolutionTarget - totalEvolutionCurrent, false)}
              </span>
            </div>
          </div>

          {/* 2. SEGUNDO BLOCO: CARROSSEL DE BARRAS HORIZONTAIS POR META DEFINIDA */}
          <div className="space-y-2.5">
            {/* Cabeçalho do Carrossel com Navegação */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Metas por Categoria
                </span>
                <span className="text-xs font-bold text-white">
                  Meta {activeMetaIndex + 1} de {evolutionData.length}:{" "}
                  <span className="text-[#D6B2FF]">{evolutionData[activeMetaIndex]?.name}</span>
                </span>
              </div>

              {/* Botões de Navegação Anterior / Próximo */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollToMeta(Math.max(0, activeMetaIndex - 1))}
                  disabled={activeMetaIndex === 0}
                  aria-label="Meta anterior"
                  className="min-h-[44px] min-w-[44px] w-11 h-11 rounded-xl bg-[#19152B] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    scrollToMeta(Math.min(evolutionData.length - 1, activeMetaIndex + 1))
                  }
                  disabled={activeMetaIndex === evolutionData.length - 1}
                  aria-label="Próxima meta"
                  className="min-h-[44px] min-w-[44px] w-11 h-11 rounded-xl bg-[#19152B] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-all cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Pílulas de Acesso Rápido para Cada Categoria */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {evolutionData.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToMeta(idx)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMetaIndex === idx
                      ? "bg-[#D6B2FF] text-[#0B0914] shadow-md shadow-purple-950/40"
                      : "bg-[#19152B] text-zinc-400 hover:text-white border border-white/5 hover:border-white/15"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeMetaIndex === idx ? "bg-[#0B0914]" : "bg-[#D6B2FF]"
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              ))}

              {/* Botão Atalho Nova Meta nas Pílulas */}
              <button
                type="button"
                onClick={() => setShowNewGoalModal(true)}
                className="min-h-[44px] px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 bg-[#D6B2FF]/10 text-[#D6B2FF] hover:bg-[#D6B2FF]/20 border border-[#D6B2FF]/30 active:scale-95 shrink-0"
                title="Cadastrar nova meta de gastos"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Nova Meta</span>
              </button>
            </div>

            {/* Container do Carrossel Horizontal das Metas */}
            <div
              ref={metaCarouselRef}
              onScroll={handleMetaCarouselScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {evolutionData.map((item) => {
                const maxVal = Math.max(item.current, item.target, item.previous, 1) * 1.08;
                const currentPct = Math.min(100, (item.current / maxVal) * 100);
                const targetPct = Math.min(100, (item.target / maxVal) * 100);
                const prevPct = Math.min(100, (item.previous / maxVal) * 100);
                const usedPct = ((item.current / (item.target || 1)) * 100).toFixed(0);
                const margin = item.target - item.current;

                return (
                  <div
                    key={item.id}
                    className="w-full shrink-0 snap-center rounded-xl border border-white/5 bg-[#19152B]/60 p-3.5 sm:p-4 space-y-3"
                  >
                    {/* Linha de Título da Categoria */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D6B2FF] shrink-0" />
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        <span className="text-[11px] text-zinc-400">({usedPct}% da meta)</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            item.current <= item.target
                              ? "bg-[#10E59B]/15 text-[#10E59B] border border-[#10E59B]/30"
                              : "bg-[#FF85A1]/15 text-[#FF85A1] border border-[#FF85A1]/30"
                          }`}
                        >
                          {item.current <= item.target
                            ? `Dentro da meta (${formatCurrency(margin, false)} livres)`
                            : `Acima da meta (+${formatCurrency(Math.abs(margin), false)})`}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            const cat = categoriesSpending.find((c) => c.id === item.id);
                            if (cat) setSelectedCategoryModal(cat);
                          }}
                          className="min-h-[44px] px-2 text-[11px] font-medium text-[#D6B2FF] hover:underline cursor-pointer flex items-center"
                        >
                          Ver gastos →
                        </button>
                      </div>
                    </div>

                    {/* 3 Barras Horizontais da Categoria */}
                    <div className="space-y-2.5">
                      {/* Barra: Gasto Atual */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-300 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#D6B2FF]" />
                            Gasto atual
                          </span>
                          <span className="font-bold text-white">
                            {formatCurrency(item.current)}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-[#131024] rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#9D4EDD] to-[#D6B2FF] transition-all duration-500 shadow-[0_0_8px_rgba(214,178,255,0.4)]"
                            style={{ width: `${currentPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Barra: Meta Estabelecida */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-300 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#4DE8B3]" />
                            Meta estabelecida
                          </span>
                          <span className="font-bold text-[#4DE8B3]">
                            {formatCurrency(item.target)}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-[#131024] rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#10E59B] to-[#4DE8B3] transition-all duration-500 shadow-[0_0_8px_rgba(77,232,179,0.3)]"
                            style={{ width: `${targetPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Barra: Mês Anterior */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400 flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#7B2CBF]" />
                            Mês anterior
                          </span>
                          <span className="font-semibold text-zinc-300">
                            {formatCurrency(item.previous)}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-[#131024] rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#3A2A5E] to-[#7B2CBF] transition-all duration-500"
                            style={{ width: `${prevPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Rodapé Informativo da Categoria */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
                      <span>
                        Margem disponível:{" "}
                        <strong
                          className={margin >= 0 ? "text-[#4DE8B3]" : "text-[#FF85A1]"}
                        >
                          {margin >= 0
                            ? formatCurrency(margin)
                            : `- ${formatCurrency(Math.abs(margin))}`}
                        </strong>
                      </span>
                      <span>
                        Comparativo:{" "}
                        <strong className="text-white">
                          {item.current === item.previous
                            ? "Igual ao mês anterior"
                            : item.current < item.previous
                            ? `${formatCurrency(item.previous - item.current, false)} a menos`
                            : `${formatCurrency(item.current - item.previous, false)} a mais`}
                        </strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Indicadores de Página do Carrossel de Metas */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {evolutionData.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToMeta(idx)}
                  aria-label={`Ir para meta de ${item.name}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeMetaIndex === idx
                      ? "w-6 bg-[#D6B2FF]"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4.5. MODAL MOBILE: CADASTRAR RECEITA OU DESPESA FIXA */}
      {fixedModalType && (
        <div
          onClick={() => setFixedModalType(null)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-[#131024] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            {/* Cabeçalho do Box */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${fixedModalType === "income"
                      ? "bg-[#10E59B]/10 border-[#10E59B]/25 text-[#4DE8B3]"
                      : "bg-[#FF85A1]/10 border-[#FF85A1]/25 text-[#FF85A1]"
                    }`}
                >
                  {fixedModalType === "income" ? (
                    <Wallet size={20} />
                  ) : (
                    <ArrowLeftRight size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {fixedModalType === "income"
                      ? "Receitas Fixas"
                      : "Despesas Fixas"}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    {fixedModalType === "income"
                      ? `Total atual: + ${formatCurrency(totalFixedIncomes)}`
                      : `Total atual: - ${formatCurrency(totalFixedExpenses)}`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFixedModalType(null)}
                aria-label="Fechar modal"
                className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Lista de Itens Fixos já Cadastrados */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {(fixedModalType === "income" ? fixedIncomes : fixedExpenses).map(
                (entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#19152B] border border-white/5 text-xs"
                  >
                    <div>
                      <span className="font-medium text-white block">
                        {entry.description}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        Vencimento: Dia {entry.dueDay}
                      </span>
                    </div>
                    <span
                      className={`font-bold ${fixedModalType === "income"
                          ? "text-[#4DE8B3]"
                          : "text-[#FF85A1]"
                        }`}
                    >
                      {fixedModalType === "income" ? "+" : "-"}{" "}
                      {formatCurrency(entry.amount)}
                    </span>
                  </div>
                )
              )}
            </div>

            {/* Formulário para Adicionar Nova Receita ou Despesa Fixa */}
            <form
              onSubmit={
                fixedModalType === "income"
                  ? handleAddFixedIncome
                  : handleAddFixedExpense
              }
              className="space-y-3.5 pt-2 border-t border-white/10"
            >
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  value={fixedModalType === "income" ? incomeDesc : expenseDesc}
                  onChange={(e) =>
                    fixedModalType === "income"
                      ? setIncomeDesc(e.target.value)
                      : setExpenseDesc(e.target.value)
                  }
                  placeholder={
                    fixedModalType === "income"
                      ? "Ex.: Bolsa de estágio, Salário..."
                      : "Ex.: Aluguel, Internet..."
                  }
                  className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">
                    Valor mensal (R$)
                  </label>
                  <input
                    type="text"
                    required
                    value={
                      fixedModalType === "income" ? incomeAmount : expenseAmount
                    }
                    onChange={(e) =>
                      fixedModalType === "income"
                        ? setIncomeAmount(e.target.value)
                        : setExpenseAmount(e.target.value)
                    }
                    placeholder="R$ 0,00"
                    className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">
                    Vencimento
                  </label>
                  <select
                    value={
                      fixedModalType === "income" ? incomeDueDay : expenseDueDay
                    }
                    onChange={(e) =>
                      fixedModalType === "income"
                        ? setIncomeDueDay(e.target.value)
                        : setExpenseDueDay(e.target.value)
                    }
                    className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#D6B2FF] cursor-pointer"
                  >
                    <option value="Dia 01">Dia 01</option>
                    <option value="Dia 05">Dia 05</option>
                    <option value="Dia 10">Dia 10</option>
                    <option value="Dia 15">Dia 15</option>
                    <option value="Dia 20">Dia 20</option>
                    <option value="Dia 25">Dia 25</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setFixedModalType(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs text-[#0B0914] flex items-center gap-1.5 transition-all cursor-pointer ${fixedModalType === "income"
                      ? "bg-[#4DE8B3] hover:brightness-110"
                      : "bg-[#FF85A1] hover:brightness-110"
                    }`}
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>
                    {fixedModalType === "income"
                      ? "Adicionar Receita"
                      : "Adicionar Despesa"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${modalFilter === "all"
                    ? "bg-[#D6B2FF] text-[#0B0914]"
                    : "bg-[#19152B] text-zinc-400 hover:text-white"
                  }`}
              >
                Todas ({transactions.length})
              </button>
              <button
                onClick={() => setModalFilter("income")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${modalFilter === "income"
                    ? "bg-[#4DE8B3] text-[#0B0914]"
                    : "bg-[#19152B] text-zinc-400 hover:text-white"
                  }`}
              >
                Receitas ({transactions.filter((t) => t.type === "income").length})
              </button>
              <button
                onClick={() => setModalFilter("expense")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${modalFilter === "expense"
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
                    onClick={() => {
                      const cat = categoriesSpending.find(
                        (c) =>
                          c.name.toLowerCase().includes(tx.category.toLowerCase()) ||
                          tx.category.toLowerCase().includes(c.name.toLowerCase()) ||
                          c.id.toLowerCase().includes(tx.category.toLowerCase())
                      );
                      if (cat) {
                        setShowAllTransactionsModal(false);
                        setSelectedCategoryModal(cat);
                      }
                    }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#19152B] hover:bg-[#1e1933] transition-colors border border-white/5 cursor-pointer group"
                    title={`Ver gastos de ${tx.category}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                        style={{ backgroundColor: tx.color }}
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-[#D6B2FF] transition-colors">
                          {tx.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <span className="text-zinc-300 font-medium">{tx.category}</span>
                          <span>•</span>
                          <span>{tx.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-sm font-bold ${tx.amount > 0 ? "text-[#4DE8B3]" : "text-[#FF85A1]"
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
                      className={`h-9 rounded-lg flex flex-col items-center justify-center font-medium transition-all cursor-pointer relative ${isSelected
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
                    <span className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                    <span>Quarto em república (Moradia)</span>
                  </div>
                  <span className="font-semibold text-white">R$ 680,00</span>
                </div>
              )}
              {selectedCalendarDay === 15 && (
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4DE8B3]" />
                    <span>Bolsa de estágio (Receita fixa)</span>
                  </div>
                  <span className="font-semibold text-[#4DE8B3]">+ R$ 1.200,00</span>
                </div>
              )}
              {selectedCalendarDay === 18 && (
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                    <span>Rateio internet da república (Moradia)</span>
                  </div>
                  <span className="font-semibold text-white">R$ 65,00</span>
                </div>
              )}
              {selectedCalendarDay === 22 && (
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                    <span>Passe transporte estudantil (Transporte)</span>
                  </div>
                  <span className="font-semibold text-white">R$ 95,00</span>
                </div>
              )}
              {selectedCalendarDay === 24 && (
                <div className="flex items-center justify-between text-xs text-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                    <span>Rateio conta de luz (Moradia)</span>
                  </div>
                  <span className="font-semibold text-white">R$ 50,00</span>
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

      {/* 8. MODAL: DETALHES DE GASTOS DA CATEGORIA */}
      {selectedCategoryModal && (
        <div
          onClick={() => setSelectedCategoryModal(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#131024] p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Cabeçalho do Modal */}
            <div className="flex items-start justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${selectedCategoryModal.color}20`,
                    border: `1px solid ${selectedCategoryModal.color}40`,
                  }}
                >
                  <Receipt size={20} style={{ color: selectedCategoryModal.color }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: selectedCategoryModal.color }}
                    />
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {selectedCategoryModal.name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Todos os gastos desta subcategoria no mês
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCategoryModal(null)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Painel de Métricas Rápidas da Categoria */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-[#19152B] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Total Gasto</span>
                <span className="text-sm sm:text-base font-bold text-white mt-0.5 block">
                  {formatCurrency(
                    (categoryExpenses[selectedCategoryModal.id] || []).reduce((acc, curr) => acc + curr.amount, 0)
                  )}
                </span>
              </div>
              <div className="bg-[#19152B] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Lançamentos</span>
                <span className="text-sm sm:text-base font-bold text-zinc-200 mt-0.5 block">
                  {(categoryExpenses[selectedCategoryModal.id] || []).length} compras
                </span>
              </div>
              <div className="bg-[#19152B] p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Proporção</span>
                <span className="text-sm sm:text-base font-bold text-[#D6B2FF] mt-0.5 block">
                  {selectedCategoryModal.percent}% do total
                </span>
              </div>
            </div>

            {/* Lista com Rolagem dos Gastos */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 mb-4 max-h-56 sm:max-h-64">
              {(categoryExpenses[selectedCategoryModal.id] || []).length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  Nenhum gasto registrado nesta categoria ainda.
                </div>
              ) : (
                (categoryExpenses[selectedCategoryModal.id] || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#19152B]/60 hover:bg-[#19152B] border border-white/[0.04] hover:border-white/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: selectedCategoryModal.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-white truncate">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-400">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <CreditCard size={10} className="text-zinc-500" />
                            {item.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-semibold text-[#FF85A1]">
                        - {formatCurrency(item.amount)}
                      </span>
                      <button
                        onClick={() => handleRemoveCategoryExpense(selectedCategoryModal.id, item.id)}
                        title="Remover gasto"
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-1 rounded transition-all cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Formulário Rápido de Adição */}
            <form
              onSubmit={handleAddExpenseToCategory}
              className="border-t border-white/5 pt-3 mt-auto space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1">
                  <Plus size={12} className="text-[#D6B2FF]" />
                  Adicionar novo gasto em {selectedCategoryModal.name}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Ex: Compra na farmácia"
                  value={newExpenseDesc}
                  onChange={(e) => setNewExpenseDesc(e.target.value)}
                  className="sm:col-span-5 px-3 py-2 rounded-xl bg-[#19152B] border border-white/5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                />
                <input
                  type="text"
                  placeholder="R$ 0,00"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  className="sm:col-span-3 px-3 py-2 rounded-xl bg-[#19152B] border border-white/5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                />
                <select
                  value={newExpensePaymentMethod}
                  onChange={(e) => setNewExpensePaymentMethod(e.target.value)}
                  className="sm:col-span-4 px-2 py-2 rounded-xl bg-[#19152B] border border-white/5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] cursor-pointer"
                >
                  <option value="Conta Nubank">Conta Nubank</option>
                  <option value="Conta Inter">Conta Inter</option>
                  <option value="Cartão Nubank">Cartão Nubank</option>
                  <option value="Cartão C6">Cartão C6</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryModal(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#D6B2FF] text-[#0B0914] text-xs font-semibold hover:bg-[#c79efc] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL CENTRALIZADO: CADASTRAR NOVA META DE GASTOS */}
      {showNewGoalModal && (
        <div
          onClick={() => setShowNewGoalModal(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-[#131024] border border-white/10 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D6B2FF]/10 border border-[#D6B2FF]/25 text-[#D6B2FF] flex items-center justify-center">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Cadastrar Nova Meta de Gastos
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Defina o teto orçamentário mensal por categoria
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNewGoalModal(false)}
                aria-label="Fechar modal"
                className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sugestões Rápidas de Categorias */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-medium block">
                Sugestões rápidas de categorias
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Saúde & Farmácia",
                  "Vestuário & Roupas",
                  "Projetos Acadêmicos",
                  "Viagens & Congressos",
                  "Tecnologia & Gadgets",
                  "Streaming & Nuvem",
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setGoalCategoryName(sug)}
                    className="px-2.5 py-1 rounded-lg bg-[#19152B] hover:bg-[#D6B2FF]/15 border border-white/5 hover:border-[#D6B2FF]/30 text-[11px] text-zinc-300 hover:text-[#D6B2FF] transition-all cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Formulário de Criação da Meta */}
            <form onSubmit={handleCreateGoal} className="space-y-3.5 pt-1">
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">
                  Nome da Categoria <span className="text-[#FF85A1]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={goalCategoryName}
                  onChange={(e) => setGoalCategoryName(e.target.value)}
                  placeholder="Ex.: Saúde & Farmácia"
                  className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">
                  Teto da Meta Mensal (R$) <span className="text-[#FF85A1]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={goalTargetAmount}
                  onChange={(e) => setGoalTargetAmount(e.target.value)}
                  placeholder="R$ 0,00 (Ex: 250,00)"
                  className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">
                    Gasto Atual (R$)
                  </label>
                  <input
                    type="text"
                    value={goalCurrentAmount}
                    onChange={(e) => setGoalCurrentAmount(e.target.value)}
                    placeholder="R$ 0,00 (Opcional)"
                    className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-medium block mb-1">
                    Mês Anterior (R$)
                  </label>
                  <input
                    type="text"
                    value={goalPreviousAmount}
                    onChange={(e) => setGoalPreviousAmount(e.target.value)}
                    placeholder="R$ 0,00 (Opcional)"
                    className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#19152B]/80 border border-white/5 text-[11px] text-zinc-400 space-y-1">
                <span className="text-zinc-200 font-medium block">
                  💡 Como funciona a meta no MANNS:
                </span>
                <p>
                  Sua nova meta será adicionada imediatamente ao carrossel comparativo com as 3
                  barras horizontais (Gasto Atual vs Meta vs Mês Passado) e sincronizada com o teto
                  global consolidado.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-xs bg-[#D6B2FF] hover:bg-[#c79efc] text-[#0B0914] flex items-center gap-1.5 transition-all shadow-md shadow-purple-950/30 cursor-pointer active:scale-95"
                >
                  <Target size={15} strokeWidth={2.5} />
                  <span>Cadastrar Meta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}