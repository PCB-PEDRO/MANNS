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
  const [ruMeals, setRuMeals] = useState(12);
  const [lastMealTime, setLastMealTime] = useState("Hoje, 12h48");

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

  // 6. Modais Interativos
  const [showFinePaymentModal, setShowFinePaymentModal] = useState(false);
  const [showRuRechargeModal, setShowRuRechargeModal] = useState(false);
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "saldo">("pix");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Ação de Quitação da Multa
  const handlePayFine = () => {
    setHasLibraryFine(false);
    setShowFinePaymentModal(false);
    showToast("Multa quitada com sucesso! Situação acadêmica regularizada.");
  };

  // Ação de Informar Refeição Utilizada
  const handleUseMeal = () => {
    if (ruMeals <= 0) {
      showToast("Você não possui créditos do RU disponíveis! Faça uma recarga.");
      setShowRuRechargeModal(true);
      return;
    }

    const newBalance = ruMeals - 1;
    setRuMeals(newBalance);
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    setLastMealTime(`Hoje, ${hours}h${minutes}`);

    if (newBalance === 0) {
      showToast("Refeição registrada! Seus créditos acabaram. Recarregue seu saldo.");
    } else if (newBalance <= 2) {
      showToast(`Refeição registrada! Atenção: restam apenas ${newBalance} refeições.`);
    } else {
      showToast(`Refeição registrada com sucesso! Saldo restante: ${newBalance} refeições.`);
    }
  };

  // Ação de Recarga do RU
  const handleRechargeRu = (amountMeals: number) => {
    setRuMeals((prev) => prev + amountMeals);
    setShowRuRechargeModal(false);
    showToast(`Recarga confirmada! +${amountMeals} refeições adicionadas ao seu saldo do RU.`);
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
          <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1">
            Vida Universitária
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Hub Acadêmico
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Tudo o que você precisa para organizar sua rotina no campus.
          </p>
        </div>

        {/* Controles da Direita */}
        <div className="flex items-center gap-3 relative">
          {/* Seletor de Semestre */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
              className="bg-[#131024] border border-white/10 hover:border-white/20 text-zinc-200 px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <Calendar size={15} className="text-zinc-400" />
              <span>{selectedSemester}</span>
              <ChevronDown
                size={14}
                className={`text-zinc-400 transition-transform duration-200 ${
                  isSemesterDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isSemesterDropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-[#131024] border border-white/10 rounded-xl p-1.5 shadow-2xl z-40">
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
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                      selectedSemester === s
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
              <div className="absolute right-0 top-13 w-80 bg-[#131024] border border-white/10 rounded-2xl p-4 shadow-2xl z-40 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Alertas do Campus
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-zinc-500 hover:text-white"
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
            )}
          </div>

          {/* Avatar com Iniciais */}
          <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-bold text-xs flex items-center justify-center shadow-sm">
            <span>AM</span>
          </div>
        </div>
      </header>

      {/* 2. LINHA SUPERIOR: BOLSA DE PERMANÊNCIA + RU + COTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card Destaque: Dias para a Bolsa (Contagem Regressiva) */}
        <div className="lg:col-span-6 rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
          {/* Efeito Glow Roxo no Fundo */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#9D4EDD]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Lado Esquerdo: Textos e Métricas */}
          <div className="space-y-3 z-10">
            <span className="bg-[#10E59B]/10 border border-[#10E59B]/25 text-[#4DE8B3] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Próximo Pagamento
            </span>

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Dias para a Bolsa</h2>
              <p className="text-xs text-zinc-400 mt-1.5 max-w-xs leading-relaxed">
                Sua bolsa de permanência está programada e será depositada automaticamente.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
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

          {/* Lado Direito: Número Gigante 04 e Status */}
          <div
            onClick={() => setShowScholarshipModal(true)}
            className="flex flex-col items-center justify-center sm:pr-4 z-10 cursor-pointer group"
            title="Clique para ver extrato da bolsa"
          >
            <div className="relative flex flex-col items-center">
              <span className="text-6xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-purple-100 to-[#D6B2FF] drop-shadow-[0_0_25px_rgba(157,78,221,0.4)]">
                04
              </span>
              <span className="text-[11px] font-extrabold tracking-widest text-[#D6B2FF] uppercase mt-0.5">
                Dias
              </span>
              <span className="text-xs text-zinc-400 mt-1">Falta pouco!</span>

              {/* Dots Indicadores de Ciclo */}
              <div className="flex items-center gap-1.5 mt-3">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
                <span className="w-2 h-2 rounded-full bg-[#2A2345]" />
                <span className="w-2 h-2 rounded-full bg-[#2A2345]" />
              </div>
            </div>
          </div>
        </div>

        {/* Card: Créditos do Restaurante Universitário (RU) */}
        <div className="lg:col-span-6 rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg flex flex-col justify-between hover:border-white/10 transition-all">
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
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Recarregar</span>
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Métrica Central e Ação de Informar Refeição */}
          <div className="flex items-center justify-between my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white tracking-tight">
                {ruMeals}
              </span>
              <span className="text-xs text-zinc-400">refeições</span>
            </div>

            <button
              type="button"
              onClick={handleUseMeal}
              disabled={ruMeals <= 0}
              className="px-3.5 py-2 rounded-xl bg-[#4DE8B3]/10 hover:bg-[#4DE8B3]/20 border border-[#4DE8B3]/25 text-xs font-semibold text-[#4DE8B3] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
              title="Informar que utilizou 1 refeição"
            >
              <UtensilsCrossed size={14} />
              <span>Utilizei 1 refeição</span>
            </button>
          </div>

          {/* Rodapé Limpo */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Último uso: {lastMealTime}</span>
            <span>R$ 3,00 / refeição</span>
          </div>
        </div>
      </div>

      {/* 3. LINHA INFERIOR: STATUS DA BIBLIOTECA & MULTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card: Status da Biblioteca (Empréstimos Ativos) */}
        <div className="lg:col-span-8 rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between">
          <div>
            {/* Topo do Card */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block mb-1">
                  Empréstimos Ativos
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Status da Biblioteca
                </h2>
              </div>

              <span className="bg-[#19152B] border border-white/10 text-xs text-zinc-300 px-3 py-1.5 rounded-xl flex items-center gap-2">
                <BookOpen size={14} className="text-[#D6B2FF]" />
                <span>{borrowedBooks.length} livros com você</span>
              </span>
            </div>

            {/* Cabeçalho da Lista / Tabela */}
            <div className="grid grid-cols-12 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider pb-2 border-b border-white/5 px-2">
              <span className="col-span-5">Livro</span>
              <span className="col-span-3 text-center sm:text-left">Data de Devolução</span>
              <span className="col-span-4 text-right sm:text-left">Prazo Restante</span>
            </div>

            {/* Lista de Livros */}
            <div className="space-y-4 pt-3">
              {borrowedBooks.map((book) => {
                const isUrgent = book.daysRemaining <= 3;

                return (
                  <div
                    key={book.id}
                    className="grid grid-cols-12 items-center gap-3 p-2 rounded-xl hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Coluna 1: Livro & Código */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#9D4EDD]/15 border border-[#9D4EDD]/25 text-[#D6B2FF] flex items-center justify-center shrink-0">
                        <BookOpen size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                          {book.title}
                        </h4>
                        <span className="text-[10px] text-zinc-500 block">{book.code}</span>
                      </div>
                    </div>

                    {/* Coluna 2: Data de Devolução */}
                    <div className="col-span-3">
                      <span className="text-xs text-zinc-300 font-medium">
                        {book.dueDate}
                      </span>
                    </div>

                    {/* Coluna 3: Barra de Prazo e Ação de Renovar */}
                    <div className="col-span-4 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`font-semibold ${
                            isUrgent ? "text-[#FFB703]" : "text-[#4DE8B3]"
                          }`}
                        >
                          {book.daysRemaining} dias restantes
                        </span>
                        <span className="text-[10px] text-zinc-500 hidden sm:inline">
                          {book.percentageRemaining}% do prazo disponível
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

                      <div className="flex justify-end pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleRenewBook(book.id)}
                          className="text-[10px] font-semibold text-[#D6B2FF] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw size={10} />
                          <span>Renovar (+7d)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card: Multa da Biblioteca (Alerta de Pendência Financeira) */}
        <div
          className={`lg:col-span-4 rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col justify-between transition-all ${
            hasLibraryFine
              ? "bg-[#131024] border border-orange-500/25 shadow-orange-950/20"
              : "bg-[#131024] border border-emerald-500/25 shadow-emerald-950/10"
          }`}
        >
          {hasLibraryFine ? (
            /* ESTADO 1: COM PENDÊNCIA */
            <div className="space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FFB703]/10 border border-[#FFB703]/25 text-[#FFB703] flex items-center justify-center mb-3">
                  <AlertTriangle size={20} />
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
                <div>
                  <h4 className="text-xs font-semibold text-white">Física para Cientistas</h4>
                  <span className="text-[10px] text-zinc-400 block">
                    5 dias de atraso • devolvido em 14/05
                  </span>
                </div>
              </div>

              {/* Botão de Ação */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowFinePaymentModal(true)}
                  className="w-full bg-gradient-to-r from-[#FF9F43] to-[#FF6B6B] hover:from-[#ff912a] hover:to-[#ff5252] text-[#0B0914] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-98 cursor-pointer"
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
                <span className="text-[11px] text-zinc-400 block">Último pagamento:</span>
                <span className="font-semibold text-white block">
                  R$ 18,50 (Quitação PIX confirmada)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. MODAL: PAGAR MULTA DA BIBLIOTECA */}
      {showFinePaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            {/* Topo do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Quitar Multa da Biblioteca
                  </h3>
                  <p className="text-xs text-zinc-400">Pagamento oficial da universidade</p>
                </div>
              </div>
              <button
                onClick={() => setShowFinePaymentModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Resumo do Valor */}
            <div className="bg-[#19152B] border border-white/5 rounded-xl p-4 text-center space-y-1">
              <span className="text-xs text-zinc-400">Valor da Taxa</span>
              <span className="text-3xl font-extrabold text-white block">
                {formatCurrency(fineAmount)}
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Referência: Exemplar #MAT-FSC-1405
              </span>
            </div>

            {/* Seleção do Método de Pagamento */}
            <div className="space-y-2">
              <span className="text-xs text-zinc-400 font-medium block">
                Forma de pagamento
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "pix"
                      ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                      : "bg-[#19152B] border-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <QrCode size={16} />
                  <span>PIX Instantâneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("saldo")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    paymentMethod === "saldo"
                      ? "bg-[#D6B2FF]/20 border-[#D6B2FF] text-[#D6B2FF]"
                      : "bg-[#19152B] border-white/5 text-zinc-400 hover:text-white"
                  }`}
                >
                  <CreditCard size={16} />
                  <span>Saldo da Conta</span>
                </button>
              </div>
            </div>

            {/* Simulação do QR Code PIX */}
            {paymentMethod === "pix" && (
              <div className="p-3 bg-[#19152B] border border-white/5 rounded-xl text-center space-y-2">
                <div className="w-24 h-24 mx-auto bg-white rounded-lg p-2 flex items-center justify-center shadow-md">
                  <QrCode size={80} className="text-black" />
                </div>
                <span className="text-[11px] text-zinc-400 block">
                  Escaneie ou copie o código PIX acima
                </span>
              </div>
            )}

            {/* Botão de Conclusão */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handlePayFine}
                className="w-full bg-[#10E59B] hover:bg-[#3cdca4] text-[#0B0914] font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} />
                <span>Confirmar Pagamento de {formatCurrency(fineAmount)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: RECARGA DE CRÉDITOS DO RU */}
      {showRuRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#10E59B]/10 text-[#4DE8B3] flex items-center justify-center">
                  <UtensilsCrossed size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Recarga de Refeições no RU
                  </h3>
                  <p className="text-xs text-zinc-400">Restaurante Universitário</p>
                </div>
              </div>
              <button
                onClick={() => setShowRuRechargeModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-[#19152B] border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block">Saldo Atual</span>
                <span className="text-xl font-bold text-white">{ruMeals} refeições</span>
              </div>
              <span className="text-xs font-semibold text-[#4DE8B3] bg-[#10E59B]/10 px-2.5 py-1 rounded-lg border border-[#10E59B]/20">
                R$ 3,00 por refeição
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-zinc-400 font-medium block">
                Escolha o pacote de recarga
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { meals: 5, price: 15.0 },
                  { meals: 10, price: 30.0 },
                  { meals: 20, price: 60.0 },
                ].map((pkg) => (
                  <button
                    key={pkg.meals}
                    type="button"
                    onClick={() => handleRechargeRu(pkg.meals)}
                    className="p-3 rounded-xl bg-[#19152B] hover:bg-[#201b38] border border-white/5 hover:border-[#10E59B]/40 transition-all text-center space-y-1 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white block">
                      +{pkg.meals} ref.
                    </span>
                    <span className="text-[11px] font-semibold text-[#4DE8B3] block">
                      {formatCurrency(pkg.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowRuRechargeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
              >
                Fechar
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
                      className={`text-[10px] font-semibold ${
                        p.status.includes("Pago")
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
    </div>
  );
}