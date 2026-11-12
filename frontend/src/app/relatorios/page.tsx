"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  X,
  Printer,
  Share2,
  PieChart,
  TrendingUp,
  FileDown,
  Filter,
} from "lucide-react";

// Tipos e Interfaces
interface ReportItem {
  id: string;
  name: string;
  size: string;
  period: string;
  format: "PDF" | "CSV";
  createdAt: string;
}

interface PeriodMetrics {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  performance: string;
}

export default function RelatoriosPage() {
  // 1. Estados de Período
  const [selectedMonth, setSelectedMonth] = useState("Junho de 2025");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // Métricas por mês selecionado
  const monthData: Record<string, PeriodMetrics> = {
    "Junho de 2025": {
      month: "Junho de 2025",
      income: 1850.0,
      expenses: 1480.0,
      balance: 370.0,
      performance: "+ 8,4%",
    },
    "Maio de 2025": {
      month: "Maio de 2025",
      income: 1850.0,
      expenses: 1510.0,
      balance: 340.0,
      performance: "+ 6,8%",
    },
    "Abril de 2025": {
      month: "Abril de 2025",
      income: 1800.0,
      expenses: 1425.0,
      balance: 375.0,
      performance: "+ 9,2%",
    },
  };

  const currentMetrics = monthData[selectedMonth] || monthData["Junho de 2025"];

  // 2. Histórico de Relatórios Recentes
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: "rep-1",
      name: "Relatório mensal — Maio 2025",
      size: "1,2 MB",
      period: "01 mai — 31 mai 2025",
      format: "PDF",
      createdAt: "02 jun 2025",
    },
    {
      id: "rep-2",
      name: "Movimentações — Abril 2025",
      size: "84 KB",
      period: "01 abr — 30 abr 2025",
      format: "CSV",
      createdAt: "03 mai 2025",
    },
    {
      id: "rep-3",
      name: "Relatório mensal — Abril 2025",
      size: "960 KB",
      period: "01 abr — 30 abr 2025",
      format: "PDF",
      createdAt: "02 mai 2025",
    },
    {
      id: "rep-4",
      name: "Demonstrativo Anual — 2024",
      size: "3,8 MB",
      period: "01 jan — 31 dez 2024",
      format: "PDF",
      createdAt: "10 jan 2025",
    },
  ]);

  // 3. Modais e Toasts
  const [showPdfPreviewModal, setShowPdfPreviewModal] = useState(false);
  const [showAllReportsModal, setShowAllReportsModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"all" | "PDF" | "CSV">("all");
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

  // 4. Função Real de Download do Arquivo CSV
  const handleDownloadCsv = (reportName = `extrato-manns-${selectedMonth.toLowerCase().replace(/ /g, "-")}.csv`) => {
    const csvContent =
      "Data;Descricao;Categoria;Tipo;Valor (BRL)\n" +
      "18/06/2025;Supermercado & Feira;Alimentacao;Despesa;-146.32\n" +
      "15/06/2025;Bolsa de Estagio;Receita Fixa;Receita;1200.00\n" +
      "10/06/2025;Quarto em Republica;Moradia;Despesa;-680.00\n" +
      "08/06/2025;Auxilio Permanencia;Receita Fixa;Receita;650.00\n" +
      "05/06/2025;Passe de Onibus Estudantil;Transporte;Despesa;-95.00\n" +
      "03/06/2025;Xerox e Livros Academicos;Estudos;Despesa;-68.50\n" +
      "02/06/2025;Restaurante Universitario;Alimentacao;Despesa;-42.00\n";

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", reportName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Arquivo CSV "${reportName}" gerado e baixado com sucesso!`);
  };

  // Ação de Download de PDF Simulado
  const handleDownloadPdf = (reportName: string) => {
    showToast(`Download de "${reportName}" iniciado!`);
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 pb-16 select-none relative">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1A162B] border border-[#FF85A1]/40 text-white px-4 py-3 rounded-xl shadow-2xl shadow-pink-950/60 transition-all animate-bounce">
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
            Central Financeira
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Exportar e relatórios
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Organize seus dados e leve sua vida financeira com você.
          </p>
        </div>

        {/* Seletor de Período Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
            className="bg-[#131024] border border-white/10 hover:border-white/20 text-zinc-200 px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Calendar size={15} className="text-zinc-400" />
            <span>{selectedMonth}</span>
            <ChevronDown
              size={14}
              className={`text-zinc-400 transition-transform duration-200 ${
                isMonthDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMonthDropdownOpen && (
            <div className="absolute right-0 top-12 w-48 bg-[#131024] border border-white/10 rounded-xl p-1.5 shadow-2xl z-40">
              {["Junho de 2025", "Maio de 2025", "Abril de 2025"].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedMonth(m);
                    setIsMonthDropdownOpen(false);
                    showToast(`Métricas atualizadas para ${m}.`);
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
      </header>

      {/* 2. MÉTRICAS CONSOLIDADAS (LINHA SUPERIOR) */}
      <div className="rounded-2xl border border-white/5 bg-[#131024] p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {/* Total de Receitas */}
          <div className="flex items-center">
            <span className="w-2 h-10 rounded-full bg-[#10E59B] shrink-0 mr-4 shadow-[0_0_10px_rgba(16,229,155,0.4)]" />
            <div>
              <span className="text-xs text-zinc-400 font-medium block">Total de Receitas</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 block">
                {formatCurrency(currentMetrics.income)}
              </span>
            </div>
          </div>

          {/* Total de Despesas */}
          <div className="flex items-center pt-4 md:pt-0 md:pl-6">
            <span className="w-2 h-10 rounded-full bg-[#FF85A1] shrink-0 mr-4 shadow-[0_0_10px_rgba(255,133,161,0.4)]" />
            <div>
              <span className="text-xs text-zinc-400 font-medium block">Total de Despesas</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 block">
                {formatCurrency(currentMetrics.expenses)}
              </span>
            </div>
          </div>

          {/* Saldo Final com Badge */}
          <div className="flex items-center justify-between pt-4 md:pt-0 md:pl-6">
            <div className="flex items-center">
              <span className="w-2 h-10 rounded-full bg-[#D6B2FF] shrink-0 mr-4 shadow-[0_0_10px_rgba(214,178,255,0.4)]" />
              <div>
                <span className="text-xs text-zinc-400 font-medium block">Saldo Final</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5 block">
                  {formatCurrency(currentMetrics.balance)}
                </span>
              </div>
            </div>

            <span className="bg-[#10E59B]/15 text-[#10E59B] border border-[#10E59B]/25 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
              {currentMetrics.performance}
            </span>
          </div>
        </div>
      </div>

      {/* 3. EXPORTAÇÃO RÁPIDA (CARDS DE PDF & CSV) */}
      <section className="space-y-5 pt-2">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block">
            Exportação Rápida
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Como você quer seus dados?
          </h2>
          <p className="text-xs text-zinc-400">
            Escolha o formato ideal para visualizar ou analisar suas finanças.
          </p>
        </div>

        {/* 2 Grandes Cards de Ação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Card: Baixar PDF */}
          <div
            onClick={() => setShowPdfPreviewModal(true)}
            className="rounded-2xl border border-[#9D4EDD]/25 bg-gradient-to-r from-[#1A142D] to-[#141026] p-5 sm:p-6 shadow-lg flex items-center justify-between hover:border-[#9D4EDD]/50 hover:bg-[#1E1736] transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#9D4EDD]/20 border border-[#9D4EDD]/30 text-[#D6B2FF] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-[#D6B2FF] transition-colors">
                  Baixar PDF
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Relatório visual completo</p>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#D6B2FF] text-zinc-400 group-hover:text-[#0B0914] border border-white/5 flex items-center justify-center transition-all shrink-0">
              <Download size={18} />
            </div>
          </div>

          {/* Card: Exportar CSV */}
          <div
            onClick={() => handleDownloadCsv()}
            className="rounded-2xl border border-[#10E59B]/25 bg-gradient-to-r from-[#102420] to-[#0E1A18] p-5 sm:p-6 shadow-lg flex items-center justify-between hover:border-[#10E59B]/50 hover:bg-[#142C27] transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10E59B]/20 border border-[#10E59B]/30 text-[#4DE8B3] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                <FileSpreadsheet size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-[#4DE8B3] transition-colors">
                  Exportar CSV
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Dados prontos para planilhas</p>
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-white/5 group-hover:bg-[#4DE8B3] text-zinc-400 group-hover:text-[#0B0914] border border-white/5 flex items-center justify-center transition-all shrink-0">
              <Download size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. HISTÓRICO: RELATÓRIOS RECENTES */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block mb-0.5">
              Histórico
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">Relatórios Recentes</h2>
          </div>

          <button
            type="button"
            onClick={() => setShowAllReportsModal(true)}
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Ver todos</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Tabela do Histórico */}
        <div className="rounded-2xl border border-white/5 bg-[#131024] p-5 shadow-lg overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="pb-3 pl-2">Arquivo</th>
                <th className="pb-3">Período</th>
                <th className="pb-3 text-center sm:text-left">Formato</th>
                <th className="pb-3 hidden sm:table-cell">Criado em</th>
                <th className="pb-3 pr-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {reports.slice(0, 3).map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  onClick={() => {
                    if (item.format === "PDF") {
                      setShowPdfPreviewModal(true);
                    } else {
                      handleDownloadCsv(item.name.toLowerCase().replace(/ /g, "-") + ".csv");
                    }
                  }}
                >
                  {/* Arquivo */}
                  <td className="py-4 pl-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          item.format === "PDF"
                            ? "bg-[#9D4EDD]/15 text-[#D6B2FF] border border-[#9D4EDD]/25"
                            : "bg-[#10E59B]/15 text-[#4DE8B3] border border-[#10E59B]/25"
                        }`}
                      >
                        {item.format === "PDF" ? <FileText size={18} /> : <FileSpreadsheet size={18} />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-[#D6B2FF] transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-[10px] text-zinc-500">{item.size}</span>
                      </div>
                    </div>
                  </td>

                  {/* Período */}
                  <td className="py-4 text-zinc-400 font-medium">{item.period}</td>

                  {/* Formato */}
                  <td className="py-4 text-center sm:text-left">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.format === "PDF"
                          ? "bg-[#9D4EDD]/20 text-[#D6B2FF] border border-[#9D4EDD]/30"
                          : "bg-[#10E59B]/20 text-[#4DE8B3] border border-[#10E59B]/30"
                      }`}
                    >
                      {item.format}
                    </span>
                  </td>

                  {/* Criado em */}
                  <td className="py-4 text-zinc-400 hidden sm:table-cell">{item.createdAt}</td>

                  {/* Botão de Download */}
                  <td className="py-4 pr-2 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.format === "PDF") {
                          handleDownloadPdf(item.name);
                        } else {
                          handleDownloadCsv(item.name.toLowerCase().replace(/ /g, "-") + ".csv");
                        }
                      }}
                      className="text-zinc-500 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer inline-flex"
                      title={`Baixar ${item.name}`}
                    >
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. MODAL: PREVIEW DO RELATÓRIO PDF */}
      {showPdfPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#131024] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Topo do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#9D4EDD]/15 text-[#D6B2FF] flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Demonstrativo Financeiro — {selectedMonth}
                  </h3>
                  <p className="text-xs text-zinc-400">Pré-visualização do relatório consolidado</p>
                </div>
              </div>
              <button
                onClick={() => setShowPdfPreviewModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo do Demonstrativo Impresso (Simulação de Página A4) */}
            <div className="overflow-y-auto space-y-5 pr-2 flex-1 bg-[#19152B] border border-white/5 rounded-xl p-5 sm:p-6 text-xs text-zinc-300">
              {/* Cabeçalho do Documento */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h4 className="text-base font-extrabold text-white tracking-wider">
                    MANNS FINANCE
                  </h4>
                  <span className="text-[10px] text-zinc-400 block">
                    Arthur Mendes • Ciência da Computação (UFC)
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-white block">Extrato Estudantil Consolidado</span>
                  <span className="text-[10px] text-zinc-500">
                    Gerado em 20 de outubro de 2026
                  </span>
                </div>
              </div>

              {/* Tabela de Balanço */}
              <div className="grid grid-cols-3 gap-3 text-center py-2">
                <div className="bg-[#131024] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">
                    Receitas
                  </span>
                  <span className="text-sm font-bold text-[#4DE8B3] mt-0.5 block">
                    {formatCurrency(currentMetrics.income)}
                  </span>
                </div>
                <div className="bg-[#131024] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">
                    Despesas
                  </span>
                  <span className="text-sm font-bold text-[#FF85A1] mt-0.5 block">
                    {formatCurrency(currentMetrics.expenses)}
                  </span>
                </div>
                <div className="bg-[#131024] p-3 rounded-xl border border-white/5">
                  <span className="text-[10px] text-zinc-400 block uppercase font-medium">
                    Saldo Líquido
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    {formatCurrency(currentMetrics.balance)}
                  </span>
                </div>
              </div>

              {/* Detalhamento por Categorias */}
              <div className="space-y-2 pt-2">
                <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                  Despesas por Categoria
                </h5>
                <div className="space-y-1.5">
                  {[
                    { name: "Moradia (República)", amount: 680.0, percent: "46,0%" },
                    { name: "Alimentação (RU & Feira)", amount: 385.0, percent: "26,0%" },
                    { name: "Estudos & Cópias", amount: 145.0, percent: "10,0%" },
                    { name: "Transporte Estudantil", amount: 130.0, percent: "9,0%" },
                    { name: "Lazer & Outros", amount: 140.0, percent: "9,0%" },
                  ].map((cat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#131024] text-[11px]"
                    >
                      <span className="text-zinc-200">{cat.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-zinc-400">{cat.percent}</span>
                        <span className="font-semibold text-white">
                          {formatCurrency(cat.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ações do Modal */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Formato: PDF / Pronto para impressão</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadPdf(`relatorio-manns-${selectedMonth.toLowerCase().replace(/ /g, "-")}.pdf`);
                    setShowPdfPreviewModal(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#D6B2FF] hover:bg-[#c79efc] text-[#0B0914] font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download size={14} />
                  <span>Baixar Arquivo PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: TODOS OS RELATÓRIOS DO HISTÓRICO */}
      {showAllReportsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Histórico Completo de Exportações
                </h3>
                <p className="text-xs text-zinc-400">Todos os demonstrativos gerados</p>
              </div>
              <button
                onClick={() => setShowAllReportsModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filtros */}
            <div className="flex items-center gap-2">
              {(["all", "PDF", "CSV"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setHistoryFilter(fmt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    historyFilter === fmt
                      ? "bg-[#D6B2FF] text-[#0B0914]"
                      : "bg-[#19152B] text-zinc-400 hover:text-white"
                  }`}
                >
                  {fmt === "all" ? "Todos os formatos" : fmt}
                </button>
              ))}
            </div>

            {/* Lista com Rolagem */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {reports
                .filter((r) => (historyFilter === "all" ? true : r.format === historyFilter))
                .map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl bg-[#19152B] hover:bg-[#1e1933] border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          r.format === "PDF"
                            ? "bg-[#9D4EDD]/15 text-[#D6B2FF]"
                            : "bg-[#10E59B]/15 text-[#4DE8B3]"
                        }`}
                      >
                        {r.format === "PDF" ? <FileText size={16} /> : <FileSpreadsheet size={16} />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{r.name}</h4>
                        <span className="text-[10px] text-zinc-500">
                          {r.period} • {r.size}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-zinc-400 hidden sm:inline">
                        {r.createdAt}
                      </span>
                      <button
                        onClick={() => {
                          if (r.format === "PDF") {
                            handleDownloadPdf(r.name);
                          } else {
                            handleDownloadCsv(r.name.toLowerCase().replace(/ /g, "-") + ".csv");
                          }
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Baixar arquivo"
                      >
                        <Download size={14} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAllReportsModal(false)}
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