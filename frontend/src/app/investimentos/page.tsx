"use client";

import { useState, useMemo, useRef } from "react";
import {
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
  PiggyBank,
  Coins,
  Percent,
  BarChart3,
  LineChart,
} from "lucide-react";

// Tipos e Interfaces
interface Cofrinho {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  cdiRate: number; // ex: 100, 102, 105 (% do CDI)
  createdAt?: string;
}

interface StockAsset {
  id: string;
  ticker: string;
  name: string;
  type: "Ação" | "FII" | "ETF";
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  monthlyDividendPerShare: number;
  variationPercent: number;
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
  // 1. Estados dos Cofrinhos
  const [cofrinhos, setCofrinhos] = useState<Cofrinho[]>([
    {
      id: "cof-1",
      name: "Reserva de Emergência Estudantil",
      description: "Segurança para imprevistos do campus e despesas médicas",
      targetAmount: 3000,
      currentAmount: 2150,
      cdiRate: 102,
    },
    {
      id: "cof-2",
      name: "Notebook para Estudos",
      description: "Upgrade de máquina para rodar projetos de computação",
      targetAmount: 3200,
      currentAmount: 1450,
      cdiRate: 100,
    },
    {
      id: "cof-3",
      name: "Fundo para Formatura",
      description: "Comissão de formatura, beca e fotos da colação",
      targetAmount: 1800,
      currentAmount: 650,
      cdiRate: 105,
    },
  ]);

  // Modal de Adicionar Novo Cofrinho
  const [showNewCofrinhoModal, setShowNewCofrinhoModal] = useState(false);
  const [newCofrinhoName, setNewCofrinhoName] = useState("");
  const [newCofrinhoDesc, setNewCofrinhoDesc] = useState("");
  const [newCofrinhoTarget, setNewCofrinhoTarget] = useState("");
  const [newCofrinhoSaved, setNewCofrinhoSaved] = useState("");
  const [newCofrinhoCdi, setNewCofrinhoCdi] = useState("102");

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

  // Submissão do Formulário de Cofrinhos
  const handleCreateCofrinho = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = parseFloat(newCofrinhoTarget.replace(/\./g, "").replace(",", "."));
    const cleanSaved = newCofrinhoSaved
      ? parseFloat(newCofrinhoSaved.replace(/\./g, "").replace(",", "."))
      : 0;
    const cleanCdi = parseFloat(newCofrinhoCdi.replace(",", ".")) || 100;

    if (!newCofrinhoName.trim()) {
      showToast("Por favor, informe o nome do cofrinho.");
      return;
    }
    if (isNaN(cleanTarget) || cleanTarget <= 0) {
      showToast("Informe um valor válido para a meta do cofrinho.");
      return;
    }

    const newCofrinho: Cofrinho = {
      id: `cof-${Date.now()}`,
      name: newCofrinhoName.trim(),
      description: newCofrinhoDesc.trim() || "Objetivo de investimento pessoal",
      targetAmount: cleanTarget,
      currentAmount: isNaN(cleanSaved) ? 0 : Math.min(cleanSaved, cleanTarget),
      cdiRate: cleanCdi,
    };

