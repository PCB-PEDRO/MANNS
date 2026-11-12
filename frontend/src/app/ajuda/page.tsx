"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  HelpCircle,
  Compass,
  CalendarCheck,
  TrendingUp,
  GraduationCap,
  BookOpen,
  FileText,
  ShieldCheck,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  MessageSquare,
  LifeBuoy,
  Send,
  X,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Headphones,
  FileQuestion,
  CheckCircle2,
} from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "geral" | "planejamento" | "investimentos" | "hub-academico" | "educacao" | "relatorios" | "seguranca";
  categoryLabel: string;
  categoryColor: string;
  routeLink: string;
  routeLabel: string;
  tags: string[];
}

const FAQ_DATABASE: FaqItem[] = [
  // 1. Geral & Primeiros Passos
  {
    id: "saldo-consolidado",
    question: "Como o saldo total consolidado é calculado no painel principal?",
    answer:
      "O Saldo Total exibido na tela inicial (Visão Geral) é a soma aritmética em tempo real dos saldos disponíveis em todas as suas contas bancárias ativas e conectadas (Nubank, Banco Inter e C6 Bank), somadas às reservas manuais cadastradas. Caso você oculte valores nas preferências, o total passa a exibir '***' para preservar sua privacidade no campus.",
    category: "geral",
    categoryLabel: "Geral & Contas",
    categoryColor: "#4DE8B3",
    routeLink: "/",
    routeLabel: "Ir para a Visão Geral",
    tags: ["saldo", "contas", "nubank", "inter", "c6", "visão geral"],
  },
  {
    id: "despesas-dinheiro",
    question: "Posso cadastrar transações em dinheiro físico ou de contas não conectadas?",
    answer:
      "Sim! No canto superior direito da tela de Visão Geral, você encontra os botões '+ Adicionar Receita' e '- Adicionar Despesa'. Ao criar uma transação, você pode selecionar 'Dinheiro vivo / Carteira' como origem de pagamento, informando valor, categoria orçamentária e observações.",
    category: "geral",
    categoryLabel: "Geral & Contas",
    categoryColor: "#4DE8B3",
    routeLink: "/",
    routeLabel: "Cadastrar na Visão Geral",
    tags: ["dinheiro", "carteira", "adicionar despesa", "receita manual"],
  },
  {
    id: "orcamento-restante",
    question: "Como funciona a barra de 'Orçamento Restante' por categoria?",
    answer:
      "As barras de Orçamento Restante calculam a proporção entre o teto estabelecido para o mês (ex: R$ 450 para Mercado) e o total já debitado em transações dessa categoria. Quando seus gastos ultrapassam 80% da meta, a barra ganha um aviso âmbar; se ultrapassar 100%, um alerta visual neon destaca a necessidade de remanejamento.",
    category: "geral",
    categoryLabel: "Geral & Contas",
    categoryColor: "#4DE8B3",
    routeLink: "/",
    routeLabel: "Ver Orçamento na Visão Geral",
    tags: ["orçamento", "limite", "categoria", "mercado", "lazer"],
  },

  // 2. Planejamento Financeiro
  {
    id: "confirmado-vs-estimado",
    question: "Qual é a diferença entre contas 'Confirmadas' e 'Estimadas' no Planejamento?",
    answer:
      "Contas 'Confirmadas' são compromissos contratuais de valor exato e fixo (como o aluguel da república ou o plano de internet). Já as 'Estimadas' são despesas variáveis previsíveis (como a conta de luz compartilhada ou a compra de livros semestrais). Você pode alternar o status de qualquer conta com um único clique no badge correspondente para refinar sua projeção de saldo.",
    category: "planejamento",
    categoryLabel: "Planejamento",
    categoryColor: "#D6B2FF",
    routeLink: "/planejamento",
    routeLabel: "Acessar Planejamento",
    tags: ["confirmado", "estimado", "previsão", "planejamento", "próximo mês"],
  },
  {
    id: "adicionar-fixas",
    question: "Como adicionar novas despesas e receitas fixas mensais?",
    answer:
      "Na tela de Planejamento, utilize os cards rápidos de 'Receitas Fixas' e 'Despesas Fixas'. Basta preencher a descrição, o valor mensal em Reais e o dia de vencimento, e clicar em '+ Salvar'. O sistema recalcula instantaneamente os totais mensais e atualiza o gráfico de rosca de distribuição de renda.",
    category: "planejamento",
    categoryLabel: "Planejamento",
    categoryColor: "#D6B2FF",
    routeLink: "/planejamento",
    routeLabel: "Gerenciar Despesas Fixas",
    tags: ["fixas", "aluguel", "salário", "vencimento", "adicionar"],
  },
  {
    id: "grafico-evolucao",
    question: "Como interpretar o gráfico de barras de 'Evolução por Categoria'?",
    answer:
      "O gráfico compara três grandezas essenciais para cada área (Moradia, Alimentação, Estudos, Lazer): o seu Gasto Atual acumulado (barra lilás), a Meta estipulada no planejamento (linha pontilhada guia) e o Gasto do Mês Passado (barra translúcida). Passar o cursor sobre as barras revela um tooltip com a variação percentual exata.",
    category: "planejamento",
    categoryLabel: "Planejamento",
    categoryColor: "#D6B2FF",
    routeLink: "/planejamento",
    routeLabel: "Ver Gráfico de Evolução",
    tags: ["gráfico", "evolução", "metas", "comparativo", "barras"],
  },

  // 3. Investimentos
  {
    id: "manns-corretora",
    question: "O MANNS é uma corretora de valores ou apenas um consolidador?",
    answer:
      "O MANNS é uma plataforma de gestão financeira inteligente e consolidação de patrimônio. Nós não realizamos custódia nem executamos ordens de compra e venda diretamente. Você utiliza o MANNS para simular rentabilidades, acompanhar metas de economia e registrar aplicações feitas em suas corretoras parceiras (como NuInvest, Inter Invest ou Tesouro Direto).",
    category: "investimentos",
    categoryLabel: "Investimentos",
    categoryColor: "#00E5FF",
    routeLink: "/investimentos",
    routeLabel: "Ver Painel de Investimentos",
    tags: ["corretora", "custódia", "simulador", "investimentos", "metas"],
  },
  {
    id: "reserva-estudantil",
    question: "Qual investimento sugerido é ideal para a reserva de emergência estudantil?",
    answer:
      "Para estudantes, a prioridade máxima da reserva é a liquidez diária (possibilidade de resgatar no mesmo dia em caso de imprevistos com matrícula, moradia ou saúde) e baixíssimo risco. Recomendamos opções como o CDB 102% CDI com Liquidez Diária ou o Tesouro Selic 2029, ambos com cobertura do FGC ou garantia soberana do Tesouro Nacional.",
    category: "investimentos",
    categoryLabel: "Investimentos",
    categoryColor: "#00E5FF",
    routeLink: "/investimentos",
    routeLabel: "Simular na Tela de Investimentos",
    tags: ["reserva de emergência", "cdb", "selic", "liquidez diária", "risco"],
  },
  {
    id: "metas-financeiras",
    question: "Como criar uma meta financeira e acompanhar o progresso?",
    answer:
      "No card 'Novas Metas' da tela de Investimentos, informe o nome do seu objetivo (ex: 'Notebook para Engenharia', 'Formatura', 'Intercâmbio'), o montante total necessário, a data desejada e quanto você já guardou. A plataforma calcula o aporte mensal necessário e plota uma barra de progresso luminosa.",
    category: "investimentos",
    categoryLabel: "Investimentos",
    categoryColor: "#00E5FF",
    routeLink: "/investimentos",
    routeLabel: "Criar Nova Meta",
    tags: ["metas", "objetivos", "notebook", "formatura", "progresso"],
  },

  // 4. Hub Acadêmico
  {
    id: "bolsa-permanencia",
    question: "Como o MANNS calcula a contagem regressiva para a Bolsa de Permanência?",
    answer:
      "O card 'Dias para a Bolsa' no Hub Acadêmico sincroniza com o calendário oficial de pagamentos de auxílios e bolsas da universidade (Bolsa Permanência, PAPE, FAPESP, PIBIC ou Monitoria). A data base é parametrizada no seu perfil e desconta finais de semana e feriados bancários para prever com precisão o dia do crédito em conta.",
    category: "hub-academico",
    categoryLabel: "Hub Acadêmico",
    categoryColor: "#FFD166",
    routeLink: "/hub-academico",
    routeLabel: "Consultar Bolsa no Hub",
    tags: ["bolsa", "permanência", "pape", "pibic", "pagamento", "campus"],
  },
  {
    id: "recarga-ru",
    question: "Como funciona a recarga rápida de créditos do Restaurante Universitário (RU)?",
    answer:
      "O card do RU exibe a quantidade atual de refeições disponíveis na sua carteirinha digital. Clicando em 'Recarregar', você pode escolher pacotes pré-configurados (+5, +10 ou +20 refeições a R$ 3,50 cada) e simular o débito automático na sua conta universitária com atualização instantânea do saldo de tickets.",
    category: "hub-academico",
    categoryLabel: "Hub Acadêmico",
    categoryColor: "#FFD166",
    routeLink: "/hub-academico",
    routeLabel: "Recarregar RU no Hub",
    tags: ["ru", "bandejão", "refeições", "recarga", "carteirinha"],
  },
  {
    id: "renovacao-biblioteca",
    question: "A renovação de livros da biblioteca com 1 clique possui restrições?",
    answer:
      "Sim. Você pode renovar livros emprestados com 1 clique pelo MANNS (adicionando +7 dias ao prazo), contanto que a obra não esteja com reservas solicitadas por outros alunos no sistema Pergamum/Sophia da faculdade e que você não possua multas pendentes.",
    category: "hub-academico",
    categoryLabel: "Hub Acadêmico",
    categoryColor: "#FFD166",
    routeLink: "/hub-academico",
    routeLabel: "Ver Empréstimos no Hub",
    tags: ["biblioteca", "livros", "renovação", "pergamum", "multa"],
  },

  // 5. Educação Financeira
  {
    id: "artigos-cientificos",
    question: "Qual é a base metodológica dos artigos do feed de Educação Financeira?",
    answer:
      "Diferente de conteúdos genéricos da internet, os artigos do MANNS são sínteses de pesquisas acadêmicas reais em Economia Comportamental, Finanças Pessoais e Microeconomia Universitária (pesquisas de Kahneman, Thaler, Ariely e departamentos de economia). Cada artigo acompanha resumo científico, plano de ação prático e citação ABNT com DOI oficial.",
    category: "educacao",
    categoryLabel: "Educação Financeira",
    categoryColor: "#A8F45D",
    routeLink: "/educacao",
    routeLabel: "Explorar Artigos Científicos",
    tags: ["artigos", "economia comportamental", "abnt", "doi", "estudos"],
  },
  {
    id: "regra-50-30-20",
    question: "Como adaptar a regra 50/30/20 se a minha renda estudantil for variável?",
    answer:
      "Na tela de Educação Financeira temos um guia prático em formato de Dica Rápida explicando como flexibilizar a proporção: priorize 60% para necessidades imediatas (moradia compartilhada e alimentação no RU), 20% para flexibilidade acadêmica (cópias, livros e transporte) e 20% para a reserva de transição para o mercado de trabalho.",
    category: "educacao",
    categoryLabel: "Educação Financeira",
    categoryColor: "#A8F45D",
    routeLink: "/educacao",
    routeLabel: "Ver Dicas Rápidas de 60s",
    tags: ["50-30-20", "orçamento", "renda variável", "dicas", "educação"],
  },

  // 6. Relatórios & Comprovações
  {
    id: "comprovacao-edital",
    question: "O relatório gerado pelo MANNS serve para comprovação de renda em editais?",
    answer:
      "O 'Demonstrativo Consolidado' exportado em PDF pelo MANNS reúne o extrato categorizado de receitas, despesas essenciais e histórico de saldos com formatação analítica. Ele é amplamente utilizado por estudantes para organizar a documentação exigida em editais de Assistência Estudantil, PRAE e seleção de moradia universitária.",
    category: "relatorios",
    categoryLabel: "Relatórios & Exportação",
    categoryColor: "#FF85A1",
    routeLink: "/relatorios",
    routeLabel: "Gerar Relatório em PDF",
    tags: ["edital", "permanência", "prae", "comprovação", "pdf"],
  },
  {
    id: "exportar-csv",
    question: "Qual a diferença entre a exportação em CSV e o demonstrativo PDF?",
    answer:
      "A exportação em CSV gera um arquivo de planilha estruturado com colunas separadas por ponto-e-vírgula (data, descrição, categoria, tipo, valor e status), ideal para abrir no Excel ou Google Planilhas. Já o PDF é um documento diagramado, assinado e pronto para impressão ou envio por e-mail.",
    category: "relatorios",
    categoryLabel: "Relatórios & Exportação",
    categoryColor: "#FF85A1",
    routeLink: "/relatorios",
    routeLabel: "Exportar Planilha CSV",
    tags: ["csv", "excel", "planilha", "download", "relatórios"],
  },

  // 7. Segurança & Configurações
  {
    id: "open-finance-seguranca",
    question: "O MANNS pode movimentar dinheiro da minha conta bancária via Open Finance?",
    answer:
      "Absolutamente não! O Open Finance regulamentado pelo Banco Central do Brasil opera sob consentimento estrito de 'Somente Leitura' (Read-Only). O MANNS não possui permissão para realizar transferências, pagamentos Pix ou investimentos. Você pode revogar o consentimento a qualquer momento na aba Open Finance das Configurações.",
    category: "seguranca",
    categoryLabel: "Segurança & Conta",
    categoryColor: "#A8F45D",
    routeLink: "/configuracoes",
    routeLabel: "Configurações de Open Finance",
    tags: ["open finance", "banco central", "segurança", "leitura", "pix"],
  },
  {
    id: "modo-foco-academico",
    question: "O que é o Modo Foco Acadêmico e o que ele altera na plataforma?",
    answer:
      "O Modo Foco Acadêmico (ativável na aba Preferências) foi desenvolvido para períodos de provas semestrais. Quando ativado, o sistema simplifica as métricas da Visão Geral, oculta flutuações de investimentos diários para diminuir a ansiedade e prioriza os prazos de devolução da biblioteca e dias para a bolsa de estudos.",
    category: "seguranca",
    categoryLabel: "Segurança & Conta",
    categoryColor: "#A8F45D",
    routeLink: "/configuracoes",
    routeLabel: "Ativar Modo Foco",
    tags: ["modo foco", "provas", "ansiedade", "preferências", "estudos"],
  },
  {
    id: "2fa-seguranca",
    question: "Como configurar a Autenticação em 2 Fatores (2FA)?",
    answer:
      "Acesse a aba 'Segurança & LGPD' nas Configurações. Clicando em 'Configurar 2FA', você verá um QR Code compatível com Google Authenticator, Authy ou Microsoft Authenticator, acompanhado de uma chave mestra de recuperação de emergência.",
    category: "seguranca",
    categoryLabel: "Segurança & Conta",
    categoryColor: "#A8F45D",
    routeLink: "/configuracoes",
    routeLabel: "Configurar 2FA nas Configurações",
    tags: ["2fa", "dois fatores", "segurança", "authenticator", "qr code"],
  },
];

