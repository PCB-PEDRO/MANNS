"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Bell,
  UtensilsCrossed,
  Plus,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Sparkles,
  RefreshCw,
  Clock,
  FileCheck,
  ChevronRight,
  GraduationCap,
  DollarSign,
  Coffee,
  Cake,
  Pencil,
  Trash2,
  Check,
  Landmark,
  Wallet,
} from "lucide-react";

// Tipos e Interfaces
interface BorrowedBook {
  id: string;
  title: string;
  code: string;
  dueDate: string;
  daysRemaining: number;
  percentageRemaining: number;
}

interface BankAccount {
  id: string;
  bankName: string;
  badge: string;
  badgeColor: string;
  lastDigits: string;
  type: string;
  balance: number;
}

const studentBankAccounts: BankAccount[] = [
  {
    id: "nubank",
    bankName: "Nubank",
    badge: "nu",
    badgeColor: "#9D4EDD",
    lastDigits: "4821",
    type: "Conta corrente",
    balance: 842.5,
  },
  {
    id: "inter",
    bankName: "Banco Inter",
    badge: "I",
    badgeColor: "#00E5FF",
    lastDigits: "7390",
    type: "Reserva estudantil",
    balance: 420.0,
  },
  {
    id: "bb",
    bankName: "Banco do Brasil",
    badge: "BB",
    badgeColor: "#FFD166",
    lastDigits: "3104",
    type: "Conta universitária",
    balance: 587.5,
  },
];