    setCofrinhos((prev) => [newCofrinho, ...prev]);
    setNewCofrinhoName("");
    setNewCofrinhoDesc("");
    setNewCofrinhoTarget("");
    setNewCofrinhoSaved("");
    setNewCofrinhoCdi("102");
    setShowNewCofrinhoModal(false);
    showToast(`Cofrinho "${newCofrinho.name}" criado com sucesso!`);
  };

  // Exclusão de Cofrinho
  const handleDeleteCofrinho = (id: string, name: string) => {
    setCofrinhos((prev) => prev.filter((c) => c.id !== id));
    showToast(`Cofrinho "${name}" removido.`);
  };

  // Totais Consolidados dos Cofrinhos
  const totalSavedInCofrinhos = useMemo(() => {
    return cofrinhos.reduce((acc, curr) => acc + curr.currentAmount, 0);
  }, [cofrinhos]);

  const totalTargetInCofrinhos = useMemo(() => {
    return cofrinhos.reduce((acc, curr) => acc + curr.targetAmount, 0);
  }, [cofrinhos]);

  // Carrossel Mobile (Cofrinhos vs Bolsa de Valores)
  const [activeCarouselSlide, setActiveCarouselSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    if (width > 0) {
      const slide = Math.round(scrollLeft / width);
      setActiveCarouselSlide(slide);
    }
  };

  const scrollToSlide = (idx: number) => {
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: idx * width,
        behavior: "smooth",
      });
      setActiveCarouselSlide(idx);
    }
  };

  // Carrossel Mobile (Investimentos Sugeridos)
  const [activeSuggestedSlide, setActiveSuggestedSlide] = useState(0);
  const suggestedCarouselRef = useRef<HTMLDivElement>(null);

  const handleSuggestedCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.offsetWidth;
    if (width > 0) {
      const slide = Math.min(
        suggestedInvestments.length - 1,
        Math.max(0, Math.round(scrollLeft / width))
      );
      setActiveSuggestedSlide(slide);
    }
  };

  const scrollToSuggestedSlide = (idx: number) => {
    if (suggestedCarouselRef.current) {
      const width = suggestedCarouselRef.current.offsetWidth;
      suggestedCarouselRef.current.scrollTo({
        left: idx * width,
        behavior: "smooth",
      });
      setActiveSuggestedSlide(idx);
    }
  };

  // 1.1 Estados da Bolsa de Valores (Ações, FIIs e Proventos Mensais)
  const [stocks, setStocks] = useState<StockAsset[]>([
    {
      id: "stk-1",
      ticker: "MXRF11",
      name: "Maxi Renda FII",
      type: "FII",
      quantity: 50,
      averagePrice: 9.8,
      currentPrice: 10.15,
      monthlyDividendPerShare: 0.09,
      variationPercent: 0.8,
    },
    {
      id: "stk-2",
      ticker: "ITUB4",
      name: "Itaú Unibanco PN",
      type: "Ação",
      quantity: 15,
      averagePrice: 31.4,
      currentPrice: 35.2,
      monthlyDividendPerShare: 0.42,
      variationPercent: 1.6,
    },
    {
      id: "stk-3",
      ticker: "BBAS3",
      name: "Banco do Brasil ON",
      type: "Ação",
      quantity: 10,
      averagePrice: 25.1,
      currentPrice: 27.8,
      monthlyDividendPerShare: 0.85,
      variationPercent: 2.1,
    },
    {
      id: "stk-4",
      ticker: "TAEE11",
      name: "Transmissora Aliança Taesa",
      type: "Ação",
      quantity: 12,
      averagePrice: 34.2,
      currentPrice: 36.4,
      monthlyDividendPerShare: 0.95,
      variationPercent: -0.4,
    },
    {
      id: "stk-5",
      ticker: "WEGE3",
      name: "WEG Motores e Automação",
      type: "Ação",
      quantity: 8,
      averagePrice: 48.0,
      currentPrice: 52.6,
      monthlyDividendPerShare: 0.22,
      variationPercent: 1.2,
    },
  ]);

  const [showNewStockModal, setShowNewStockModal] = useState(false);
  const [newStockTicker, setNewStockTicker] = useState("");
  const [newStockName, setNewStockName] = useState("");
  const [newStockType, setNewStockType] = useState<"Ação" | "FII" | "ETF">("Ação");
  const [newStockQty, setNewStockQty] = useState("");
  const [newStockPrice, setNewStockPrice] = useState("");
  const [newStockDividend, setNewStockDividend] = useState("");

  const totalStockValue = useMemo(() => {
    return stocks.reduce((acc, curr) => acc + curr.quantity * curr.currentPrice, 0);
  }, [stocks]);

  const totalMonthlyDividends = useMemo(() => {
    return stocks.reduce(
      (acc, curr) => acc + curr.quantity * curr.monthlyDividendPerShare,
      0
    );
  }, [stocks]);

  const handleCreateStock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQty = parseInt(newStockQty) || 0;
    const cleanPrice = parseFloat(newStockPrice.replace(/\./g, "").replace(",", ".")) || 0;
    const cleanDiv = parseFloat(newStockDividend.replace(/\./g, "").replace(",", ".")) || 0;

    if (!newStockTicker.trim()) {
      showToast("Informe o código da ação ou FII (ex.: ITUB4, MXRF11).");
      return;
    }
    if (cleanQty <= 0) {
      showToast("Informe uma quantidade válida de cotas/ações.");
      return;
    }
    if (cleanPrice <= 0) {
      showToast("Informe o preço da cotação.");
      return;
    }

    const newStock: StockAsset = {
      id: `stk-${Date.now()}`,
      ticker: newStockTicker.trim().toUpperCase(),
      name: newStockName.trim() || newStockTicker.trim().toUpperCase(),
      type: newStockType,
      quantity: cleanQty,
      averagePrice: cleanPrice,
      currentPrice: cleanPrice,
      monthlyDividendPerShare: cleanDiv,
      variationPercent: 0,
    };

    setStocks((prev) => [newStock, ...prev]);
    setNewStockTicker("");
    setNewStockName("");
    setNewStockQty("");
    setNewStockPrice("");
    setNewStockDividend("");
    setShowNewStockModal(false);
    showToast(`Ativo ${newStock.ticker} adicionado à sua carteira!`);
  };

  const handleDeleteStock = (id: string, ticker: string) => {
    setStocks((prev) => prev.filter((s) => s.id !== id));
    showToast(`Ativo "${ticker}" removido da carteira.`);
  };

  // Cálculo da Curva SVG
  const svgWidth = 840;
  const svgHeight = 220;
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1A162B] border border-[#10E59B]/30 text-white px-4 py-3 rounded-xl shadow-2xl shadow-emerald-950/60 transition-all animate-bounce">
          <CheckCircle2 size={18} className="text-[#10E59B]" />
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
          <h1 className="text-3xl font-bold text-white tracking-tighter leading-tight">
            Seus Investimentos
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Guarde dinheiro em cofrinhos com rendimento do CDI e acompanhe seus objetivos.
          </p>
        </div>
      </header>

      {/* 2. CARROSSEL MOBILE / GRID DESKTOP: MEUS COFRINHOS & BOLSA DE VALORES */}
      <div className="space-y-3">
        {/* Controles / Indicador de Página no Mobile */}
        <div className="md:hidden flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            {activeCarouselSlide === 0 ? "1/2 • Meus Cofrinhos" : "2/2 • Bolsa de Valores"}
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => scrollToSlide(0)}
              className={`h-2 rounded-full transition-all cursor-pointer ${activeCarouselSlide === 0 ? "bg-[#D6B2FF] w-6" : "bg-white/20 w-2"
                }`}
              aria-label="Ir para Cofrinhos"
            />
            <button
              type="button"
              onClick={() => scrollToSlide(1)}
              className={`h-2 rounded-full transition-all cursor-pointer ${activeCarouselSlide === 1 ? "bg-[#10E59B] w-6" : "bg-white/20 w-2"
                }`}
              aria-label="Ir para Bolsa de Valores"
            />
          </div>
        </div>

        {/* Carrossel Horizontal no Mobile e Grid de 2 Colunas no Desktop */}
        <div
          ref={carouselRef}
          onScroll={handleCarouselScroll}
          className="flex lg:grid lg:grid-cols-2 overflow-x-auto snap-x snap-mandatory gap-5 pb-2 scrollbar-none"
        >
          {/* Card 1: Meus Cofrinhos */}
          <div className="w-full min-w-full sm:min-w-[420px] lg:min-w-0 snap-center rounded-2xl border border-white/10 bg-[#131024] shadow-lg flex flex-col justify-between relative overflow-hidden">
            {/* Topo do Card com padding dedicado */}
            <div className="p-5 sm:p-6 pb-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-[#D6B2FF] uppercase block mb-1">
                    Guardar & Render
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <PiggyBank size={20} className="text-[#D6B2FF]" />
                    Meus Cofrinhos
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Objetivos com rendimento automático sobre o CDI.
                  </p>
                </div>

                {/* Botão de Adicionar Nova Meta / Cofrinho */}
                <button
                  type="button"
                  onClick={() => setShowNewCofrinhoModal(true)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#D6B2FF] hover:bg-[#c79efc] text-[#0B0914] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98 shrink-0"
                >
                  <Plus size={16} />
                  <span>Novo Cofrinho</span>
                </button>
              </div>

              {/* Resumo Consolidado dos Cofrinhos em cor mais clara */}
              <div className="p-3.5 rounded-xl bg-[#1C1833] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#9D4EDD]/20 text-[#D6B2FF] flex items-center justify-center shrink-0">
                    <Coins size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total Guardado</span>
                    <span className="text-sm font-bold text-white">{formatCurrency(totalSavedInCofrinhos)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total das Metas</span>
                  <span className="text-xs font-semibold text-zinc-300">{formatCurrency(totalTargetInCofrinhos)}</span>
                </div>
              </div>
            </div>

            {/* Lista de Metas / Cofrinhos chegando até as bordas do box externo, com divisórias e scrollbar escura */}
            <div className="flex-1 border-t border-white/[0.08] overflow-y-auto max-h-[380px] divide-y divide-white/[0.08] bg-[#18142A]/50 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.16)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {cofrinhos.length === 0 ? (
                <div className="text-center py-10 px-5">
                  <PiggyBank size={32} className="mx-auto text-zinc-500 mb-2" />
                  <p className="text-xs font-medium text-zinc-400">Nenhum cofrinho criado ainda.</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Crie seu primeiro cofrinho para começar a guardar!</p>
                  <button
                    onClick={() => setShowNewCofrinhoModal(true)}
                    className="mt-3 min-h-[44px] px-4 py-2 rounded-xl bg-[#D6B2FF] text-[#0B0914] text-xs font-bold hover:bg-[#c79efc] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    Criar Cofrinho
                  </button>
                </div>
              ) : (
                cofrinhos.map((cof) => {
                  const percent = Math.min(
                    100,
                    Math.round((cof.currentAmount / cof.targetAmount) * 100)
                  );
                  const remaining = Math.max(0, cof.targetAmount - cof.currentAmount);

                  return (
                    <div
                      key={cof.id}
                      className="p-4 sm:px-6 hover:bg-white/[0.02] transition-colors space-y-2.5"
                    >
                      {/* Linha superior: Nome, % CDI (verde agradável) e Botão Excluir */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-white truncate">{cof.name}</h4>
                            <span className="px-2 py-0.5 rounded-md bg-[#10E59B]/10 text-[#10E59B] text-[10px] font-bold border border-[#10E59B]/25 flex items-center gap-1 shrink-0">
                              <TrendingUp size={10} />
                              {cof.cdiRate}% do CDI
                            </span>
                          </div>
                          {cof.description && (
                            <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{cof.description}</p>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteCofrinho(cof.id, cof.name)}
                          title="Excluir cofrinho"
                          className="w-8 h-8 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Barra de progresso com cor sólida roxo escuro */}
                      <div className="space-y-1">
                        <div className="w-full h-2 bg-[#0E0C18] rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-[#7B2CBF] rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1.5 text-zinc-300">
                            <span className="font-semibold text-white">{formatCurrency(cof.currentAmount)}</span>
                            <span className="text-zinc-500">guardado</span>
                          </div>
                          <span className="font-bold text-[#10E59B]">{percent}%</span>
                        </div>
                      </div>

                      {/* Detalhes de quanto falta e meta */}
                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400">
                          Falta: <strong className="text-zinc-200">{formatCurrency(remaining)}</strong>
                        </span>
                        <span className="text-zinc-500">
                          Meta: {formatCurrency(cof.targetAmount)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card 2: Bolsa de Valores (Ações, FIIs e Proventos Mensais) */}
          <div className="w-full min-w-full sm:min-w-[420px] lg:min-w-0 snap-center rounded-2xl border border-white/10 bg-[#131024] shadow-lg flex flex-col justify-between relative overflow-hidden">
            {/* Topo do Card com padding dedicado */}
            <div className="p-5 sm:p-6 pb-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold tracking-wider text-[#10E59B] uppercase block mb-1">
                    Renda Variável & Dividendos
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <LineChart size={20} className="text-[#10E59B]" />
                    Bolsa de Valores
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Acompanhe suas ações e proventos mensais pingando na conta.
                  </p>
                </div>

                {/* Botão de Adicionar Ativo */}
                <button
                  type="button"
                  onClick={() => setShowNewStockModal(true)}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#10E59B] hover:bg-[#0fd08c] text-[#0B0914] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98 shrink-0"
                >
                  <Plus size={16} />
                  <span>Nova Ação</span>
                </button>
              </div>

              {/* Resumo Consolidado de Proventos Mensais e Patrimônio em Bolsa */}
              <div className="p-3.5 rounded-xl bg-[#1C1833] border border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#10E59B]/20 text-[#10E59B] flex items-center justify-center shrink-0">
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Provento Mensal Estimado</span>
                    <span className="text-sm font-bold text-[#10E59B]">
                      + {formatCurrency(totalMonthlyDividends)}
                      <span className="text-[10px] font-normal text-zinc-400 ml-1">/mês</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Total em Bolsa</span>
                  <span className="text-xs font-semibold text-zinc-300">{formatCurrency(totalStockValue)}</span>
                </div>
              </div>
            </div>

            {/* Lista de Ações e Proventos chegando até as bordas do box externo */}
            <div className="flex-1 border-t border-white/[0.08] overflow-y-auto max-h-[380px] divide-y divide-white/[0.08] bg-[#18142A]/50 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.16)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {stocks.length === 0 ? (
                <div className="text-center py-10 px-5">
                  <LineChart size={32} className="mx-auto text-zinc-500 mb-2" />
                  <p className="text-xs font-medium text-zinc-400">Nenhum ativo cadastrado na bolsa ainda.</p>
                  <p className="text-[11px] text-zinc-500 mt-1">Adicione suas primeiras ações ou FIIs para simular proventos!</p>
                  <button
                    onClick={() => setShowNewStockModal(true)}
                    className="mt-3 min-h-[44px] px-4 py-2 rounded-xl bg-[#10E59B] text-[#0B0914] text-xs font-bold hover:bg-[#0fd08c] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    Adicionar Ação
                  </button>
                </div>
              ) : (
                stocks.map((stock) => {
                  const totalPosition = stock.quantity * stock.currentPrice;
                  const monthlyTotal = stock.quantity * stock.monthlyDividendPerShare;

                  return (
                    <div
                      key={stock.id}
                      className="p-4 sm:px-6 hover:bg-white/[0.02] transition-colors space-y-2.5"
                    >
                      {/* Linha superior: Ticker, Nome, Tipo e Variação + Excluir */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-xs tracking-wider">
                              {stock.ticker}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-zinc-400 font-semibold">
                              {stock.type}
                            </span>
                            <span className="text-[11px] text-zinc-400 truncate">
                              {stock.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {stock.quantity} cotas • {formatCurrency(stock.currentPrice)} (Total: {formatCurrency(totalPosition)})
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-0.5 ${stock.variationPercent >= 0
                                ? "bg-[#10E59B]/10 text-[#10E59B] border-[#10E59B]/25"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                              }`}
                          >
                            {stock.variationPercent >= 0 ? "+" : ""}
                            {stock.variationPercent.toFixed(1)}%
                          </span>
                          <button
                            onClick={() => handleDeleteStock(stock.id, stock.ticker)}
                            title="Remover ativo"
                            className="w-8 h-8 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Box de Provento Mensal em Destaque */}
                      <div className="p-2.5 rounded-xl bg-[#131024] border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-[#10E59B]/15 text-[#10E59B] flex items-center justify-center text-[10px] font-bold">
                            $
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-semibold text-zinc-400 block leading-tight">
                              Provento Mensal
                            </span>
                            <span className="text-[11px] text-zinc-500">
                              {formatCurrency(stock.monthlyDividendPerShare)} por cota
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#10E59B] block">
                            + {formatCurrency(monthlyTotal)}/mês
                          </span>
                          <span className="text-[10px] text-zinc-500">rendimento estimado</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CARD: TOTAL INVESTIDO (ABAIXO DOS COFRINHOS E BOLSA DE VALORES) */}
      <div className="rounded-2xl border border-white/10 bg-[#131024] p-5 sm:p-6 shadow-lg flex flex-col justify-between relative overflow-hidden">
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
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${selectedPeriod === opt.key
                        ? "bg-[#10E59B]/20 text-[#10E59B] font-semibold"
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
              className="w-full h-56 sm:h-64 overflow-visible select-none"
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

            {/* Badge Flutuante no Ponto Terminal ("R$ 4.250,50") */}
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
                  left: `${Math.min(Math.max(coords[hoveredPointIndex].x - 60, 10), Math.max(10, coords[coords.length - 1].x - 120))}px`,
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

        {/* Controles / Indicador de Página no Mobile */}
        <div className="md:hidden flex items-center justify-between px-1">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            {activeSuggestedSlide + 1} de {suggestedInvestments.length} • {suggestedInvestments[activeSuggestedSlide]?.name}
          </span>
          <div className="flex gap-1.5">
            {suggestedInvestments.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSuggestedSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${activeSuggestedSlide === idx ? "bg-[#10E59B] w-6" : "bg-white/20 w-2"
                  }`}
                aria-label={`Ir para ${suggestedInvestments[idx].name}`}
              />
            ))}
          </div>
        </div>

        {/* Carrossel no Mobile & Grid de 3 Colunas no Desktop */}
        <div
          ref={suggestedCarouselRef}
          onScroll={handleSuggestedCarouselScroll}
          className="flex md:grid md:grid-cols-3 overflow-x-auto snap-x snap-mandatory gap-5 pb-2 scrollbar-none"
        >
          {suggestedInvestments.map((asset) => (
            <div
              key={asset.id}
              className="w-full min-w-full sm:min-w-[340px] md:min-w-0 snap-center rounded-2xl border border-white/10 bg-[#1C1733] p-5 shadow-lg flex flex-col justify-between hover:border-white/20 hover:bg-[#231D40] transition-all group relative overflow-hidden shrink-0 md:shrink"
            >
              <div>
                {/* Linha Superior do Card: Ícone e Badge de Risco */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${asset.iconType === "bank"
                      ? "bg-[#10E59B]/10 border border-[#10E59B]/25 text-[#10E59B]"
                      : asset.iconType === "shield"
                        ? "bg-[#9D4EDD]/10 border border-[#9D4EDD]/25 text-[#D6B2FF]"
                        : "bg-[#10E59B]/10 border border-[#10E59B]/25 text-[#10E59B]"
                      }`}
                  >
                    {asset.iconType === "bank" && <Building2 size={20} />}
                    {asset.iconType === "shield" && <ShieldCheck size={20} />}
                    {asset.iconType === "leaf" && <Leaf size={20} />}
                  </div>

                  {/* Badge de Risco */}
                  <span className="bg-[#131024]/80 border border-white/10 text-[11px] font-medium text-zinc-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
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
              <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
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
                  className="w-8 h-8 rounded-full bg-[#131024] group-hover:bg-[#D6B2FF] text-zinc-300 group-hover:text-[#0B0914] border border-white/10 flex items-center justify-center transition-all cursor-pointer shrink-0"
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
                <div className="w-10 h-10 rounded-xl bg-[#10E59B]/10 text-[#10E59B] flex items-center justify-center">
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
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#10E59B] transition-colors"
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
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${simulationMonths === m
                        ? "bg-[#10E59B]/20 border-[#10E59B] text-[#10E59B]"
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
            <div className="bg-[#10E59B]/10 border border-[#10E59B]/25 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#10E59B]" />
                <span className="text-xs text-zinc-200">
                  Ganho adicional em relação à poupança:
                </span>
              </div>
              <span className="text-xs font-bold text-[#10E59B]">
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
                className="px-5 py-2.5 rounded-xl bg-[#10E59B] hover:bg-[#0fd08c] text-[#0B0914] font-bold text-xs transition-colors cursor-pointer shadow-md"
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${catalogFilter === tab.id
                    ? "bg-[#D6B2FF] text-[#0B0914]"
                    : "bg-[#19152B] text-zinc-400 hover:text-white"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Lista com Rolagem */}
            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.16)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {fullCatalog
                .filter((item) =>
                  catalogFilter === "all" ? true : item.categoryType === catalogFilter
                )
                .map((asset) => (
                  <div
                    key={asset.id}
                    className="p-4 rounded-xl bg-[#1C1833] hover:bg-[#231D40] transition-colors border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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

      {/* 6. MODAL: ADICIONAR NOVO COFRINHO / META */}
      {showNewCofrinhoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#131024] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#9D4EDD]/15 text-[#D6B2FF] flex items-center justify-center">
                  <PiggyBank size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Novo Cofrinho
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Cadastre um objetivo com rendimento sobre o CDI/CDB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCofrinhoModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Formulário do Cofrinho */}
            <form onSubmit={handleCreateCofrinho} className="space-y-4">
              {/* Nome */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Nome do cofrinho / meta *
                </label>
                <input
                  type="text"
                  value={newCofrinhoName}
                  onChange={(e) => setNewCofrinhoName(e.target.value)}
                  placeholder="Ex.: Reserva de Emergência, Notebook Novo, Viagem"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF] transition-colors"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Descrição do objetivo
                </label>
                <input
                  type="text"
                  value={newCofrinhoDesc}
                  onChange={(e) => setNewCofrinhoDesc(e.target.value)}
                  placeholder="Ex.: Guardando R$ 200 por mês da bolsa de estudos"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF] transition-colors"
                />
              </div>

              {/* Valor da Meta & Quanto já guardou em 2 colunas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Valor da meta *
                  </label>
                  <input
                    type="text"
                    value={newCofrinhoTarget}
                    onChange={(e) => setNewCofrinhoTarget(e.target.value)}
                    placeholder="R$ 3.000,00"
                    className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Quanto já tem guardado?
                  </label>
                  <input
                    type="text"
                    value={newCofrinhoSaved}
                    onChange={(e) => setNewCofrinhoSaved(e.target.value)}
                    placeholder="R$ 0,00"
                    className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF] transition-colors"
                  />
                </div>
              </div>

              {/* Rendimento do Cofrinho (% do CDI / CDB) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Rendimento do cofrinho (% do CDI / CDB) *
                  </label>
                  <span className="text-[11px] font-bold text-[#10E59B]">
                    {newCofrinhoCdi}% do CDI
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={newCofrinhoCdi}
                    onChange={(e) => setNewCofrinhoCdi(e.target.value)}
                    placeholder="102"
                    className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#D6B2FF] transition-colors pr-10"
                    required
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-semibold">
                    %
                  </span>
                </div>

                {/* Chips de seleção rápida */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] text-zinc-500">Taxas comuns:</span>
                  {[
                    { label: "100% CDI", val: "100" },
                    { label: "102% CDI", val: "102" },
                    { label: "105% CDI", val: "105" },
                    { label: "110% CDI", val: "110" },
                  ].map((chip) => (
                    <button
                      key={chip.val}
                      type="button"
                      onClick={() => setNewCofrinhoCdi(chip.val)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${newCofrinhoCdi === chip.val
                          ? "bg-[#10E59B]/20 border-[#10E59B] text-[#10E59B]"
                          : "bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                        }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewCofrinhoModal(false)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#D6B2FF] hover:bg-[#c79efc] text-[#0B0914] font-bold text-xs transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Criar Cofrinho</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: ADICIONAR NOVA AÇÃO / FII NA BOLSA */}
      {showNewStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#131024] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10E59B]/15 text-[#10E59B] flex items-center justify-center">
                  <LineChart size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Adicionar Ativo à Carteira
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Cadastre ações, FIIs e seus proventos mensais
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewStockModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Formulário do Ativo */}
            <form onSubmit={handleCreateStock} className="space-y-4">
              {/* Ticker & Tipo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Código / Ticker *
                  </label>
                  <input
                    type="text"
                    value={newStockTicker}
                    onChange={(e) => setNewStockTicker(e.target.value)}
                    placeholder="Ex.: ITUB4, MXRF11, PETR4"
                    className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#10E59B] transition-colors uppercase font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Tipo do Ativo
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["Ação", "FII", "ETF"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewStockType(t)}
                        className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${newStockType === t
                            ? "bg-[#10E59B]/20 border-[#10E59B] text-[#10E59B]"
                            : "bg-[#19152B] border-white/10 text-zinc-400 hover:text-white"
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Nome da Empresa / Fundo */}
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-medium block">
                  Nome da Empresa ou Fundo (opcional)
                </label>
                <input
                  type="text"
                  value={newStockName}
                  onChange={(e) => setNewStockName(e.target.value)}
                  placeholder="Ex.: Itaú Unibanco, Maxi Renda"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#10E59B] transition-colors"
                />
              </div>

              {/* Quantidade & Preço da Cotação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Quantidade de cotas/ações *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newStockQty}
                    onChange={(e) => setNewStockQty(e.target.value)}
                    placeholder="10"
                    className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#10E59B] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Cotação Atual (R$) *
                  </label>
                  <input
                    type="text"
                    value={newStockPrice}
                    onChange={(e) => setNewStockPrice(e.target.value)}
                    placeholder="R$ 35,00"
                    className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#10E59B] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Provento Mensal por Cota */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-zinc-400 font-medium block">
                    Provento mensal estimado por cota (R$)
                  </label>
                  <span className="text-[10px] text-[#10E59B] font-semibold">
                    Dividendos / Rendimentos
                  </span>
                </div>
                <input
                  type="text"
                  value={newStockDividend}
                  onChange={(e) => setNewStockDividend(e.target.value)}
                  placeholder="Ex.: 0,45"
                  className="w-full bg-[#19152B] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#10E59B] transition-colors"
                />
                <span className="text-[10px] text-zinc-500 block pt-0.5">
                  Valor em reais que a ação ou FII paga por cota todo mês.
                </span>
              </div>

              {/* Botões de Ação */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewStockModal(false)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#10E59B] hover:bg-[#0fd08c] text-[#0B0914] font-bold text-xs transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus size={16} />
                  <span>Adicionar Ativo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}