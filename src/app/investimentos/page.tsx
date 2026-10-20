"use client";

import { useState, useMemo } from "react";
import {
  Target,
  Calendar,
  ChevronDown,
  ArrowRight,
  Building2,
  ShieldCheck,
  Leaf,
  Plus,
  CheckCircle2,
  X,
  TrendingUp,
  Sparkles,
  Info,
  DollarSign,
  Landmark,
  Layers,
  PieChart,
  Trash2,
} from "lucide-react";

// Tipos e Interfaces
interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category?: string;
}

interface InvestmentAsset {
  id: string;
  name: string;
  categoryTag: string;
  categoryType: "renda-fixa" | "tesouro" | "isento-ir" | "fundos" | "acoes";
  description: string;
  profitability: string;
  annualRate: number; // taxa anual estimada decimal, ex: 0.115 para 11.5%
  term: string;
  risk: "baixo" | "medio" | "alto";
  iconType: "bank" | "shield" | "leaf" | "chart";
}

interface DataPoint {
  month: string;
  value: number;
  label: string;
}

export default function InvestimentosPage() {
  // 1. Estados das Metas
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "g-1",
      title: "Reserva de Emergência Estudantil",
      targetAmount: 3000,
      currentAmount: 2150,
      targetDate: "2026-06-30",
      category: "Segurança",
    },
    {
      id: "g-2",
      title: "Notebook para Estudos",
      targetAmount: 3200,
      currentAmount: 1450,
      targetDate: "2026-11-20",
      category: "Acadêmico",
    },
    {
      id: "g-3",
      title: "Fundo para Formatura",
      targetAmount: 1800,
      currentAmount: 650,
      targetDate: "2027-07-15",
      category: "Formatura",
    },
  ]);

  // Formulário de Criação de Metas
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("3.200,00");
  const [goalDate, setGoalDate] = useState("2026-12-20");
  const [goalSaved, setGoalSaved] = useState("500,00");

  // 2. Estados do Gráfico de Evolução Patrimonial
  const [selectedPeriod, setSelectedPeriod] = useState<"6m" | "12m" | "24m">("12m");
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Séries temporais para cada período
  const chartDatasets: Record<"6m" | "12m" | "24m", DataPoint[]> = {
    "6m": [
      { month: "JUL", value: 2800, label: "Julho de 2025" },
      { month: "AGO", value: 3050, label: "Agosto de 2025" },
      { month: "SET", value: 3320, label: "Setembro de 2025" },
      { month: "OUT", value: 3650, label: "Outubro de 2025" },
      { month: "NOV", value: 3920, label: "Novembro de 2025" },
      { month: "DEZ", value: 4250.5, label: "Dezembro de 2025" },
    ],
    "12m": [
      { month: "JAN", value: 1200, label: "Janeiro de 2025" },
      { month: "FEV", value: 1450, label: "Fevereiro de 2025" },
      { month: "MAR", value: 1800, label: "Março de 2025" },
      { month: "ABR", value: 2100, label: "Abril de 2025" },
      { month: "MAI", value: 2450, label: "Maio de 2025" },
      { month: "JUN", value: 2650, label: "Junho de 2025" },
      { month: "JUL", value: 2800, label: "Julho de 2025" },
      { month: "AGO", value: 3050, label: "Agosto de 2025" },
      { month: "SET", value: 3320, label: "Setembro de 2025" },
      { month: "OUT", value: 3650, label: "Outubro de 2025" },
      { month: "NOV", value: 3920, label: "Novembro de 2025" },
      { month: "DEZ", value: 4250.5, label: "Dezembro de 2025" },
    ],
    "24m": [
      { month: "JAN/24", value: 500, label: "Janeiro de 2024" },
      { month: "MAI/24", value: 850, label: "Maio de 2024" },
      { month: "SET/24", value: 1100, label: "Setembro de 2024" },
      { month: "JAN/25", value: 1200, label: "Janeiro de 2025" },
      { month: "MAI/25", value: 2450, label: "Maio de 2025" },
      { month: "SET/25", value: 3320, label: "Setembro de 2025" },
      { month: "DEZ/25", value: 4250.5, label: "Dezembro de 2025" },
    ],
  };

  const activePoints = chartDatasets[selectedPeriod];

  // 3. Catálogo de Ativos Sugeridos e Completo
  const suggestedInvestments: InvestmentAsset[] = [
    {
      id: "inv-1",
      name: "CDB Liquidez Diária",
      categoryTag: "RENDA FIXA",
      categoryType: "renda-fixa",
      description: "Segurança e acesso ao dinheiro quando precisar.",
      profitability: "102% do CDI",
      annualRate: 0.1244, // aprox 12.44% a.a.
      term: "Resgate diário",
      risk: "baixo",
      iconType: "bank",
    },
    {
      id: "inv-2",
      name: "Tesouro Selic 2029",
      categoryTag: "TESOURO DIRETO",
      categoryType: "tesouro",
      description: "Estabilidade para objetivos de curto e médio prazo.",
      profitability: "Selic + 0,08%",
      annualRate: 0.1228,
      term: "Até 2029",
      risk: "baixo",
      iconType: "shield",
    },
    {
      id: "inv-3",
      name: "LCI Banco Verde",
      categoryTag: "ISENTO DE IR",
      categoryType: "isento-ir",
      description: "Rentabilidade sem imposto de renda para você.",
      profitability: "94% do CDI",
      annualRate: 0.1146,
      term: "12 meses",
      risk: "baixo",
      iconType: "leaf",
    },
  ];

  const fullCatalog: InvestmentAsset[] = [
    ...suggestedInvestments,
    {
      id: "inv-4",
      name: "Tesouro IPCA+ 2035",
      categoryTag: "TESOURO DIRETO",
      categoryType: "tesouro",
      description: "Proteção contra a inflação com taxa real prefixada.",
      profitability: "IPCA + 6,45%",
      annualRate: 0.118,
      term: "Até 2035",
      risk: "baixo",
      iconType: "shield",
    },
    {
      id: "inv-5",
      name: "CDB Banco Inter 110%",
      categoryTag: "RENDA FIXA",
      categoryType: "renda-fixa",
      description: "Rentabilidade turbinada para prazos mais longos.",
      profitability: "110% do CDI",
      annualRate: 0.134,
      term: "24 meses",
      risk: "medio",
      iconType: "bank",
    },
    {
      id: "inv-6",
      name: "Fundo Imobiliário HGLG11",
      categoryTag: "FUNDOS IMOBILIÁRIOS",
      categoryType: "fundos",
      description: "Renda passiva mensal isenta de IR com galpões logísticos.",
      profitability: "Dividend Yield 8,9% a.a.",
      annualRate: 0.125,
      term: "Livre negociação",
      risk: "medio",
      iconType: "chart",
    },
  ];

  // 4. Estados dos Modais
  const [selectedAssetForSimulation, setSelectedAssetForSimulation] = useState<InvestmentAsset | null>(null);
  const [simulationAmount, setSimulationAmount] = useState("1.000,00");
  const [simulationMonths, setSimulationMonths] = useState<6 | 12 | 24>(12);
  const [showAllInvestmentsModal, setShowAllInvestmentsModal] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<string>("all");
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Formatação em BRL
  const formatCurrency = (val: number, decimals = true) => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0,
    });
  };

  // Submissão do Formulário de Metas
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = parseFloat(goalAmount.replace(/\./g, "").replace(",", "."));
    const cleanSaved = parseFloat(goalSaved.replace(/\./g, "").replace(",", "."));

    if (!goalName.trim()) {
      showToast("Por favor, informe o nome da meta.");
      return;
    }
    if (isNaN(cleanTarget) || cleanTarget <= 0) {
      showToast("Informe um valor válido para a meta.");
      return;
    }

    const newGoal: Goal = {
      id: `g-${Date.now()}`,
      title: goalName.trim(),
      targetAmount: cleanTarget,
      currentAmount: isNaN(cleanSaved) ? 0 : Math.min(cleanSaved, cleanTarget),
      targetDate: goalDate || "2027-01-01",
      category: "Personalizada",
    };

    setGoals((prev) => [newGoal, ...prev]);
    setGoalName("");
    setGoalSaved("0,00");
    showToast(`Meta "${newGoal.title}" criada com sucesso!`);
  };

  // Cálculo da Curva SVG
  const svgWidth = 560;
  const svgHeight = 210;
  const paddingX = 40;
  const paddingY = 35;

  const minVal = useMemo(
    () => Math.min(...activePoints.map((p) => p.value)) * 0.92,
    [activePoints]
  );
  const maxVal = useMemo(
    () => Math.max(...activePoints.map((p) => p.value)) * 1.05,
    [activePoints]
  );

  // Mapeamento dos pontos (x, y)
  const coords = useMemo(() => {
    const totalPoints = activePoints.length;
    const stepX = (svgWidth - paddingX * 2) / (totalPoints - 1);
    const availableH = svgHeight - paddingY * 2;

    return activePoints.map((p, idx) => {
      const x = paddingX + idx * stepX;
      const normalizedY = (p.value - minVal) / (maxVal - minVal);
      const y = svgHeight - paddingY - normalizedY * availableH;
      return { x, y, data: p };
    });
  }, [activePoints, minVal, maxVal, svgWidth, svgHeight, paddingX, paddingY]);

  // Geração do caminho suave Bézier
  const { pathD, areaD } = useMemo(() => {
    if (coords.length === 0) return { pathD: "", areaD: "" };
    if (coords.length === 1) {
      const d = `M ${coords[0].x} ${coords[0].y}`;
      return { pathD: d, areaD: d };
    }

    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    const last = coords[coords.length - 1];
    const first = coords[0];
    const area = `${d} L ${last.x} ${svgHeight - 15} L ${first.x} ${svgHeight - 15} Z`;

    return { pathD: d, areaD: area };
  }, [coords, svgHeight]);

  // Cálculos do Simulador de Investimento
  const simulationResults = useMemo(() => {
    if (!selectedAssetForSimulation) return null;
    const principal =
      parseFloat(simulationAmount.replace(/\./g, "").replace(",", ".")) || 1000;
    const years = simulationMonths / 12;

    // Rendimento composto no ativo
    const rate = selectedAssetForSimulation.annualRate;
    const totalAsset = principal * Math.pow(1 + rate, years);
    const assetYield = totalAsset - principal;

    // Rendimento composto na Poupança (estimada em ~6.17% a.a.)
    const poupancaRate = 0.0617;
    const totalPoupanca = principal * Math.pow(1 + poupancaRate, years);
    const poupancaYield = totalPoupanca - principal;

    // Diferença
    const extraGain = assetYield - poupancaYield;
    const extraPercent = poupancaYield > 0 ? (extraGain / poupancaYield) * 100 : 0;

    return {
      principal,
      totalAsset,
      assetYield,
      totalPoupanca,
      poupancaYield,
      extraGain,
      extraPercent,
    };
  }, [selectedAssetForSimulation, simulationAmount, simulationMonths]);

  return (
    <div className="max-w-[1240px] mx-auto space-y-7 pb-12 select-none relative">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1A162B] border border-[#00E5FF]/30 text-white px-4 py-3 rounded-xl shadow-2xl shadow-cyan-950/60 transition-all animate-bounce">
          <CheckCircle2 size={18} className="text-[#00E5FF]" />
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
            Seus planos começam a...
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Defina metas, invista no seu ritmo e acompanhe cada conquista.
          </p>
        </div>

        {/* Botão de Ver Metas Cadastradas */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowGoalsModal(true)}
            className="bg-[#131024] border border-white/10 hover:border-[#D6B2FF]/40 text-zinc-200 hover:text-white px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Target size={16} className="text-[#D6B2FF]" />
            <span>Minhas Metas ({goals.length})</span>
          </button>
        </div>
      </header>

      {/* 2. LINHA SUPERIOR: CARD NOVAS METAS & CARD TOTAL INVESTIDO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card: Novas Metas (Formulário) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between relative">
          <div>
            {/* Topo do Card */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block mb-1">
                  Planeje o Próximo Passo
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">Novas Metas</h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Dê um nome ao seu objetivo e nós ajudamos você a chegar lá.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#9D4EDD]/15 border border-[#9D4EDD]/30 flex items-center justify-center text-[#D6B2FF] shrink-0">
                <Target size={20} />
              </div>
            </div>

            {/* Formulário Interativo */}
            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              {/* Campo 1: Nome da Meta */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Nome da meta
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="Ex.: Notebook para Estudos"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              {/* Campos 2 e 3: Valor da Meta & Data Desejada em 2 colunas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Valor da meta
                  </label>
                  <input
                    type="text"
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(e.target.value)}
                    placeholder="R$ 3.200,00"
                    className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Data desejada
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={goalDate}
                      onChange={(e) => setGoalDate(e.target.value)}
                      className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D6B2FF] transition-colors cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Campo 4: Quanto você já guardou? */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Quanto você já guardou?
                </label>
                <input
                  type="text"
                  value={goalSaved}
                  onChange={(e) => setGoalSaved(e.target.value)}
                  placeholder="R$ 0,00"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              {/* Botão de Criação */}
              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full bg-[#B583FF] hover:bg-[#a670f5] text-[#0B0914] font-bold text-xs py-3 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Criar nova meta</span>
                </button>
              </div>

              {/* Mensagem de Apoio */}
              <p className="text-[11px] text-zinc-500 text-center pt-1">
                Você pode editar os detalhes a qualquer momento.
              </p>
            </form>
          </div>
        </div>

        {/* Card: Total Investido (Gráfico Neon de Área / Linha) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/5 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div>
            {/* Topo do Card */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block mb-1">
                  Patrimônio em Evolução
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">Total Investido</h2>
              </div>

              {/* Seletor de Período Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
                  className="bg-[#19152B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-300 flex items-center gap-1.5 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <span>
                    {selectedPeriod === "6m"
                      ? "Últimos 6 meses"
                      : selectedPeriod === "12m"
                      ? "Últimos 12 meses"
                      : "Últimos 24 meses"}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {isPeriodDropdownOpen && (
                  <div className="absolute right-0 top-9 w-40 bg-[#19152B] border border-white/10 rounded-xl p-1.5 shadow-2xl z-30">
                    {[
                      { key: "6m", label: "Últimos 6 meses" },
                      { key: "12m", label: "Últimos 12 meses" },
                      { key: "24m", label: "Últimos 24 meses" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSelectedPeriod(opt.key as "6m" | "12m" | "24m");
                          setIsPeriodDropdownOpen(false);
                          showToast(`Gráfico ajustado para ${opt.label}.`);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                          selectedPeriod === opt.key
                            ? "bg-[#00E5FF]/20 text-[#00E5FF] font-semibold"
                            : "text-zinc-300 hover:bg-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Destaque de Valor e Rentabilidade */}
            <div className="flex flex-wrap items-baseline gap-2.5 mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(activePoints[activePoints.length - 1].value)}
              </span>
              <span className="bg-[#10E59B]/15 text-[#10E59B] border border-[#10E59B]/25 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp size={12} />
                12,8%
              </span>
              <span className="text-xs text-zinc-400">
                nos últimos {selectedPeriod === "6m" ? "6" : selectedPeriod === "12m" ? "12" : "24"} meses
              </span>
            </div>

            {/* Gráfico SVG Neon */}
            <div className="relative pt-2">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-52 sm:h-56 overflow-visible select-none"
              >
                <defs>
                  {/* Gradiente da Área Preenchida */}
                  <linearGradient id="neonAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10E59B" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#10E59B" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#10E59B" stopOpacity="0" />
                  </linearGradient>

                  {/* Filtro Glow para a Linha */}
                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Linha guia pontilhada horizontal sutil */}
                <line
                  x1={paddingX}
                  y1={svgHeight - 15}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - 15}
                  stroke="rgba(255,255,255,0.06)"
                />

                {/* Área sob a curva */}
                {areaD && <path d={areaD} fill="url(#neonAreaGradient)" />}

                {/* Linha Neon Suave */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#4DE8B3"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#neonGlow)"
                  />
                )}

                {/* Linha guia vertical interativa no hover */}
                {hoveredPointIndex !== null && coords[hoveredPointIndex] && (
                  <line
                    x1={coords[hoveredPointIndex].x}
                    y1={paddingY}
                    x2={coords[hoveredPointIndex].x}
                    y2={svgHeight - 15}
                    stroke="#4DE8B3"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeOpacity="0.6"
                  />
                )}

                {/* Pontos de dados interativos invisíveis para captura de hover */}
                {coords.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="12"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  />
                ))}

                {/* Ponto terminal de destaque (Dezembro) */}
                {coords.length > 0 && (
                  <g>
                    <circle
                      cx={coords[coords.length - 1].x}
                      cy={coords[coords.length - 1].y}
                      r="5"
                      fill="#10E59B"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <circle
                      cx={coords[coords.length - 1].x}
                      cy={coords[coords.length - 1].y}
                      r="10"
                      fill="#10E59B"
                      fillOpacity="0.25"
                    />
                  </g>
                )}

                {/* Marcadores do Eixo X */}
                {coords
                  .filter((_, idx) => {
                    if (coords.length > 10) return idx % 2 === 0 || idx === coords.length - 1;
                    return true;
                  })
                  .map((pt, idx) => (
                    <text
                      key={idx}
                      x={pt.x}
                      y={svgHeight}
                      textAnchor="middle"
                      fill="#71717A"
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {pt.data.month}
                    </text>
                  ))}
              </svg>

              {/* Badge Flutuante no Ponto Terminal ("R$ 68,4 mil") */}
              {coords.length > 0 && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    right: "28px",
                    top: "30px",
                  }}
                >
                  <span className="bg-[#10E59B]/20 text-[#10E59B] border border-[#10E59B]/40 font-bold text-xs px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-sm">
                    R$ 4.250,50
                  </span>
                </div>
              )}

              {/* Tooltip Dinâmico do Hover */}
              {hoveredPointIndex !== null && coords[hoveredPointIndex] && (
                <div
                  className="absolute bg-[#19152B] border border-[#10E59B]/40 rounded-xl p-2.5 shadow-2xl z-30 pointer-events-none animate-fadeIn"
                  style={{
                    left: `${Math.min(Math.max(coords[hoveredPointIndex].x - 60, 10), 380)}px`,
                    top: "10px",
                  }}
                >
                  <span className="text-[10px] font-semibold text-zinc-400 block">
                    {coords[hoveredPointIndex].data.label}
                  </span>
                  <span className="text-xs font-bold text-white">
                    {formatCurrency(coords[hoveredPointIndex].data.value)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. LINHA INFERIOR: ESCOLHAS PARA O SEU PERFIL (INVESTIMENTOS SUGERIDOS) */}
      <div className="space-y-4">
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block mb-1">
              Escolhas Para o Seu Perfil
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Investimentos Sugeridos</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Opções de baixo risco para fazer seu dinheiro crescer com tranquilidade.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllInvestmentsModal(true)}
            className="text-xs font-semibold text-[#D6B2FF] hover:text-white flex items-center gap-1 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <span>Ver todos os investimentos</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Grid de 3 Cards de Investimento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {suggestedInvestments.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl border border-white/5 bg-[#131024] p-5 shadow-lg flex flex-col justify-between hover:border-white/10 hover:bg-[#161329] transition-all group relative overflow-hidden"
            >
              <div>
                {/* Linha Superior do Card: Ícone e Badge de Risco */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      asset.iconType === "bank"
                        ? "bg-[#10E59B]/10 border border-[#10E59B]/25 text-[#4DE8B3]"
                        : asset.iconType === "shield"
                        ? "bg-[#9D4EDD]/10 border border-[#9D4EDD]/25 text-[#D6B2FF]"
                        : "bg-[#10E59B]/10 border border-[#10E59B]/25 text-[#4DE8B3]"
                    }`}
                  >
                    {asset.iconType === "bank" && <Building2 size={20} />}
                    {asset.iconType === "shield" && <ShieldCheck size={20} />}
                    {asset.iconType === "leaf" && <Leaf size={20} />}
                  </div>

                  {/* Badge de Risco */}
                  <span className="bg-[#19152B] border border-white/5 text-[11px] font-medium text-zinc-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10E59B]" />
                    Risco {asset.risk}
                  </span>
                </div>

                {/* Categoria e Título */}
                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block mb-1">
                  {asset.categoryTag}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">{asset.name}</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed min-h-[34px]">
                  {asset.description}
                </p>
              </div>

              {/* Rodapé com Rentabilidade, Prazo e Botão de Ação */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                    Rentabilidade
                  </span>
                  <span className="text-xs font-bold text-white">{asset.profitability}</span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                    Prazo
                  </span>
                  <span className="text-xs font-bold text-white">{asset.term}</span>
                </div>

                {/* Botão de Simulação / Aporte */}
                <button
                  type="button"
                  onClick={() => setSelectedAssetForSimulation(asset)}
                  title="Simular investimento"
                  className="w-8 h-8 rounded-full bg-[#19152B] group-hover:bg-[#D6B2FF] text-zinc-300 group-hover:text-[#0B0914] border border-white/5 flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MODAL: SIMULADOR DE APLICAÇÃO */}
      {selectedAssetForSimulation && simulationResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Simular Aplicação — {selectedAssetForSimulation.name}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Projeção estimada de retorno comparada à poupança
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAssetForSimulation(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Inputs do Simulador */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Valor da aplicação
                </label>
                <input
                  type="text"
                  value={simulationAmount}
                  onChange={(e) => setSimulationAmount(e.target.value)}
                  placeholder="R$ 1.000,00"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E5FF] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Prazo da simulação
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[6, 12, 24].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSimulationMonths(m as 6 | 12 | 24)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        simulationMonths === m
                          ? "bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]"
                          : "bg-[#19152B] border-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {m} meses
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparativo de Resultados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Neste Ativo */}
              <div className="bg-[#19152B] border border-[#10E59B]/30 rounded-xl p-4 space-y-1 relative overflow-hidden">
                <span className="text-[11px] text-zinc-400 font-medium block">
                  Neste Investimento ({selectedAssetForSimulation.profitability})
                </span>
                <span className="text-xl font-bold text-white block">
                  {formatCurrency(simulationResults.totalAsset)}
                </span>
                <span className="text-xs font-semibold text-[#10E59B] block">
                  + {formatCurrency(simulationResults.assetYield)} de rendimento líquido
                </span>
              </div>

              {/* Na Poupança */}
              <div className="bg-[#19152B] border border-white/5 rounded-xl p-4 space-y-1">
                <span className="text-[11px] text-zinc-400 font-medium block">
                  Na Poupança (~6,17% a.a.)
                </span>
                <span className="text-xl font-bold text-zinc-300 block">
                  {formatCurrency(simulationResults.totalPoupanca)}
                </span>
                <span className="text-xs text-zinc-500 block">
                  + {formatCurrency(simulationResults.poupancaYield)} de rendimento
                </span>
              </div>
            </div>

            {/* Destaque do Ganho Extra */}
            <div className="bg-[#00E5FF]/10 border border-[#00E5FF]/25 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#00E5FF]" />
                <span className="text-xs text-zinc-200">
                  Ganho adicional em relação à poupança:
                </span>
              </div>
              <span className="text-xs font-bold text-[#00E5FF]">
                + {formatCurrency(simulationResults.extraGain)} (+
                {simulationResults.extraPercent.toFixed(0)}%)
              </span>
            </div>

            {/* Ações */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedAssetForSimulation(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(
                    `Simulação salva para ${selectedAssetForSimulation.name}! Adicionada ao seu histórico.`
                  );
                  setSelectedAssetForSimulation(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#34ebff] text-[#0B0914] font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                Confirmar Simulação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: VER TODOS OS INVESTIMENTOS (CATÁLOGO COMPLETO) */}
      {showAllInvestmentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            {/* Topo do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Catálogo de Investimentos
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Explore oportunidades de Renda Fixa, Tesouro e Renda Variável
                </p>
              </div>
              <button
                onClick={() => setShowAllInvestmentsModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filtros por Categorias */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: "all", label: "Todos" },
                { id: "renda-fixa", label: "Renda Fixa" },
                { id: "tesouro", label: "Tesouro Direto" },
                { id: "isento-ir", label: "Isentos de IR" },
                { id: "fundos", label: "Fundos Imobiliários" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCatalogFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    catalogFilter === tab.id
                      ? "bg-[#D6B2FF] text-[#0B0914]"
                      : "bg-[#19152B] text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Lista com Rolagem */}
            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {fullCatalog
                .filter((item) =>
                  catalogFilter === "all" ? true : item.categoryType === catalogFilter
                )
                .map((asset) => (
                  <div
                    key={asset.id}
                    className="p-4 rounded-xl bg-[#19152B] hover:bg-[#1e1933] transition-colors border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          {asset.categoryTag}
                        </span>
                        <span className="text-[10px] font-medium text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">
                          Risco {asset.risk}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{asset.name}</h4>
                      <p className="text-xs text-zinc-400">{asset.description}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                          Rentabilidade
                        </span>
                        <span className="text-xs font-bold text-[#10E59B]">
                          {asset.profitability}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
                          Prazo
                        </span>
                        <span className="text-xs font-bold text-white">{asset.term}</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedAssetForSimulation(asset);
                          setShowAllInvestmentsModal(false);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#D6B2FF] hover:bg-[#c79efc] text-[#0B0914] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Simular
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Rodapé */}
            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setShowAllInvestmentsModal(false)}
                className="px-4 py-2 rounded-xl bg-[#D6B2FF] text-[#0B0914] font-semibold text-xs hover:bg-[#c79efc] transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: MINHAS METAS CADASTRADAS */}
      {showGoalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#9D4EDD]/15 text-[#D6B2FF] flex items-center justify-center">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Minhas Metas Cadastradas
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Acompanhe o progresso de cada um dos seus objetivos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGoalsModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Lista de Metas */}
            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {goals.map((goal) => {
                const percent = Math.min(
                  100,
                  Math.round((goal.currentAmount / goal.targetAmount) * 100)
                );

                return (
                  <div
                    key={goal.id}
                    className="p-4 rounded-xl bg-[#19152B] border border-white/5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{goal.title}</h4>
                        <span className="text-[11px] text-zinc-400">
                          Data limite prevista: {goal.targetDate}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setGoals((prev) => prev.filter((g) => g.id !== goal.id));
                          showToast(`Meta "${goal.title}" removida.`);
                        }}
                        title="Remover meta"
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="space-y-1">
                      <div className="w-full h-2.5 bg-[#131024] rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-[#9D4EDD] to-[#00E5FF] rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">
                          {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                        </span>
                        <span className="font-bold text-[#00E5FF]">{percent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGoalsModal(false)}
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