export default function HubAcademicoPage() {
  // 1. Estados de Navegação e Filtros
  const [selectedSemester, setSelectedSemester] = useState("1º semestre de 2025");
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  // 2. Notificações do Campus
  const [campusNotifications, setCampusNotifications] = useState([
    {
      id: "cn-1",
      title: "Devolução de Livro Próxima",
      desc: "O livro 'Cálculo: Volume 1' vence em 3 dias. Faça a renovação online.",
      time: "Há 1 hora",
    },
    {
      id: "cn-2",
      title: "Bolsa de Permanência",
      desc: "Pagamento de R$ 850,00 programado para o dia 24 de maio.",
      time: "Há 4 horas",
    },
    {
      id: "cn-3",
      title: "Cardápio Semanal do RU",
      desc: "Cardápio vegetariano e tradicional disponível no portal.",
      time: "Ontem",
    },
  ]);

  // 3. Estados dos Serviços Universitários
  const [ruBalance, setRuBalance] = useState(36.0);
  const [lastUsageText, setLastUsageText] = useState("Hoje, 12h48 • 1 Refeição (R$ 3,00)");

  // 4. Estados dos Empréstimos da Biblioteca
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([
    {
      id: "b-1",
      title: "Algoritmos e Estruturas de Dados",
      code: "BCC - 004821",
      dueDate: "28 de maio",
      daysRemaining: 8,
      percentageRemaining: 67,
    },
    {
      id: "b-2",
      title: "Cálculo: Volume 1",
      code: "MAT - 002156",
      dueDate: "23 de maio",
      daysRemaining: 3,
      percentageRemaining: 28,
    },
    {
      id: "b-3",
      title: "Introdução à Economia",
      code: "ECO - 007744",
      dueDate: "4 de junho",
      daysRemaining: 15,
      percentageRemaining: 88,
    },
  ]);

  // 5. Estado da Multa da Biblioteca
  const [hasLibraryFine, setHasLibraryFine] = useState(true);
  const [fineAmount, setFineAmount] = useState(18.5);
  const [fineBookTitle, setFineBookTitle] = useState("Física para Cientistas");
  const [fineDescription, setFineDescription] = useState("5 dias de atraso • devolvido em 14/05");

  // 6. Estados de Modais e Formulários Interativos
  const [showFinePaymentModal, setShowFinePaymentModal] = useState(false);
  const [showRuRechargeModal, setShowRuRechargeModal] = useState(false);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "saldo">("pix");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados para Adicionar Livro
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookCode, setNewBookCode] = useState("");
  const [newBookDueDate, setNewBookDueDate] = useState("15 de junho");
  const [newBookDaysRemaining, setNewBookDaysRemaining] = useState(14);

  // Estados para Adicionar / Editar Multa
  const [showEditFineModal, setShowEditFineModal] = useState(false);
  const [editFineAmount, setEditFineAmount] = useState("18.50");
  const [editFineBookTitle, setEditFineBookTitle] = useState("Física para Cientistas");
  const [editFineDescription, setEditFineDescription] = useState("5 dias de atraso • devolvido em 14/05");

  // Estados para Seleção de Contas Bancárias (Lançamentos Informativos)
  const [selectedFineAccount, setSelectedFineAccount] = useState("nubank");
  const [lastPaidFineInfo, setLastPaidFineInfo] = useState("R$ 18,50 (Nubank • Conta corrente)");
  const [selectedRuAccount, setSelectedRuAccount] = useState("nubank");
  const [selectedRuPackage, setSelectedRuPackage] = useState(15.0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Formatação de Moeda
  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Ação de Renovação de Livro (+7 dias)
  const handleRenewBook = (bookId: string) => {
    setBorrowedBooks((prev) =>
      prev.map((book) => {
        if (book.id === bookId) {
          const newDays = book.daysRemaining + 7;
          const newPercent = Math.min(100, Math.round((newDays / 18) * 100));
          showToast(`Livro "${book.title}" renovado com sucesso! (+7 dias)`);
          return {
            ...book,
            daysRemaining: newDays,
            percentageRemaining: newPercent,
          };
        }
        return book;
      })
    );
  };

  // Ação de Adicionar Novo Livro
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle.trim()) {
      showToast("Informe o título do livro!");
      return;
    }
    const days = Number(newBookDaysRemaining) || 7;
    const percentage = Math.min(100, Math.round((days / 18) * 100));

    const newBook: BorrowedBook = {
      id: `b-${Date.now()}`,
      title: newBookTitle.trim(),
      code: newBookCode.trim() || `BIB - ${Math.floor(1000 + Math.random() * 9000)}`,
      dueDate: newBookDueDate.trim() || "15 de junho",
      daysRemaining: days,
      percentageRemaining: percentage,
    };

    setBorrowedBooks((prev) => [newBook, ...prev]);
    setShowAddBookModal(false);
    setNewBookTitle("");
    setNewBookCode("");
    setNewBookDueDate("15 de junho");
    setNewBookDaysRemaining(14);
    showToast(`Livro "${newBook.title}" adicionado aos seus empréstimos!`);
  };

  // Ação de Devolver Livro (dar baixa)
  const handleReturnBook = (bookId: string) => {
    const book = borrowedBooks.find((b) => b.id === bookId);
    setBorrowedBooks((prev) => prev.filter((b) => b.id !== bookId));
    showToast(`Livro "${book?.title || "Exemplar"}" devolvido à biblioteca!`);
  };

  // Abrir Modal de Edição/Criação de Multa
  const handleOpenEditFine = () => {
    if (hasLibraryFine) {
      setEditFineAmount(fineAmount.toFixed(2));
      setEditFineBookTitle(fineBookTitle);
      setEditFineDescription(fineDescription);
    } else {
      setEditFineAmount("12.50");
      setEditFineBookTitle("Cálculo Avançado");
      setEditFineDescription("3 dias de atraso na devolução");
    }
    setShowEditFineModal(true);
  };

  // Salvar Multa (Adicionar ou Editar)
  const handleSaveFine = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(editFineAmount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      showToast("Informe um valor válido maior que zero!");
      return;
    }

    setFineAmount(parsedAmount);
    setFineBookTitle(editFineBookTitle.trim() || "Exemplar da Biblioteca");
    setFineDescription(editFineDescription.trim() || "Atraso na devolução");
    setHasLibraryFine(true);
    setShowEditFineModal(false);
    showToast(`Multa da biblioteca atualizada para ${formatCurrency(parsedAmount)}!`);
  };

  // Remover/Zerar Multa
  const handleRemoveFine = () => {
    setHasLibraryFine(false);
    setShowEditFineModal(false);
    showToast("Multa removida! Situação acadêmica regularizada.");
  };

  // Ação de Quitação da Multa (Informativo - registro de saída bancária)
  const handlePayFine = () => {
    const acc = studentBankAccounts.find((a) => a.id === selectedFineAccount) || studentBankAccounts[0];
    setHasLibraryFine(false);
    setShowFinePaymentModal(false);
    setLastPaidFineInfo(`${formatCurrency(fineAmount)} (${acc.bankName} • ${acc.type})`);
    showToast(`Pagamento da multa de ${formatCurrency(fineAmount)} registrado via ${acc.bankName}! Situação regularizada.`);
  };

  // Ação de Informar Refeição Utilizada (R$ 3,00)
  const handleUseMeal = () => {
    if (ruBalance < 3) {
      showToast("Saldo insuficiente para refeição completa (R$ 3,00)! Faça uma recarga.");
      setShowRuRechargeModal(true);
      return;
    }

    const newBalance = ruBalance - 3;
    setRuBalance(newBalance);
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setLastUsageText(`Hoje, ${hours}h${minutes} • 1 Refeição (R$ 3,00)`);

    const remainingMeals = Math.floor(newBalance / 3);
    const remainingPies = Math.floor(newBalance / 1);

    if (newBalance === 0) {
      showToast("Refeição registrada (-R$ 3,00). Seus créditos acabaram! Recarregue seu saldo.");
    } else if (remainingMeals <= 2) {
      showToast(`Refeição registrada (-R$ 3,00)! Atenção: restam ${formatCurrency(newBalance)} (${remainingMeals} ref. ou ${remainingPies} tortas).`);
    } else {
      showToast(`Refeição registrada (-R$ 3,00)! Saldo: ${formatCurrency(newBalance)} (${remainingMeals} ref. ou ${remainingPies} tortas).`);
    }
  };

  // Ação de Informar Torta Utilizada (R$ 1,00)
  const handleBuyPie = () => {
    if (ruBalance < 1) {
      showToast("Saldo insuficiente para comprar torta (R$ 1,00)! Faça uma recarga.");
      setShowRuRechargeModal(true);
      return;
    }

    const newBalance = ruBalance - 1;
    setRuBalance(newBalance);
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setLastUsageText(`Hoje, ${hours}h${minutes} • 1 Torta do RU (R$ 1,00)`);

    const remainingMeals = Math.floor(newBalance / 3);
    const remainingPies = Math.floor(newBalance / 1);

    if (newBalance === 0) {
      showToast("Torta do RU registrada (-R$ 1,00)! Seus créditos acabaram! Recarregue seu saldo.");
    } else {
      showToast(`Torta do RU registrada (-R$ 1,00)! 🥧 Saldo: ${formatCurrency(newBalance)} (${remainingMeals} ref. ou ${remainingPies} tortas).`);
    }
  };

  // Ação de Recarga do RU (Informativo - registro de saída bancária)
  const handleRechargeRu = (amountReais?: number) => {
    const amount = amountReais ?? selectedRuPackage;
    const acc = studentBankAccounts.find((a) => a.id === selectedRuAccount) || studentBankAccounts[0];
    setRuBalance((prev) => prev + amount);
    setShowRuRechargeModal(false);
    const mealsEquivalent = Math.floor(amount / 3);
    const piesEquivalent = Math.floor(amount / 1);
    showToast(`Recarga de ${formatCurrency(amount)} confirmada via ${acc.bankName}! (+${mealsEquivalent} refeições ou +${piesEquivalent} tortas).`);
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-7 pb-12 select-none relative">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1A162B] border border-[#FFD166]/30 text-white px-4 py-3 rounded-xl shadow-2xl shadow-amber-950/60 transition-all animate-bounce">
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
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 block mb-1">
            TERÇA-FEIRA, 19 DE NOVEMBRO
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Hub Acadêmico
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Tudo o que você precisa para organizar sua rotina no campus.
          </p>
        </div>

        {/* Controles da Direita */}
        <div className="flex items-center justify-between md:justify-end gap-3 relative w-full md:w-auto">
          {/* Seletor de Semestre */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
              className="bg-[#131024] border border-white/10 hover:border-white/20 text-zinc-200 px-3.5 sm:px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <Calendar size={15} className="text-zinc-400" />
              <span>{selectedSemester}</span>
              <ChevronDown
                size={14}
                className={`text-zinc-400 transition-transform duration-200 ${isSemesterDropdownOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isSemesterDropdownOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-12 w-48 bg-[#131024] border border-white/10 rounded-xl p-1.5 shadow-2xl z-40">
                {[
                  "1º semestre de 2025",
                  "2º semestre de 2024",
                  "1º semestre de 2024",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSemester(s);
                      setIsSemesterDropdownOpen(false);
                      showToast(`Exibindo dados do ${s}.`);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${selectedSemester === s
                        ? "bg-[#D6B2FF] text-[#0B0914] font-semibold"
                        : "text-zinc-300 hover:bg-white/5"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grupo de Ações do Usuário (Alinhado à Direita no Mobile) */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto md:ml-0">
            {/* Botão de Notificações */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadCount(0);
                }}
                aria-label="Notificações Acadêmicas"
                className="w-11 h-11 rounded-xl bg-[#131024] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 transition-all cursor-pointer relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166] absolute top-2.5 right-2.5 ring-2 ring-[#131024]" />
                )}
              </button>

              {/* Popover de Notificações */}
              {showNotifications && (
                <>
                  {/* Backdrop escuro transparente no mobile para fechar ao clicar fora */}
                  <div
                    className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-[2px]"
                    onClick={() => setShowNotifications(false)}
                  />
                  <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-36 md:top-13 md:w-80 bg-[#131024] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                        Alertas do Campus
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowNotifications(false)}
                        className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {campusNotifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-2.5 rounded-xl bg-[#19152B] hover:bg-[#1f1a36] transition-colors border border-white/5 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#FFD166]">{n.title}</span>
                            <span className="text-[10px] text-zinc-500">{n.time}</span>
                          </div>
                          <p className="text-[11px] text-zinc-300 leading-snug">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Avatar de Perfil Estudantil com Iniciais */}
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
              <span>AM</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. LINHA SUPERIOR: BOLSA DE PERMANÊNCIA + RU + COTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card Destaque: Dias para a Bolsa (Contagem Regressiva) */}
        <div className="lg:col-span-6 rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-row items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
          {/* Efeito Glow Roxo no Fundo */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#9D4EDD]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Lado Esquerdo: Textos e Métricas */}
          <div className="space-y-2 sm:space-y-3 z-10 min-w-0 flex-1">
            <span className="bg-[#10E59B]/10 border border-[#10E59B]/25 text-[#4DE8B3] text-[10px] font-bold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider inline-block">
              Próximo Pagamento
            </span>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Dias para a Bolsa</h2>
              <p className="text-xs text-zinc-400 mt-1 sm:mt-1.5 max-w-xs leading-relaxed line-clamp-2 sm:line-clamp-none">
                Sua bolsa de permanência está programada e será depositada automaticamente.
              </p>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 pt-1 sm:pt-2">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                  Previsão
                </span>
                <span className="text-xs font-semibold text-white mt-0.5 block">
                  24 de maio
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                  Valor previsto
                </span>
                <span className="text-xs font-bold text-white mt-0.5 block">
                  R$ 850,00
                </span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Número Gigante 04 e Status (ao lado do texto) */}
          <div
            onClick={() => setShowScholarshipModal(true)}
            className="flex flex-col items-center justify-center shrink-0 z-10 cursor-pointer group text-center"
            title="Clique para ver extrato da bolsa"
          >
            <div className="relative flex flex-col items-center">
              <span className="text-5xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-[#D6B2FF] drop-shadow-[0_0_25px_rgba(157,78,221,0.4)] leading-none">
                04
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-widest text-[#D6B2FF] uppercase mt-1">
                Dias
              </span>
              <span className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 whitespace-nowrap">Falta pouco!</span>

              {/* Dots Indicadores de Ciclo */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#2A2345]" />
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#2A2345]" />
              </div>
            </div>
          </div>
        </div>

        {/* Card: Créditos do Restaurante Universitário (RU) */}
        <div className="lg:col-span-6 rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between hover:border-white/10 transition-all">
          {/* Topo do Card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#10E59B]/10 border border-[#10E59B]/20 text-[#4DE8B3] flex items-center justify-center">
                <UtensilsCrossed size={17} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Créditos do RU
                </h3>
                <span className="text-[11px] text-zinc-400">Restaurante Universitário</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRuRechargeModal(true)}
              className="text-xs text-[#4DE8B3] hover:text-[#10E59B] transition-colors cursor-pointer flex items-center gap-1 min-h-[44px] px-2 -mr-2"
            >
              <span>Recarregar</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Métrica Central e Ações de Consumo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  {formatCurrency(ruBalance)}
                </span>
                <span className="text-xs text-zinc-400">em saldo</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-medium text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  {Math.floor(ruBalance / 3)} refeições
                </span>
                <span className="text-zinc-600 text-[11px]">•</span>
                <span className="text-[11px] font-medium text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {Math.floor(ruBalance / 1)} tortas
                </span>
              </div>
            </div>

            {/* Botões de Ação Rápida */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUseMeal}
                disabled={ruBalance < 3}
                className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-xl bg-[#4DE8B3]/10 hover:bg-[#4DE8B3]/20 border border-[#4DE8B3]/25 text-xs font-semibold text-[#4DE8B3] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                title="Informar uso de 1 refeição completa (R$ 3,00)"
              >
                <UtensilsCrossed size={14} />
                <span className="whitespace-nowrap">1 Refeição <span className="opacity-75 text-[11px] font-normal">(R$ 3)</span></span>
              </button>

              <button
                type="button"
                onClick={handleBuyPie}
                disabled={ruBalance < 1}
                className="flex-1 sm:flex-initial min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FFD166]/10 hover:bg-[#FFD166]/20 border border-[#FFD166]/25 text-xs font-semibold text-[#FFD166] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                title="Informar compra de 1 torta do RU (R$ 1,00)"
              >
                <Cake size={14} />
                <span className="whitespace-nowrap">1 Torta <span className="opacity-75 text-[11px] font-normal">(R$ 1)</span></span>
              </button>
            </div>
          </div>

          {/* Rodapé Limpo */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
            <span className="truncate">Último uso: {lastUsageText}</span>
            <span className="text-zinc-400">Refeição R$ 3,00 • Torta R$ 1,00</span>
          </div>
        </div>
      </div>

      {/* 3. LINHA INFERIOR: STATUS DA BIBLIOTECA & MULTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card: Status da Biblioteca (Empréstimos Ativos) */}
        <div className="lg:col-span-8 rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between">
          <div>
            {/* Topo do Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block mb-1">
                  Empréstimos Ativos
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Status da Biblioteca
                </h2>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                <span className="bg-[#19152B] border border-white/10 text-xs text-zinc-300 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <BookOpen size={14} className="text-[#D6B2FF]" />
                  <span>{borrowedBooks.length} {borrowedBooks.length === 1 ? "livro" : "livros"} com você</span>
                </span>

                <button
                  type="button"
                  onClick={() => setShowAddBookModal(true)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#9D4EDD]/20 hover:bg-[#9D4EDD]/30 border border-[#9D4EDD]/40 text-xs font-semibold text-[#D6B2FF] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                  title="Cadastrar novo livro emprestado na biblioteca"
                >
                  <Plus size={15} />
                  <span>Adicionar Livro</span>
                </button>
              </div>
            </div>

            {/* Cabeçalho da Lista / Tabela (Visível apenas a partir de telas médias/grandes) */}
            <div className="hidden sm:grid grid-cols-12 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-2 border-b border-white/5 px-2.5">
              <span className="col-span-5">Livro</span>
              <span className="col-span-3 text-left">Data de Devolução</span>
              <span className="col-span-4 text-right">Prazo Restante</span>
            </div>

            {/* Lista de Livros ou Estado Vazio */}
            {borrowedBooks.length === 0 ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-white/5 text-zinc-500 flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">Nenhum empréstimo ativo</p>
                  <p className="text-xs text-zinc-400">Você não possui livros da biblioteca retirados no momento.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(true)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#9D4EDD]/20 hover:bg-[#9D4EDD]/30 border border-[#9D4EDD]/40 text-xs font-semibold text-[#D6B2FF] inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Adicionar Livro Emprestado</span>
                </button>
              </div>
            ) : (
              <div className="pt-3">
                {/* 1. VERSÃO MOBILE: Cards individuais bem estruturados e alinhados */}
                <div className="space-y-3 sm:hidden">
                  {borrowedBooks.map((book) => {
                    const isUrgent = book.daysRemaining <= 3;

                    return (
                      <div
                        key={book.id}
                        className="p-3.5 rounded-xl bg-[#19152B]/70 border border-white/5 space-y-3"
                      >
                        {/* Linha 1: Título, Código e Badge de Devolução */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-[#9D4EDD]/15 border border-[#9D4EDD]/25 text-[#D6B2FF] flex items-center justify-center shrink-0">
                              <BookOpen size={17} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-semibold text-white truncate">
                                {book.title}
                              </h4>
                              <span className="text-[10px] text-zinc-500 font-mono block">
                                {book.code}
                              </span>
                            </div>
                          </div>

                          <div className="bg-[#131024] border border-white/5 px-2.5 py-1 rounded-lg shrink-0 text-right">
                            <span className="text-[9px] text-zinc-500 block uppercase font-semibold">Devolução</span>
                            <span className="text-xs text-zinc-200 font-medium block">
                              {book.dueDate}
                            </span>
                          </div>
                        </div>

                        {/* Linha 2: Prazo restante e Barra de Progresso */}
                        <div className="space-y-1.5 pt-1 border-t border-white/5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span
                              className={`font-semibold flex items-center gap-1 ${
                                isUrgent ? "text-[#FFB703]" : "text-[#4DE8B3]"
                              }`}
                            >
                              <Clock size={12} />
                              <span>{book.daysRemaining} {book.daysRemaining === 1 ? "dia restante" : "dias restantes"}</span>
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {book.percentageRemaining}% do prazo
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-[#131024] rounded-full overflow-hidden border border-white/5">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isUrgent ? "bg-[#FFB703]" : "bg-[#4DE8B3]"
                              }`}
                              style={{ width: `${book.percentageRemaining}%` }}
                            />
                          </div>
                        </div>

                        {/* Linha 3: Botões de Ação Ergonômicos */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleRenewBook(book.id)}
                            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#9D4EDD]/15 hover:bg-[#9D4EDD]/25 border border-[#9D4EDD]/30 text-xs font-semibold text-[#D6B2FF] flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                            title="Renovar empréstimo por mais 7 dias"
                          >
                            <RefreshCw size={12} />
                            <span>Renovar (+7d)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReturnBook(book.id)}
                            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                            title="Informar devolução do livro na biblioteca"
                          >
                            <Check size={13} />
                            <span>Devolver</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 2. VERSÃO DESKTOP: Tabela em 12 colunas limpa e espaçosa */}
                <div className="hidden sm:block space-y-3">
                  {borrowedBooks.map((book) => {
                    const isUrgent = book.daysRemaining <= 3;

                    return (
                      <div
                        key={book.id}
                        className="grid grid-cols-12 items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5"
                      >
                        {/* Coluna 1: Livro & Código */}
                        <div className="col-span-5 flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#9D4EDD]/15 border border-[#9D4EDD]/25 text-[#D6B2FF] flex items-center justify-center shrink-0">
                            <BookOpen size={18} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                              {book.title}
                            </h4>
                            <span className="text-[10px] text-zinc-500 block truncate font-mono">
                              {book.code}
                            </span>
                          </div>
                        </div>

                        {/* Coluna 2: Data de Devolução */}
                        <div className="col-span-3">
                          <span className="text-xs text-zinc-300 font-medium truncate block">
                            {book.dueDate}
                          </span>
                        </div>

                        {/* Coluna 3: Barra de Prazo e Ações */}
                        <div className="col-span-4 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span
                              className={`font-semibold ${
                                isUrgent ? "text-[#FFB703]" : "text-[#4DE8B3]"
                              }`}
                            >
                              {book.daysRemaining} {book.daysRemaining === 1 ? "dia restante" : "dias restantes"}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {book.percentageRemaining}%
                            </span>
                          </div>

                          {/* Barra de Progresso */}
                          <div className="w-full h-1.5 bg-[#19152B] rounded-full overflow-hidden border border-white/5">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isUrgent ? "bg-[#FFB703]" : "bg-[#4DE8B3]"
                              }`}
                              style={{ width: `${book.percentageRemaining}%` }}
                            />
                          </div>

                          {/* Ações de Renovar e Devolver */}
                          <div className="flex items-center justify-end gap-2.5 pt-0.5">
                            <button
                              type="button"
                              onClick={() => handleRenewBook(book.id)}
                              className="text-[10px] font-semibold text-[#D6B2FF] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                              title="Renovar empréstimo por mais 7 dias"
                            >
                              <RefreshCw size={10} />
                              <span>Renovar (+7d)</span>
                            </button>
                            <span className="text-zinc-600 text-[10px]">•</span>
                            <button
                              type="button"
                              onClick={() => handleReturnBook(book.id)}
                              className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                              title="Informar devolução do livro na biblioteca"
                            >
                              <Check size={11} />
                              <span>Devolver</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card: Multa da Biblioteca (Alerta de Pendência Financeira) */}
        <div
          className={`lg:col-span-4 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col justify-between transition-all ${hasLibraryFine
              ? "bg-[#131024] border border-orange-500/25 shadow-orange-950/20"
              : "bg-[#131024] border border-emerald-500/25 shadow-emerald-950/10"
            }`}
        >
          {hasLibraryFine ? (
            /* ESTADO 1: COM PENDÊNCIA */
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFB703]/10 border border-[#FFB703]/25 text-[#FFB703] flex items-center justify-center">
                    <AlertTriangle size={20} />
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenEditFine}
                    className="min-h-[36px] px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-zinc-300 hover:text-[#FFB703] flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Editar valor ou detalhes da multa"
                  >
                    <Pencil size={12} />
                    <span>Editar Multa</span>
                  </button>
                </div>

                <span className="bg-[#FFB703]/10 border border-[#FFB703]/20 text-[#FFB703] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  Pendência Encontrada
                </span>

                <h3 className="text-xl font-bold text-white tracking-tight mt-2">
                  Multa da Biblioteca
                </h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Há uma multa em aberto referente à devolução atrasada de um exemplar.
                </p>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">
                  Valor total devido
                </span>
                <span className="text-3xl font-extrabold text-white mt-0.5 block tracking-tight">
                  {formatCurrency(fineAmount)}
                </span>
              </div>

              {/* Caixa de Detalhes do Exemplar em Atraso */}
              <div className="p-3 rounded-xl bg-[#19152B] border border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 text-zinc-400 flex items-center justify-center shrink-0">
                  <BookOpen size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{fineBookTitle}</h4>
                  <span className="text-[10px] text-zinc-400 block truncate">
                    {fineDescription}
                  </span>
                </div>
              </div>

              {/* Botão de Ação */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowFinePaymentModal(true)}
                  className="w-full min-h-[44px] bg-gradient-to-r from-[#FF9F43] to-[#FF6B6B] hover:from-[#ff912a] hover:to-[#ff5252] text-[#0B0914] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-98 cursor-pointer"
                >
                  <span>Pagar Agora</span>
                  <ChevronRight size={15} />
                </button>
                <span className="text-[10px] text-zinc-500 text-center block mt-2">
                  Pagamento seguro pelo portal da universidade
                </span>
              </div>
            </div>
          ) : (
            /* ESTADO 2: SITUAÇÃO REGULARIZADA */
            <div className="space-y-4 text-center py-4 flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-[#10E59B]/10 border border-[#10E59B]/30 text-[#4DE8B3] flex items-center justify-center mb-1">
                <CheckCircle2 size={32} />
              </div>

              <span className="bg-[#10E59B]/10 border border-[#10E59B]/25 text-[#4DE8B3] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Situação Regular
              </span>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Tudo em Dia!
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
                  Você não possui nenhuma multa pendente na biblioteca universitária.
                </p>
              </div>

              <div className="w-full p-3 rounded-xl bg-[#19152B] border border-white/5 text-left text-xs space-y-1">
                <span className="text-[11px] text-zinc-400 block">Último pagamento registrado:</span>
                <span className="font-semibold text-white block">
                  {lastPaidFineInfo}
                </span>
              </div>

              {/* Botão para Adicionar / Registrar Nova Multa */}
              <div className="w-full pt-1">
                <button
                  type="button"
                  onClick={handleOpenEditFine}
                  className="w-full min-h-[44px] bg-[#19152B] hover:bg-[#201b38] border border-orange-500/30 text-orange-400 hover:text-orange-300 font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Cadastrar ou simular nova multa na biblioteca"
                >
                  <Plus size={15} />
                  <span>Adicionar Multa</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. MODAL: REGISTRAR PAGAMENTO DE MULTA (INFORMATIVO) */}
      {showFinePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            {/* Topo do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <Landmark size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Registrar Pagamento de Multa
                  </h3>
                  <p className="text-xs text-zinc-400">Controle financeiro acadêmico</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFinePaymentModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Banner Informativo */}
            <div className="p-3 rounded-xl bg-[#19152B] border border-white/5 space-y-1 text-left">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                Registro Informativo
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Informe de qual conta saiu o valor pago na biblioteca para manter seu extrato e fluxo financeiro sincronizados no MANNS.
              </p>
            </div>

            {/* Resumo do Valor */}
            <div className="bg-[#19152B] border border-white/5 rounded-xl p-4 text-center space-y-1">
              <span className="text-xs text-zinc-400">Valor Pago da Multa</span>
              <span className="text-3xl font-extrabold text-white block">
                {formatCurrency(fineAmount)}
              </span>
              <span className="text-[11px] text-zinc-400 block truncate">
                Exemplar: {fineBookTitle} ({fineDescription})
              </span>
            </div>

            {/* Seleção de Conta Bancária */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-300 font-semibold block">
                De qual conta saiu o pagamento?
              </span>
              <div className="space-y-2">
                {studentBankAccounts.map((acc) => {
                  const isSelected = selectedFineAccount === acc.id;

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedFineAccount(acc.id)}
                      className={`w-full min-h-[48px] p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1E1938] border-orange-400/60 shadow-[0_0_15px_rgba(255,159,67,0.12)]"
                          : "bg-[#19152B] border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: acc.badgeColor }}
                        >
                          {acc.badge}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold text-white">
                              {acc.bankName}
                            </h4>
                            <span className="text-[10px] text-zinc-500">
                              •••• {acc.lastDigits}
                            </span>
                          </div>
                          <span className="text-[11px] text-zinc-400 block">
                            {acc.type}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-white block">
                          {formatCurrency(acc.balance)}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          saldo disponível
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botão de Confirmação */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handlePayFine}
                className="w-full min-h-[44px] bg-gradient-to-r from-[#FF9F43] to-[#FF6B6B] hover:from-[#ff912a] hover:to-[#ff5252] text-[#0B0914] font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} />
                <span>Confirmar Pagamento (-{formatCurrency(fineAmount)})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: RECARGA DE CRÉDITOS DO RU */}
      {showRuRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#10E59B]/10 text-[#4DE8B3] flex items-center justify-center">
                  <UtensilsCrossed size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Recarga da Carteirinha do RU
                  </h3>
                  <p className="text-xs text-zinc-400">Restaurante Universitário</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRuRechargeModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Saldo Atual e Valores das Opções */}
            <div className="bg-[#19152B] border border-white/5 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 block">Saldo na Carteirinha</span>
                  <span className="text-2xl font-bold text-white">{formatCurrency(ruBalance)}</span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-[11px] text-emerald-400 font-medium block">
                    {Math.floor(ruBalance / 3)} refeições (R$ 3)
                  </span>
                  <span className="text-[11px] text-amber-300 font-medium block">
                    {Math.floor(ruBalance / 1)} tortas (R$ 1)
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <UtensilsCrossed size={13} className="text-[#4DE8B3]" /> Refeição: <strong className="text-white">R$ 3,00</strong>
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Cake size={13} className="text-[#FFD166]" /> Torta do RU: <strong className="text-white">R$ 1,00</strong>
                </span>
              </div>
            </div>

            {/* 1. SELEÇÃO DA CONTA BANCÁRIA DE ORIGEM */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-semibold block">
                De qual conta sairá o dinheiro?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {studentBankAccounts.map((acc) => {
                  const isSelected = selectedRuAccount === acc.id;

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedRuAccount(acc.id)}
                      className={`min-h-[52px] p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? "bg-[#1E1938] border-[#10E59B] shadow-[0_0_12px_rgba(16,229,155,0.15)]"
                          : "bg-[#19152B] border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: acc.badgeColor }}
                        />
                        <span className="text-xs font-bold text-white truncate">
                          {acc.bankName}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-400 truncate">
                        {formatCurrency(acc.balance)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SELEÇÃO DO PACOTE DE RECARGA */}
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-semibold block">
                Escolha o pacote de recarga
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { price: 10.0, label: "R$ 10,00", desc: "3 refeições + 1 torta (ou 10 tortas)" },
                  { price: 15.0, label: "R$ 15,00", desc: "5 refeições (ou 15 tortas)" },
                  { price: 30.0, label: "R$ 30,00", desc: "10 refeições (ou 30 tortas)" },
                  { price: 60.0, label: "R$ 60,00", desc: "20 refeições (ou 60 tortas)" },
                ].map((pkg) => {
                  const isSelected = selectedRuPackage === pkg.price;

                  return (
                    <button
                      key={pkg.price}
                      type="button"
                      onClick={() => setSelectedRuPackage(pkg.price)}
                      className={`min-h-[52px] p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#1E1938] border-[#4DE8B3] shadow-[0_0_12px_rgba(77,232,179,0.15)]"
                          : "bg-[#19152B] border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-bold ${
                            isSelected ? "text-[#4DE8B3]" : "text-white"
                          }`}
                        >
                          {pkg.label}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#4DE8B3] shadow-[0_0_6px_#4DE8B3]" />
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 block line-clamp-1 mt-0.5">
                        {pkg.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botão de Confirmação da Recarga */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowRuRechargeModal(false)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => handleRechargeRu(selectedRuPackage)}
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#10E59B] to-[#4DE8B3] hover:opacity-95 text-[#0B0914] font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} />
                <span>
                  Confirmar Recarga de {formatCurrency(selectedRuPackage)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: DETALHES DA BOLSA DE PERMANÊNCIA */}
      {showScholarshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#9D4EDD]/15 text-[#D6B2FF] flex items-center justify-center">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Bolsa de Permanência — 2025
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Cronograma de repasses e histórico de depósitos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScholarshipModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { month: "Março de 2025", date: "24/03", amount: 850, status: "Pago" },
                { month: "Abril de 2025", date: "24/04", amount: 850, status: "Pago" },
                { month: "Maio de 2025", date: "24/05", amount: 850, status: "Programado (em 4 dias)" },
                { month: "Junho de 2025", date: "24/06", amount: 850, status: "Previsto" },
              ].map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#19152B] border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <h4 className="font-semibold text-white">{p.month}</h4>
                    <span className="text-[11px] text-zinc-400">Data: {p.date}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-white block">
                      {formatCurrency(p.amount)}
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${p.status.includes("Pago")
                          ? "text-[#4DE8B3]"
                          : p.status.includes("Programado")
                            ? "text-[#FFD166]"
                            : "text-zinc-500"
                        }`}
                    >
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowScholarshipModal(false)}
                className="px-4 py-2 rounded-xl bg-[#D6B2FF] text-[#0B0914] font-semibold text-xs hover:bg-[#c79efc] transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: ADICIONAR LIVRO EMPRESTADO */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#9D4EDD]/15 text-[#D6B2FF] flex items-center justify-center">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Adicionar Livro Emprestado
                  </h3>
                  <p className="text-xs text-zinc-400">Biblioteca Universitária</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBookModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Título da Obra <span className="text-[#FF85A1]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  placeholder="Ex: Inteligência Artificial: Uma Abordagem Moderna"
                  className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Código do Exemplar
                  </label>
                  <input
                    type="text"
                    value={newBookCode}
                    onChange={(e) => setNewBookCode(e.target.value)}
                    placeholder="Ex: BCC - 008912"
                    className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Data de Devolução
                  </label>
                  <input
                    type="text"
                    value={newBookDueDate}
                    onChange={(e) => setNewBookDueDate(e.target.value)}
                    placeholder="Ex: 15 de junho"
                    className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#D6B2FF]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-300">
                    Prazo Restante (dias)
                  </label>
                  <span className="text-xs font-semibold text-[#D6B2FF]">
                    {newBookDaysRemaining} {newBookDaysRemaining === 1 ? "dia" : "dias"}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={newBookDaysRemaining}
                  onChange={(e) => setNewBookDaysRemaining(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full min-h-[44px] bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D6B2FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="min-h-[44px] px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#9D4EDD] to-[#D6B2FF] hover:opacity-95 text-[#0B0914] font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Adicionar Livro</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: ADICIONAR OU EDITAR MULTA */}
      {showEditFineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {hasLibraryFine ? "Editar Multa da Biblioteca" : "Adicionar Nova Multa"}
                  </h3>
                  <p className="text-xs text-zinc-400">Gestão de pendências da biblioteca</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditFineModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveFine} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Valor da Multa (R$) <span className="text-[#FF85A1]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-semibold">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.50"
                    min="0.50"
                    required
                    value={editFineAmount}
                    onChange={(e) => setEditFineAmount(e.target.value)}
                    placeholder="18.50"
                    className="w-full min-h-[44px] pl-10 pr-3.5 py-2 bg-[#19152B] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Exemplar / Livro de Referência
                </label>
                <input
                  type="text"
                  value={editFineBookTitle}
                  onChange={(e) => setEditFineBookTitle(e.target.value)}
                  placeholder="Ex: Física para Cientistas"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-[#19152B] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Motivo / Dias de Atraso
                </label>
                <input
                  type="text"
                  value={editFineDescription}
                  onChange={(e) => setEditFineDescription(e.target.value)}
                  placeholder="Ex: 5 dias de atraso • devolvido em 14/05"
                  className="w-full min-h-[44px] px-3.5 py-2 bg-[#19152B] border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-orange-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                {hasLibraryFine ? (
                  <button
                    type="button"
                    onClick={handleRemoveFine}
                    className="min-h-[44px] px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Remover ou regularizar multa"
                  >
                    <Trash2 size={14} />
                    <span>Zerar Multa</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditFineModal(false)}
                    className="min-h-[44px] px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF9F43] to-[#FF6B6B] hover:opacity-95 text-[#0B0914] font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check size={16} />
                    <span>{hasLibraryFine ? "Salvar Alterações" : "Adicionar Multa"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}