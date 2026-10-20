"use client";

import { useState } from "react";
import {
  User,
  Settings2,
  Bell,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  X,
  Camera,
  GraduationCap,
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  KeyRound,
  Download,
  AlertTriangle,
  Plus,
  RefreshCw,
  LogOut,
  ChevronRight,
  Sliders,
  Check,
} from "lucide-react";

// Tipos e Interfaces
interface BankConnection {
  id: string;
  name: string;
  type: string;
  lastSync: string;
  status: "ativo" | "pendente";
  color: string;
  initials: string;
}

export default function ConfiguracoesPage() {
  // 1. Navegação de Abas
  const [activeTab, setActiveTab] = useState<
    "perfil" | "preferencias" | "notificacoes" | "conexoes" | "seguranca"
  >("perfil");

  // 2. Estados de Perfil
  const [userName, setUserName] = useState("Arthur Mendes");
  const [userEmail, setUserEmail] = useState("arthur.mendes@universidade.edu.br");
  const [userPhone, setUserPhone] = useState("(11) 98765-4321");
  const [university, setUniversity] = useState("Universidade Federal (UFC)");
  const [course, setCourse] = useState("Ciência da Computação");
  const [semester, setSemester] = useState("5º Semestre");
  const [studentId, setStudentId] = useState("2023018492");

  // 3. Estados de Preferências
  const [hideBalances, setHideBalances] = useState(false);
  const [currency, setCurrency] = useState("BRL");
  const [budgetCycleDay, setBudgetCycleDay] = useState("Dia 01");
  const [dateFormat, setDateFormat] = useState("DD/MM/AAAA");

  // 4. Estados de Notificações (Switches)
  const [notifyDueDates, setNotifyDueDates] = useState(true);
  const [notifyScholarship, setNotifyScholarship] = useState(true);
  const [notifyBudgetLimit, setNotifyBudgetLimit] = useState(true);
  const [notifyArticles, setNotifyArticles] = useState(false);
  const [notifyEmailDigest, setNotifyEmailDigest] = useState(true);
  const [notifySecuritySms, setNotifySecuritySms] = useState(true);

  // 5. Conexões Bancárias Open Finance
  const [bankConnections, setBankConnections] = useState<BankConnection[]>([
    {
      id: "b-1",
      name: "Nubank",
      type: "Conta corrente & Cartão",
      lastSync: "Há 12 minutos",
      status: "ativo",
      color: "#9D4EDD",
      initials: "Nu",
    },
    {
      id: "b-2",
      name: "Banco Inter",
      type: "Reserva estudantil & Investimentos",
      lastSync: "Há 45 minutos",
      status: "ativo",
      color: "#00E5FF",
      initials: "In",
    },
    {
      id: "b-3",
      name: "C6 Bank",
      type: "Cartão de Crédito Universitário",
      lastSync: "Hoje às 08:30",
      status: "ativo",
      color: "#B583FF",
      initials: "C6",
    },
    {
      id: "b-4",
      name: "Portal Acadêmico SIGA",
      type: "RU, Biblioteca & Bolsa de Permanência",
      lastSync: "Hoje às 12:00",
      status: "ativo",
      color: "#FFD166",
      initials: "UF",
    },
  ]);

  // 6. Modais e Toasts
  const [showConnectBankModal, setShowConnectBankModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Salvar Perfil
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Informações do perfil salvas com sucesso!");
  };

  // Alterar Senha
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Preencha todos os campos da senha.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("A nova senha e a confirmação não coincidem.");
      return;
    }
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Senha alterada com sucesso!");
  };

  // Conectar Novo Banco Simulado
  const handleAddBank = (bankName: string, initials: string, color: string) => {
    const newBank: BankConnection = {
      id: `b-${Date.now()}`,
      name: bankName,
      type: "Conta corrente & Open Finance",
      lastSync: "Agora mesmo",
      status: "ativo",
      color,
      initials,
    };
    setBankConnections((prev) => [...prev, newBank]);
    setShowConnectBankModal(false);
    showToast(`Instituição "${bankName}" conectada com sucesso via Open Finance!`);
  };

  // Exportar Dados LGPD em JSON
  const handleExportData = () => {
    const userData = {
      user: {
        name: userName,
        email: userEmail,
        university,
        course,
        studentId,
      },
      exportedAt: new Date().toISOString(),
      platform: "MANNS Gestão Financeira Universitária",
    };
    const blob = new Blob([JSON.stringify(userData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dados-manns-${studentId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Download dos seus dados (LGPD) concluído!");
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 pb-16 select-none relative">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1A162B] border border-[#D6B2FF]/40 text-white px-4 py-3 rounded-xl shadow-2xl shadow-purple-950/60 transition-all animate-bounce">
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
            Preferências & Conta
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Configurações
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Gerencie seu perfil, preferências da aplicação, notificações e segurança.
          </p>
        </div>

        {/* Indicador de Sincronização */}
        <div className="flex items-center gap-2 bg-[#131024] border border-white/5 px-3.5 py-2 rounded-xl">
          <CheckCircle2 size={15} className="text-[#4DE8B3]" />
          <span className="text-xs font-medium text-zinc-300">
            Todas as alterações salvas
          </span>
        </div>
      </header>

      {/* 2. NAVEGAÇÃO EM ABAS (ESTILO SEGMENTED CONTROL) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#131024] border border-white/5 rounded-2xl overflow-x-auto scrollbar-none">
        {[
          { id: "perfil", label: "Meu Perfil", icon: User },
          { id: "preferencias", label: "Preferências", icon: Sliders },
          { id: "notificacoes", label: "Notificações", icon: Bell },
          { id: "conexoes", label: "Bancos & Conexões", icon: Landmark },
          { id: "seguranca", label: "Segurança", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#1C1832] text-[#D6B2FF] border border-[#D6B2FF]/30 shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. CONTEÚDO DAS ABAS */}

      {/* ABA 1: MEU PERFIL */}
      {activeTab === "perfil" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card Resumo do Perfil */}
          <div className="rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9D4EDD] to-[#4DE8B3] flex items-center justify-center text-lg font-bold text-black shadow-lg">
                  AM
                </div>
                <button
                  type="button"
                  title="Alterar avatar"
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-[#19152B] border border-white/10 text-white flex items-center justify-center hover:bg-[#D6B2FF] hover:text-[#0B0914] transition-colors cursor-pointer"
                >
                  <Camera size={12} />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{userName}</h3>
                  <span className="bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Estudante Verificado
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{userEmail}</p>
                <span className="text-[11px] text-zinc-500 block mt-1">
                  Plano Universitário Gratuito • Membro desde fev/2024
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast("Foto de perfil atualizada.")}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-colors cursor-pointer border border-white/5 self-stretch sm:self-auto text-center"
            >
              Alterar foto
            </button>
          </div>

          {/* Formulário de Dados Pessoais & Acadêmicos */}
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg space-y-5"
          >
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Dados Pessoais & Acadêmicos
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Mantenha suas informações institucionais sincronizadas com o campus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  E-mail Institucional (.edu)
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Universidade / Instituição
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Curso de Graduação
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Semestre Atual
                </label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Matrícula / RA
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D6B2FF] hover:bg-[#c79efc] text-[#0B0914] font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABA 2: PREFERÊNCIAS DA APLICAÇÃO */}
      {activeTab === "preferencias" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg space-y-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Preferências de Visualização
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Personalize a experiência de uso diário do aplicativo
              </p>
            </div>

            {/* Privacidade de Saldos */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D6B2FF]/10 text-[#D6B2FF] flex items-center justify-center">
                  {hideBalances ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Modo Privacidade por Padrão
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Oculta os saldos numéricos na tela inicial ao abrir o app
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setHideBalances(!hideBalances);
                  showToast(
                    !hideBalances
                      ? "Modo privacidade ativado."
                      : "Modo privacidade desativado."
                  );
                }}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  hideBalances ? "bg-[#4DE8B3]" : "bg-white/10"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-[#0B0914] absolute top-1 transition-transform ${
                    hideBalances ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Moeda Padrão */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
              <div>
                <h4 className="text-xs font-semibold text-white">Moeda Principal</h4>
                <p className="text-[11px] text-zinc-400">
                  Moeda utilizada para consolidar seus relatórios e contas
                </p>
              </div>

              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  showToast(`Moeda definida para ${e.target.value}.`);
                }}
                className="bg-[#131024] border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="BRL">BRL (R$) — Real Brasileiro</option>
                <option value="USD">USD ($) — Dólar Americano</option>
                <option value="EUR">EUR (€) — Euro</option>
              </select>
            </div>

            {/* Ciclo do Mês Orçamentário */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Dia de Início do Orçamento Mensal
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Data em que seus limites e gastos por categoria são zerados
                </p>
              </div>

              <select
                value={budgetCycleDay}
                onChange={(e) => {
                  setBudgetCycleDay(e.target.value);
                  showToast(`Ciclo orçamentário definido para o ${e.target.value}.`);
                }}
                className="bg-[#131024] border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="Dia 01">Dia 01 (Padrão)</option>
                <option value="Dia 05">Dia 05 (5º dia útil)</option>
                <option value="Dia 10">Dia 10</option>
                <option value="Dia 24">Dia 24 (Pagamento da Bolsa)</option>
              </select>
            </div>

            {/* Formato de Data */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
              <div>
                <h4 className="text-xs font-semibold text-white">Formato de Data</h4>
                <p className="text-[11px] text-zinc-400">Exibição de datas no sistema</p>
              </div>

              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="bg-[#131024] border border-white/10 text-xs text-white rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="DD/MM/AAAA">DD/MM/AAAA (Brasileiro)</option>
                <option value="AAAA-MM-DD">AAAA-MM-DD (ISO)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: NOTIFICAÇÕES */}
      {activeTab === "notificacoes" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg space-y-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Notificações & Alertas
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Escolha quais alertas você deseja receber no aplicativo e por e-mail
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* Alerta de Vencimento */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Avisos de Vencimento de Contas
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Notificar 3 dias antes sobre faturas, aluguel e devolução de livros
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyDueDates(!notifyDueDates)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    notifyDueDates ? "bg-[#4DE8B3]" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-[#0B0914] absolute top-1 transition-transform ${
                      notifyDueDates ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Alerta da Bolsa de Permanência */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Bolsa de Permanência & Auxílios
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Avisar quando o depósito for confirmado pelo campus
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyScholarship(!notifyScholarship)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    notifyScholarship ? "bg-[#4DE8B3]" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-[#0B0914] absolute top-1 transition-transform ${
                      notifyScholarship ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Limite de Gastos (80%) */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Alerta de Limite do Orçamento
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Avisar quando uma categoria atingir 80% da meta estipulada
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyBudgetLimit(!notifyBudgetLimit)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    notifyBudgetLimit ? "bg-[#4DE8B3]" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-[#0B0914] absolute top-1 transition-transform ${
                      notifyBudgetLimit ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Resumo Semanal por E-mail */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Relatório Financeiro Semanal
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Receber aos domingos um resumo consolidado das entradas e saídas
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyEmailDigest(!notifyEmailDigest)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    notifyEmailDigest ? "bg-[#4DE8B3]" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-[#0B0914] absolute top-1 transition-transform ${
                      notifyEmailDigest ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Artigos e Estudos */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Novos Estudos & Educação Financeira
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Recomendações de artigos científicos e pesquisas sobre comportamento financeiro
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifyArticles(!notifyArticles)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    notifyArticles ? "bg-[#4DE8B3]" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full bg-[#0B0914] absolute top-1 transition-transform ${
                      notifyArticles ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 4: BANCOS & CONEXÕES (OPEN FINANCE) */}
      {activeTab === "conexoes" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Instituições Conectadas (Open Finance)
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Conexões criptografadas com autorização do Banco Central do Brasil
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowConnectBankModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#4DE8B3] hover:bg-[#3cdca4] text-[#0B0914] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md self-start sm:self-auto"
              >
                <Plus size={15} />
                <span>Conectar Nova Conta</span>
              </button>
            </div>

            {/* Grid de Instituições Conectadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {bankConnections.map((conn) => (
                <div
                  key={conn.id}
                  className="p-4 rounded-xl bg-[#19152B] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: `${conn.color}25`, border: `1px solid ${conn.color}40`, color: conn.color }}
                    >
                      {conn.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{conn.name}</h4>
                      <span className="text-[11px] text-zinc-400 block">{conn.type}</span>
                      <span className="text-[10px] text-zinc-500 block">
                        Sincronizado: {conn.lastSync}
                      </span>
                    </div>
                  </div>

                  <span className="bg-[#10E59B]/15 text-[#10E59B] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: SEGURANÇA & SESSÕES */}
      {activeTab === "seguranca" && (
        <div className="space-y-5 animate-fadeIn">
          {/* Card 1: 2FA e Senha */}
          <div className="rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg space-y-5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Segurança da Conta
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Proteja seus dados financeiros com camadas extras de autenticação
              </p>
            </div>

            <div className="space-y-3">
              {/* 2FA */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10E59B]/10 text-[#4DE8B3] flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-white">
                        Autenticação em Duas Etapas (2FA)
                      </h4>
                      <span className="bg-[#10E59B]/15 text-[#10E59B] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Ativado
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Protegido via aplicativo autenticador (Google Authenticator)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Configurações do 2FA abertas.")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Gerenciar
                </button>
              </div>

              {/* Senha */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#19152B] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D6B2FF]/10 text-[#D6B2FF] flex items-center justify-center">
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">Senha de Acesso</h4>
                    <p className="text-[11px] text-zinc-400">
                      Última alteração realizada há 42 dias
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#D6B2FF] hover:bg-[#c79efc] text-[#0B0914] font-bold text-xs transition-colors cursor-pointer"
                >
                  Alterar Senha
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Dispositivos Conectados */}
          <div className="rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight">
              Sessões Ativas
            </h3>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-[#19152B] border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 text-zinc-300 flex items-center justify-center">
                    <Laptop size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        Chrome no Windows 11
                      </span>
                      <span className="text-[10px] bg-[#10E59B]/15 text-[#10E59B] px-1.5 py-0.2 rounded font-bold">
                        Esta sessão
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500">
                      São Paulo, Brasil • IP 179.182.xx.xx
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#19152B] border border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 text-zinc-300 flex items-center justify-center">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">
                      MANNS App no iPhone 14
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Último acesso: hoje às 14:10 • São Paulo, Brasil
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast("Sessão remota encerrada.")}
                  className="text-xs text-zinc-400 hover:text-red-400 cursor-pointer"
                >
                  Encerrar
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Zona de Perigo / LGPD */}
          <div className="rounded-2xl border border-red-500/20 bg-[#131024] p-6 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" />
              <span>Privacidade & Dados (LGPD)</span>
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#19152B] border border-white/5">
              <div>
                <h4 className="text-xs font-semibold text-white">
                  Exportar Todos os Meus Dados
                </h4>
                <p className="text-[11px] text-zinc-400">
                  Faça o download de uma cópia em formato JSON de todas as suas informações
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportData}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download size={14} />
                <span>Exportar JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: CONECTAR BANCO OPEN FINANCE */}
      {showConnectBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Conectar Nova Instituição
                </h3>
                <p className="text-xs text-zinc-400">
                  Open Finance Brasil — Dados protegidos por criptografia de ponta a ponta
                </p>
              </div>
              <button
                onClick={() => setShowConnectBankModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {[
                { name: "Banco do Brasil", initials: "BB", color: "#F7D117" },
                { name: "Itaú Unibanco", initials: "IT", color: "#EC7000" },
                { name: "Bradesco", initials: "BD", color: "#CC092F" },
                { name: "Caixa Econômica", initials: "CX", color: "#0066B3" },
                { name: "Santander", initials: "ST", color: "#EC0000" },
                { name: "BTG Pactual", initials: "BT", color: "#001E62" },
              ].map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => handleAddBank(b.name, b.initials, b.color)}
                  className="p-3.5 rounded-xl bg-[#19152B] hover:bg-[#201b38] border border-white/5 hover:border-white/20 transition-all flex items-center gap-3 cursor-pointer text-left"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: `${b.color}20`, color: b.color }}
                  >
                    {b.initials}
                  </div>
                  <span className="text-xs font-semibold text-white">{b.name}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConnectBankModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: ALTERAR SENHA */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white tracking-tight">
                Alterar Senha de Acesso
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D6B2FF] hover:bg-[#c79efc] text-[#0B0914] font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  Salvar Nova Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}