const CATEGORIES = [
  { id: "todos", label: "Todas as Dúvidas", icon: HelpCircle, color: "#9D4EDD" },
  { id: "geral", label: "Visão Geral & Contas", icon: Compass, color: "#4DE8B3" },
  { id: "planejamento", label: "Planejamento Financeiro", icon: CalendarCheck, color: "#D6B2FF" },
  { id: "investimentos", label: "Investimentos & Metas", icon: TrendingUp, color: "#00E5FF" },
  { id: "hub-academico", label: "Hub Acadêmico (RU/Livros)", icon: GraduationCap, color: "#FFD166" },
  { id: "educacao", label: "Educação & Artigos", icon: BookOpen, color: "#A8F45D" },
  { id: "relatorios", label: "Relatórios & Exportação", icon: FileText, color: "#FF85A1" },
  { id: "seguranca", label: "Segurança & Open Finance", icon: ShieldCheck, color: "#10E59B" },
];

const QUICK_TAGS = [
  "Bolsa permanência",
  "Renovação biblioteca",
  "Open Finance",
  "Recarga RU",
  "Modo Foco",
  "Exportar PDF",
  "Confirmado vs Estimado",
  "Reserva de emergência",
];

export default function AjudaPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [openFaqId, setOpenFaqId] = useState<string | null>("saldo-consolidado");
  const [feedbackVotes, setFeedbackVotes] = useState<Record<string, "yes" | "no">>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modais de suporte
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // Estado do formulário de Ticket
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketCategory, setTicketCategory] = useState("Dúvida Geral");
  const [ticketPriority, setTicketPriority] = useState<"baixa" | "normal" | "alta">("normal");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSuccessProtocol, setTicketSuccessProtocol] = useState<string | null>(null);

  // Estado do Chat Inteligente
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: "bot" | "user"; text: string; time: string; link?: { url: string; label: string } }>
  >([
    {
      id: "msg-1",
      sender: "bot",
      text: "Olá, estudante! Sou o Assistente Virtual do MANNS. Em que posso te ajudar hoje?",
      time: "Agora",
    },
    {
      id: "msg-2",
      sender: "bot",
      text: "Você pode me perguntar sobre recarga do RU, renovação de livros, conexão bancária ou como gerar seu comprovante de renda.",
      time: "Agora",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Filtro de FAQs reativo
  const filteredFaqs = useMemo(() => {
    return FAQ_DATABASE.filter((item) => {
      const matchesCategory = selectedCategory === "todos" || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase().trim();
      const inQuestion = item.question.toLowerCase().includes(query);
      const inAnswer = item.answer.toLowerCase().includes(query);
      const inTags = item.tags.some((tag) => tag.toLowerCase().includes(query));

      return inQuestion || inAnswer || inTags;
    });
  }, [searchQuery, selectedCategory]);

  const toggleAccordion = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleVote = (id: string, vote: "yes" | "no") => {
    setFeedbackVotes((prev) => ({
      ...prev,
      [id]: vote,
    }));
  };

  const handleCopyLink = (id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/ajuda#${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    // Gera protocolo com base em timestamp
    const randomProtocol = `MNS-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketSuccessProtocol(randomProtocol);
  };

  const handleResetTicketModal = () => {
    setTicketSubject("");
    setTicketMessage("");
    setTicketSuccessProtocol(null);
    setIsTicketModalOpen(false);
  };

  const handleSendChatMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user" as const,
      text: textToSend,
      time: "Agora",
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customText) setChatInput("");

    // Resposta inteligente simulada
    setTimeout(() => {
      let botReply =
        "Entendido! Analisei sua dúvida. Você pode conferir mais detalhes diretamente nas opções do menu lateral do MANNS ou abrir um ticket com nosso suporte humano.";
      let botLink: { url: string; label: string } | undefined = undefined;

      const lower = textToSend.toLowerCase();

      if (lower.includes("ru") || lower.includes("restaurante") || lower.includes("bandejão")) {
        botReply =
          "Para verificar suas refeições ou adicionar mais créditos de restaurante, acesse o card do Restaurante Universitário no Hub Acadêmico.";
        botLink = { url: "/hub-academico", label: "Abrir Hub Acadêmico" };
      } else if (lower.includes("livro") || lower.includes("biblioteca") || lower.includes("renov")) {
        botReply =
          "Você pode renovar seus empréstimos ativos com 1 clique (+7 dias) na seção Status da Biblioteca no Hub Acadêmico.";
        botLink = { url: "/hub-academico", label: "Renovar Empréstimos" };
      } else if (lower.includes("bolsa") || lower.includes("permanencia") || lower.includes("pape")) {
        botReply =
          "A contagem regressiva para o próximo crédito da sua Bolsa de Permanência é atualizada diariamente no Hub Acadêmico.";
        botLink = { url: "/hub-academico", label: "Ver Calendário da Bolsa" };
      } else if (lower.includes("open finance") || lower.includes("banco") || lower.includes("nubank") || lower.includes("inter")) {
        botReply =
          "Seus dados bancários estão protegidos com criptografia ponta a ponta e acesso somente-leitura. Gerencie suas conexões nas Configurações.";
        botLink = { url: "/configuracoes", label: "Gerenciar Open Finance" };
      } else if (lower.includes("relatorio") || lower.includes("pdf") || lower.includes("comprovante")) {
        botReply =
          "Você pode gerar um Demonstrativo Consolidado em PDF ou exportar uma planilha CSV das suas finanças na Central de Relatórios.";
        botLink = { url: "/relatorios", label: "Ir para Relatórios" };
      } else if (lower.includes("investir") || lower.includes("reserva") || lower.includes("meta")) {
        botReply =
          "Utilize o Simulador de Rendimento vs Poupança e acompanhe suas metas universitárias no painel de Investimentos.";
        botLink = { url: "/investimentos", label: "Acessar Investimentos" };
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: botReply,
          time: "Agora",
          link: botLink,
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. HERO SECTION & BUSCA INTELIGENTE */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#1A162B] via-[#131024] to-[#0D0B18] p-6 sm:p-10 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#9D4EDD]/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-[#00E5FF]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#D6B2FF] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              CENTRAL DE AJUDA & CONHECIMENTO MANNS
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Como podemos te ajudar hoje?
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Tire dúvidas sobre gestão orçamentária, auxílios estudantis, RU, empréstimos da biblioteca,
            investimentos e segurança da sua conta.
          </p>

          {/* Campo de Busca em Tempo Real */}
          <div className="pt-4">
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-[#D6B2FF] transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Busque por termos como 'bolsa', 'recarga RU', 'open finance', 'PDF'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-[#0B0914]/90 border border-white/10 group-focus-within:border-[#9D4EDD] focus:ring-4 focus:ring-[#9D4EDD]/20 rounded-2xl text-sm sm:text-base text-white placeholder-zinc-500 transition-all outline-none shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                  aria-label="Limpar busca"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Pílulas de Busca Rápida */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-1">
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Dúvidas frequentes:
              </span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                    setSelectedCategory("todos");
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-white/5 bg-[#19152B] text-zinc-400 hover:text-white hover:border-[#D6B2FF]/40 hover:bg-[#1C1832] transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Indicador de Status dos Serviços */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400 max-w-4xl mx-auto">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10E59B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10E59B]"></span>
            </span>
            <span className="font-medium text-zinc-300">Sistemas do MANNS 100% Operacionais</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#4DE8B3]" /> Conexão Bancária (Open Finance)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD166]" /> Gateway RU & Biblioteca
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF85A1]" /> Motor de Relatórios
            </span>
          </div>
        </div>
      </section>

      {/* 2. CANAIS DE ATENDIMENTO RÁPIDO (CARDS DE DESTAQUE) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Assistente Virtual */}
        <div className="rounded-2xl border border-white/5 bg-[#131024] p-5 hover:border-[#9D4EDD]/40 transition-all group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#9D4EDD]/15 border border-[#9D4EDD]/30 flex items-center justify-center text-[#D6B2FF] group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                Chat Inteligente MANNS
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10E59B]/15 text-[#10E59B] border border-[#10E59B]/20">
                  ONLINE
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Converse com nosso assistente interativo e resolva dúvidas instantaneamente em segundos.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#19152B] hover:bg-[#9D4EDD] text-zinc-200 hover:text-white text-xs font-semibold transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            Iniciar conversa agora <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Abrir Chamado Estudantil */}
        <div className="rounded-2xl border border-white/5 bg-[#131024] p-5 hover:border-[#00E5FF]/40 transition-all group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Abrir Ticket de Suporte</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Relate um problema técnico ou inconsistência em seu campus para nossa equipe humana.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#19152B] hover:bg-[#00E5FF] hover:text-[#0B0914] text-zinc-200 text-xs font-semibold transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            Criar novo chamado <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Comunidade Estudantil */}
        <div className="rounded-2xl border border-white/5 bg-[#131024] p-5 hover:border-[#FFD166]/40 transition-all group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD166]/15 border border-[#FFD166]/30 flex items-center justify-center text-[#FFD166] group-hover:scale-110 transition-transform">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Comunidade Universitária</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Troque ideias sobre bolsas, custo de vida e dicas de economia com milhares de estudantes.
              </p>
            </div>
          </div>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#19152B] hover:bg-[#FFD166] hover:text-[#0B0914] text-zinc-200 text-xs font-semibold transition-all border border-white/5 flex items-center justify-center gap-2"
          >
            Acessar Discord da Comunidade <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 3. FILTRO POR CATEGORIA TEMÁTICA */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-[#D6B2FF]" /> Navegue por Áreas de Dúvidas
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Selecione o módulo para filtrar o banco de respostas do sistema.
            </p>
          </div>
          <span className="text-xs text-zinc-500 font-medium">
            {filteredFaqs.length} {filteredFaqs.length === 1 ? "artigo encontrado" : "artigos encontrados"}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-[#1C1832] text-white border-white/20 shadow-md"
                    : "bg-[#131024] text-zinc-400 border-white/5 hover:border-white/10 hover:text-zinc-200"
                }`}
              >
                <Icon className="w-4 h-4" style={{ color: cat.color }} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. LISTA DE FAQ (ACORDEÕES REATIVOS) */}
      <section className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#131024] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-zinc-500">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Nenhum resultado para "{searchQuery}"</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Não encontramos nenhuma resposta correspondente à sua busca. Tente buscar por palavras-chave mais
                gerais ou abra um chamado diretamente com nossa equipe.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("todos");
                }}
                className="px-4 py-2 rounded-xl bg-[#19152B] border border-white/10 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                Limpar filtros
              </button>
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#9D4EDD] hover:bg-[#8338EC] text-xs text-white font-semibold transition-colors"
              >
                Abrir chamado agora
              </button>
            </div>
          </div>
        ) : (
          filteredFaqs.map((item) => {
            const isOpen = openFaqId === item.id;
            const currentVote = feedbackVotes[item.id];
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                id={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-[#9D4EDD]/40 bg-[#151226] shadow-lg shadow-[#9D4EDD]/5"
                    : "border-white/5 bg-[#131024] hover:border-white/10"
                }`}
              >
                {/* Pergunta (Cabeçalho do Acordeão) */}
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: `${item.categoryColor}15`,
                          color: item.categoryColor,
                          border: `1px solid ${item.categoryColor}30`,
                        }}
                      >
                        {item.categoryLabel}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-zinc-400">
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#D6B2FF]" : "text-zinc-500"
                      }`}
                    />
                  </div>
                </button>

                {/* Resposta Expandida */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 space-y-4 border-t border-white/5 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {item.answer}
                    </p>

                    {/* Rodapé da Resposta com Ações e Feedback */}
                    <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                      {/* Atalho para a tela real do MANNS */}
                      <Link
                        href={item.routeLink}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D6B2FF] hover:text-white transition-colors group"
                      >
                        <span>{item.routeLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {/* Feedback: Isso foi útil? & Copiar Link */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopyLink(item.id)}
                          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
                          title="Copiar link desta dúvida"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-[#10E59B]" />
                              <span className="text-[#10E59B]">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar link</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1 text-xs text-zinc-400 bg-white/5 rounded-lg px-2 py-1">
                          <span className="text-[11px] text-zinc-500 mr-1">Foi útil?</span>
                          <button
                            onClick={() => handleVote(item.id, "yes")}
                            className={`p-1 rounded hover:text-white transition-colors ${
                              currentVote === "yes" ? "text-[#10E59B] bg-[#10E59B]/15" : ""
                            }`}
                            aria-label="Sim, foi útil"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleVote(item.id, "no")}
                            className={`p-1 rounded hover:text-white transition-colors ${
                              currentVote === "no" ? "text-[#FF85A1] bg-[#FF85A1]/15" : ""
                            }`}
                            aria-label="Não foi útil"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* 5. BANNER INFERIOR DE CONTATO HUMANIZADO */}
      <section className="rounded-2xl border border-white/5 bg-gradient-to-r from-[#19152B] to-[#131024] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <AlertCircle className="w-5 h-5 text-[#D6B2FF]" /> Não encontrou a resposta para o seu caso?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Nossa equipe de suporte universitário responde chamados em até 2 horas úteis nos dias de semana.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#D6B2FF]" /> Abrir Chat Instantâneo
          </button>
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#9D4EDD] hover:bg-[#8338EC] text-xs font-semibold text-white transition-colors shadow-lg shadow-[#9D4EDD]/20 flex items-center gap-2"
          >
            <LifeBuoy className="w-4 h-4" /> Enviar Novo Ticket
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: ABRIR TICKET / CHAMADO DE SUPORTE */}
      {/* ========================================================================= */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#131024] p-6 shadow-2xl space-y-5">
            {/* Fechar */}
            <button
              onClick={handleResetTicketModal}
              className="absolute right-4 top-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {ticketSuccessProtocol ? (
              // Sucesso do Ticket
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#10E59B]/15 border border-[#10E59B]/30 text-[#10E59B] mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Chamado Aberto com Sucesso!</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Um protocolo foi gerado e encaminhado para o time técnico do MANNS.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-white/5 bg-[#19152B] max-w-xs mx-auto">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Número de Protocolo</span>
                  <div className="text-lg font-mono font-bold text-[#D6B2FF] mt-0.5">{ticketSuccessProtocol}</div>
                  <span className="text-[11px] text-zinc-400 mt-1 block">Previsão de resposta: até 2h úteis</span>
                </div>

                <button
                  onClick={handleResetTicketModal}
                  className="w-full py-3 rounded-xl bg-[#9D4EDD] hover:bg-[#8338EC] text-white text-xs font-semibold transition-colors"
                >
                  Concluir e Voltar
                </button>
              </div>
            ) : (
              // Formulário de Abertura
              <form onSubmit={handleSendTicket} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5 text-[#9D4EDD]" /> Abrir Chamado de Suporte
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Detalhe sua dúvida ou problema técnico. Responderemos via e-mail acadêmico cadastrado.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Assunto Resumido</label>
                    <input
                      type="text"
                      placeholder="Ex: Erro ao calcular créditos do RU"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0914] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#9D4EDD]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Módulo Envolvido</label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0914] border border-white/10 text-xs text-white focus:outline-none focus:border-[#9D4EDD]"
                      >
                        <option value="Dúvida Geral">Visão Geral & Contas</option>
                        <option value="Planejamento">Planejamento & Metas</option>
                        <option value="Investimentos">Investimentos & Simulador</option>
                        <option value="Hub Acadêmico">Hub Acadêmico (RU/Livros)</option>
                        <option value="Relatórios">Relatórios & Exportação</option>
                        <option value="Open Finance">Segurança & Open Finance</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-zinc-300 block mb-1">Prioridade</label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value as "baixa" | "normal" | "alta")}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0914] border border-white/10 text-xs text-white focus:outline-none focus:border-[#9D4EDD]"
                      >
                        <option value="baixa">Baixa (Dúvida simples)</option>
                        <option value="normal">Normal (Operação padrão)</option>
                        <option value="alta">Alta (Bloqueio ou erro)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-300 block mb-1">Descrição Detalhada</label>
                    <textarea
                      rows={4}
                      placeholder="Descreva o que aconteceu, a universidade em que estuda ou qualquer detalhe relevante..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0914] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#9D4EDD] resize-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetTicketModal}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#9D4EDD] hover:bg-[#8338EC] text-white text-xs font-semibold transition-colors flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Enviar Chamado
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CHAT INTELIGENTE INTERATIVO */}
      {/* ========================================================================= */}
      {isChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg h-[560px] rounded-2xl border border-white/10 bg-[#131024] shadow-2xl flex flex-col overflow-hidden">
            {/* Header do Chat */}
            <div className="p-4 border-b border-white/5 bg-[#19152B] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-[#9D4EDD]/20 border border-[#9D4EDD]/30 flex items-center justify-center text-[#D6B2FF]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10E59B] ring-2 ring-[#19152B]"></span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Assistente MANNS</h3>
                  <p className="text-[10px] text-zinc-400">Suporte estudantil em tempo real</p>
                </div>
              </div>

              <button
                onClick={() => setIsChatModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mensagens do Chat */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/10">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#9D4EDD] text-white rounded-br-none"
                        : "bg-[#1C1832] text-zinc-200 border border-white/5 rounded-bl-none"
                    }`}
                  >
                    {msg.text}

                    {msg.link && (
                      <div className="mt-2.5 pt-2 border-t border-white/10">
                        <Link
                          href={msg.link.url}
                          onClick={() => setIsChatModalOpen(false)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#00E5FF] hover:underline"
                        >
                          {msg.link.label} <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chips de Perguntas Rápidas */}
            <div className="px-4 py-2 border-t border-white/5 bg-[#151226] flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] text-zinc-500 whitespace-nowrap">Sugestões:</span>
              <button
                onClick={() => handleSendChatMessage(undefined, "Como renovar livros na biblioteca?")}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 whitespace-nowrap transition-colors border border-white/5"
              >
                Renovação biblioteca 📚
              </button>
              <button
                onClick={() => handleSendChatMessage(undefined, "Como funciona a recarga do RU?")}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 whitespace-nowrap transition-colors border border-white/5"
              >
                Recarregar RU 🍲
              </button>
              <button
                onClick={() => handleSendChatMessage(undefined, "O Open Finance é seguro?")}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 whitespace-nowrap transition-colors border border-white/5"
              >
                Segurança bancária 🔒
              </button>
            </div>

            {/* Input do Chat */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-white/5 bg-[#19152B] flex items-center gap-2">
              <input
                type="text"
                placeholder="Digite sua dúvida aqui..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-[#0B0914] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#9D4EDD]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2.5 rounded-xl bg-[#9D4EDD] hover:bg-[#8338EC] disabled:opacity-40 disabled:hover:bg-[#9D4EDD] text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}