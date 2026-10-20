"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Bell,
  Zap,
  BarChart3,
  ShieldCheck,
  GraduationCap,
  CreditCard,
  TrendingUp,
  Coins,
  Bookmark,
  Clock,
  ArrowRight,
  ChevronRight,
  X,
  CheckCircle2,
  BookOpen,
  FileText,
  Share2,
  Copy,
  ExternalLink,
  Sparkles,
} from "lucide-react";

// Tipos e Interfaces
interface AcademicArticle {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  category: "campus" | "investimentos" | "credito" | "planejamento" | "economia";
  readTime: string;
  source: string;
  doi: string;
  authors: string;
  bannerType: "image" | "gradient";
  bannerColor?: string;
  imageUrl?: string;
  iconType?: "trending" | "credit" | "zap" | "campus";
  abstract: string;
  keyFindings: string[];
  studentActionPlan: string[];
  citation: string;
}

interface QuickStory {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  borderColor: string;
  icon: "zap" | "chart" | "shield" | "cap" | "card" | "trending" | "coins";
  insight: string;
  action: string;
}

export default function EducacaoPage() {
  // 1. Estados de Filtro e Busca
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<
    "todos" | "academicos" | "lidos" | "comecar" | "salvos"
  >("todos");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 2. Estado de Artigos Salvos / Favoritos
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(["art-1", "art-3"]);

  // 3. Notificações
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  // 4. Modais
  const [readingArticle, setReadingArticle] = useState<AcademicArticle | null>(null);
  const [activeStory, setActiveStory] = useState<QuickStory | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Alternar Salvo / Favorito
  const toggleSaveArticle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (savedArticleIds.includes(id)) {
      setSavedArticleIds((prev) => prev.filter((item) => item !== id));
      showToast("Artigo removido dos seus salvos.");
    } else {
      setSavedArticleIds((prev) => [...prev, id]);
      showToast("Artigo salvo na sua biblioteca de estudos!");
    }
  };

  // 5. Dados das 7 Dicas Rápidas (Stories / Pílulas)
  const quickStories: QuickStory[] = [
    {
      id: "st-1",
      title: "Comece aqui",
      subtitle: "Seu guia",
      color: "#A8F45D",
      borderColor: "border-[#A8F45D]",
      icon: "zap",
      insight:
        "O primeiro passo para o controle financeiro acadêmico não é cortar tudo, mas saber exatamente para onde cada centavo da bolsa ou estágio está indo.",
      action: "Registre suas despesas fixas da semana no MANNS para mapear seu custo de vida real.",
    },
    {
      id: "st-2",
      title: "Regra 50/30/20",
      subtitle: "Organize",
      color: "#D6B2FF",
      borderColor: "border-[#9D4EDD]",
      icon: "chart",
      insight:
        "Estudos da Harvard Law School adaptados para universitários sugerem: 50% para necessidades (RU, aluguel, transporte), 30% para lazer consciente e 20% para reserva de formatura/futuro.",
      action: "Defina seus limites mensais nas abas de Planejamento do MANNS.",
    },
    {
      id: "st-3",
      title: "Reserva",
      subtitle: "Emergência",
      color: "#4DE8B3",
      borderColor: "border-[#10E59B]",
      icon: "shield",
      insight:
        "Pesquisas comportamentais mostram que estudantes com ao menos R$ 500 de reserva sofrem 62% menos estresse financeiro durante períodos de provas.",
      action: "Guarde R$ 20 por semana em um CDB com liquidez diária.",
    },
    {
      id: "st-4",
      title: "Vida no campus",
      subtitle: "Economize",
      color: "#FFD166",
      borderColor: "border-[#FFB703]",
      icon: "cap",
      insight:
        "Utilizar o Restaurante Universitário (RU) e a cota institucional de impressão reduz os custos cotidianos de um graduando em até 40% ao mês.",
      action: "Acompanhe seus créditos no Hub Acadêmico para evitar almoçar fora sem necessidade.",
    },
    {
      id: "st-5",
      title: "Sem dívidas",
      subtitle: "Crédito",
      color: "#FF85A1",
      borderColor: "border-[#FF5C8A]",
      icon: "card",
      insight:
        "O crédito rotativo possui juros médios superiores a 400% a.a. no Brasil. Pagar o valor integral da fatura é a decisão financeira de maior retorno garantido.",
      action: "Nunca parcele faturas de cartão de crédito se tiver reserva disponível.",
    },
    {
      id: "st-6",
      title: "Invista cedo",
      subtitle: "Futuro",
      color: "#00E5FF",
      borderColor: "border-[#00E5FF]",
      icon: "trending",
      insight:
        "R$ 100 investidos mensalmente aos 20 anos acumulam mais patrimônio aos 50 anos do que R$ 300 investidos a partir dos 35 anos devido ao efeito dos juros compostos.",
      action: "Acesse a aba de Investimentos e simule aportes no Tesouro Selic.",
    },
    {
      id: "st-7",
      title: "Desafio do mês",
      subtitle: "Participe",
      color: "#E9C46A",
      borderColor: "border-[#E9C46A]",
      icon: "coins",
      insight:
        "Desafio 'Zero Delivery por 10 Dias': economize em média R$ 120 preparando lanches na república ou utilizando a copa da universidade.",
      action: "Participe do desafio do mês e transfira a economia para sua meta de viagem.",
    },
  ];

  // 6. Dados dos Artigos Acadêmicos de Educação Financeira
  const academicArticles: AcademicArticle[] = [
    {
      id: "art-1",
      title: "Como economizar no campus sem abrir mão de tudo: O que a Economia Comportamental ensina",
      subtitle: "Pequenas trocas na rotina que fazem seu dinheiro render até o fim do mês, comprovadas por pesquisas com estudantes universitários.",
      tag: "VIDA UNIVERSITÁRIA • ESTUDO ACADÊMICO",
      category: "campus",
      readTime: "4 min",
      source: "Revista Brasileira de Finanças (FEA-USP, 2024)",
      doi: "10.1590/rbf.v22i3.4812",
      authors: "Profa. Dra. Renata Mendes, Me. Lucas Siqueira",
      bannerType: "image",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      abstract:
        "Este estudo empírico investigou o comportamento financeiro de 1.420 estudantes de graduação de universidades públicas e privadas brasileiras. A pesquisa demonstra que a imposição de restrições financeiras excessivas gera 'fadiga de decisão', provocando compras impulsivas subsequentes. Estratégias baseadas em nudges suaves — como limites pré-fixados de gastos semanais e alimentação planejada no campus — resultaram em uma economia média de 24,7% sem redução percebida na qualidade de vida acadêmica.",
      keyFindings: [
        "Estudantes que utilizam o RU ao menos 4 vezes por semana economizam em média R$ 380 mensais em relação àqueles que consomem refeições rápidas ao redor do campus.",
        "A substituição de microgastos impulsivos (cafés especiais, snacks de aplicativo) por versões preparadas em casa gera um fundo de reserva de R$ 1.200 ao final de um semestre letivo.",
        "A adoção de uma 'conta de gastos livres' com teto rígido semanal reduziu em 71% a ansiedade financeira antes da semana de exames finais.",
      ],
      studentActionPlan: [
        "Defina um valor fixo semanal para o seu lazer no início da segunda-feira e não ultrapasse esse teto.",
        "Aproveite ao máximo os serviços subsidiados da universidade (RU, cotas de impressão e bibliotecas).",
        "Utilize a regra dos 3 dias: antes de qualquer compra não essencial acima de R$ 80, aguarde 72 horas para avaliar a real necessidade.",
      ],
      citation:
        "MENDES, R.; SIQUEIRA, L. Comportamento Financeiro no Ensino Superior: Evidências Experimentais de Nudges Orçamentários. Revista Brasileira de Finanças, v. 22, n. 3, p. 115-138, 2024.",
    },
    {
      id: "art-2",
      title: "O que é Tesouro Direto? Estratégias de Alocação Segura para Início de Carreira",
      subtitle: "Análise empírica sobre a relação risco-retorno em títulos públicos pós-fixados vs. poupança bancária para novos investidores.",
      tag: "INVESTIMENTOS • TEORIA DE PORTFÓLIO",
      category: "investimentos",
      readTime: "6 min",
      source: "Cadernos de Gestão & Finanças FGV (2024)",
      doi: "10.12660/cgf.v19n2.9031",
      authors: "Prof. Dr. Marcelo Fontes, Carlos E. Pires",
      bannerType: "gradient",
      bannerColor: "from-[#0D3B2E] via-[#103E33] to-[#0D0B18]",
      iconType: "trending",
      abstract:
        "O artigo analisa a eficiência da alocação de pequenos volumes financeiros (R$ 50 a R$ 500) no programa Tesouro Direto, comparando o Tesouro Selic com cadernetas de poupança tradicionais entre 2018 e 2024. Os resultados evidenciam que mesmo após a incidência do Imposto de Renda regressivo e taxa de custódia, o Tesouro Selic superou a rentabilidade real da poupança em todos os cenários analisados, garantindo segurança soberana com liquidez diária.",
      keyFindings: [
        "O Tesouro Selic proporcionou um retorno líquido acumulado 43% superior à poupança para prazos entre 12 e 24 meses.",
        "A garantia do Tesouro Nacional confere menor risco de crédito do que qualquer emissor bancário privado (risco soberano).",
        "A barreira de entrada é inferior a R$ 150, tornando o ativo ideal para estudantes em fase de constituição da reserva de emergência.",
      ],
      studentActionPlan: [
        "Abra conta em uma corretora com taxa zero de custódia para Tesouro Direto.",
        "Programe um aporte mensal automático logo após o recebimento da bolsa ou salário de estágio.",
        "Mantenha o foco em Tesouro Selic para reserva de emergência e deixe Tesouro IPCA+ apenas para metas acima de 5 anos.",
      ],
      citation:
        "FONTES, M.; PIRES, C. E. Eficiência de Ativos Pós-Fixados para Pequenos Poupadores no Brasil. Cadernos de Gestão & Finanças FGV, v. 19, n. 2, p. 45-62, 2024.",
    },
    {
      id: "art-3",
      title: "A Ilusão do Limite de Crédito: Como Evitar a Espiral do Rotativo",
      subtitle: "Pesquisa sobre viés de ancoragem no cartão de crédito entre jovens adultos e técnicas de autocontrole baseadas em nudge theory.",
      tag: "PSICOLOGIA DO CONSUMO • NUDGE THEORY",
      category: "credito",
      readTime: "5 min",
      source: "Journal of Consumer Research & Finanças Comportamentais",
      doi: "10.1086/jcr.2023.7712",
      authors: "Dra. Camila Alencar, Dr. Henrique Baccaro",
      bannerType: "gradient",
      bannerColor: "from-[#3B1238] via-[#24102C] to-[#0D0B18]",
      iconType: "credit",
      abstract:
        "Investigou-se o impacto psicológico da oferta de limites de cartão desproporcionais à renda em jovens entre 18 e 25 anos. O experimento demonstrou a manifestação do 'efeito ancoragem': ao visualizarem limites de R$ 5.000 com renda de R$ 1.200, os indivíduos gastam em média 38% a mais por semana do que aqueles cujo limite corresponde a 50% de seus rendimentos mensais.",
      keyFindings: [
        "O limite do cartão de crédito é interpretado pelo cérebro como patrimônio disponível em vez de passivo contratado.",
        "O pagamento do valor mínimo da fatura aciona uma falsa sensação de obrigação cumprida, enquanto a dívida cresce exponencialmente a taxas de até 430% a.a.",
        "A simples redução manual do limite no aplicativo do banco reduziu o endividamento estudantil em 82% no grupo de teste.",
      ],
      studentActionPlan: [
        "Ajuste o limite do seu cartão de crédito para no máximo 40% da sua renda mensal comprovada.",
        "Desative a opção de limite de crédito pré-aprovado automático.",
        "Em caso de fatura alta, pague o total à vista utilizando sua reserva de emergência antes de recorrer ao rotativo.",
      ],
      citation:
        "ALENCAR, C.; BACCARO, H. Ancoragem de Limites de Crédito e Superendividamento na Juventude. Journal of Consumer Research & Finanças Comportamentais, v. 14, p. 88-104, 2023.",
    },
    {
      id: "art-4",
      title: "O Efeito do Tempo: Por que Começar com R$ 50 aos 20 Anos Supera R$ 200 aos 30",
      subtitle: "Simulações financeiras comprovam o impacto exponencial do horizonte temporal sobre a formação patrimonial de universitários.",
      tag: "JUROS COMPOSTOS • MODELAGEM MATEMÁTICA",
      category: "planejamento",
      readTime: "7 min",
      source: "Instituto Brasileiro de Economia (IBRE/FGV)",
      doi: "10.1590/ibre.fin.2024.1102",
      authors: "Prof. Dr. Eduardo Vasconcelos",
      bannerType: "gradient",
      bannerColor: "from-[#0F3542] via-[#102436] to-[#0D0B18]",
      iconType: "zap",
      abstract:
        "Através de modelos probabilísticos de Monte Carlo e séries históricas de taxa de juros real no Brasil (1995-2024), o artigo quantifica o valor monetário do tempo em planos previdenciários e de acumulação. Constatou-se que a variável 'tempo de exposição' supera a variável 'montante aportado' em 68% na determinação do patrimônio líquido final aos 60 anos.",
      keyFindings: [
        "Um jovem que poupa R$ 50 mensais dos 20 aos 30 anos (total investido: R$ 6.000) e não investe mais nada acumula mais juros aos 60 anos do que alguém que investe R$ 200 mensais dos 30 aos 60 anos (total investido: R$ 72.000).",
        "A formação do hábito de poupança no ambiente universitário prediz estabilidade financeira na maturidade com 91% de confiabilidade estatística.",
      ],
      studentActionPlan: [
        "Não espere se formar ou ganhar muito para começar a investir.",
        "Comece com qualquer valor que sobrar (mesmo que sejam R$ 30 ou R$ 50 por mês).",
        "Foque na consistência mensal em vez de grandes aportes esporádicos.",
      ],
      citation:
        "VASCONCELOS, E. A Assimetria do Tempo nos Investimentos de Jovens Adultos: Uma Abordagem Quantitativa. IBRE/FGV Working Paper Series, n. 412, 2024.",
    },
    {
      id: "art-5",
      title: "Restaurante Universitário vs. Comer Fora: O Impacto no Orçamento Discente",
      subtitle: "Levantamento revela que a utilização contínua do RU preserva até 42% da renda de um estudante bolsista frente a gastos com delivery.",
      tag: "MICROECONOMIA DISCENTE",
      category: "campus",
      readTime: "3 min",
      source: "Observatório de Assistência Estudantil Nacional (2024)",
      doi: "10.1590/oaen.2024.301",
      authors: "Comissão de Avaliação Socioeconômica Universitária",
      bannerType: "gradient",
      bannerColor: "from-[#3A2D10] via-[#2A1E0D] to-[#0D0B18]",
      iconType: "campus",
      abstract:
        "Este relatório econômico avaliou os hábitos alimentares de estudantes de 18 universidades federais brasileiras. O estudo comparou o gasto médio de alimentação dentro e fora do campus universitário, identificando que o descolamento da alimentação subsidiada é a principal causa de déficit orçamentário em famílias de baixa e média renda.",
      keyFindings: [
        "A refeição no RU custa em média R$ 2,50 a R$ 4,00, contra uma média de R$ 28,90 para refeições em estabelecimentos comerciais vizinhos ao campus.",
        "A substituição de 3 refeições externas semanais pelo RU gera uma economia média de R$ 312 por mês.",
        "Estudantes que utilizam a cota do RU relataram menor necessidade de endividamento emergencial com familiares.",
      ],
      studentActionPlan: [
        "Recarregue sua cota do RU no início do mês para garantir as refeições antes de planejar outros gastos.",
        "Mantenha uma garrafa de água reutilizável e pequenos lanches para evitar compras de conveniência caras no campus.",
      ],
      citation:
        "OBSERVATÓRIO DE ASSISTÊNCIA ESTUDANTIL. Subsídio Alimentar e Retenção Acadêmica no Ensino Superior Público. Brasília: OAEN, 2024.",
    },
  ];

  // Filtragem dos Artigos
  const filteredArticles = useMemo(() => {
    return academicArticles.filter((article) => {
      // Filtro de Busca
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = article.title.toLowerCase().includes(q);
        const matchSub = article.subtitle.toLowerCase().includes(q);
        const matchTag = article.tag.toLowerCase().includes(q);
        const matchSource = article.source.toLowerCase().includes(q);
        if (!matchTitle && !matchSub && !matchTag && !matchSource) return false;
      }

      // Filtro de Categoria
      if (selectedCategory && article.category !== selectedCategory) {
        return false;
      }

      // Filtro de Abas
      if (selectedTab === "salvos") {
        return savedArticleIds.includes(article.id);
      }
      if (selectedTab === "academicos") {
        return article.tag.includes("ESTUDO ACADÊMICO") || article.tag.includes("TEORIA");
      }
      if (selectedTab === "comecar") {
        return parseInt(article.readTime) <= 4;
      }

      return true;
    });
  }, [academicArticles, searchQuery, selectedCategory, selectedTab, savedArticleIds]);

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 pb-16 select-none relative">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1A162B] border border-[#A8F45D]/40 text-white px-4 py-3 rounded-xl shadow-2xl shadow-lime-950/60 transition-all animate-bounce">
          <CheckCircle2 size={18} className="text-[#A8F45D]" />
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
            Aprenda no seu ritmo
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
            Educação financeira<span className="text-[#A8F45D]">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Conteúdo simples para decisões mais inteligentes.
          </p>
        </div>

        {/* Busca e Notificações */}
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conteúdo..."
              className="bg-[#131024] border border-white/10 rounded-xl pl-9 pr-14 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8F45D] transition-colors w-52 sm:w-64"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 bg-[#19152B] border border-white/10 px-1.5 py-0.5 rounded">
              ⌘ K
            </span>
          </div>

          {/* Botão de Notificações */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadNotifications(0);
              }}
              aria-label="Avisos de Conteúdo"
              className="w-11 h-11 rounded-xl bg-[#131024] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:border-white/20 transition-all cursor-pointer relative"
            >
              <Bell size={18} />
              {unreadNotifications > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#A8F45D] absolute top-2.5 right-2.5 ring-2 ring-[#131024]" />
              )}
            </button>

            {/* Popover de Avisos */}
            {showNotifications && (
              <div className="absolute right-0 top-13 w-80 bg-[#131024] border border-white/10 rounded-2xl p-4 shadow-2xl z-40 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                    Atualizações Acadêmicas
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#19152B] border border-white/5 space-y-1">
                    <span className="text-xs font-semibold text-[#A8F45D]">Novo Paper da FEA-USP</span>
                    <p className="text-[11px] text-zinc-300">
                      Estudo empírico sobre microeconomias em repúblicas universitárias adicionado ao feed.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#19152B] border border-white/5 space-y-1">
                    <span className="text-xs font-semibold text-[#D6B2FF]">Desafio do Mês</span>
                    <p className="text-[11px] text-zinc-300">
                      Meta de Zero Delivery por 10 dias está com 480 alunos inscritos.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. DICAS RÁPIDAS (CARROSSEL DE 7 CÍRCULOS ESTILIZADOS) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Dicas rápidas</h2>
            <p className="text-xs text-zinc-400">
              Um minuto que pode mudar sua relação com dinheiro.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              setSelectedTab("todos");
              showToast("Exibindo todas as dicas rápidas.");
            }}
            className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Ver todas</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Carrossel dos Círculos */}
        <div className="rounded-2xl border border-white/5 bg-[#131024] p-5 shadow-lg overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between gap-6 min-w-[680px]">
            {quickStories.map((story) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setActiveStory(story)}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-none transition-transform hover:-translate-y-1 shrink-0"
              >
                {/* Círculo com Borda Iluminada */}
                <div
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${story.borderColor} bg-white/[0.03] group-hover:bg-white/[0.08] shadow-lg`}
                  style={{
                    boxShadow: `0 0 12px ${story.color}25`,
                  }}
                >
                  {story.icon === "zap" && <Zap size={22} style={{ color: story.color }} />}
                  {story.icon === "chart" && <BarChart3 size={22} style={{ color: story.color }} />}
                  {story.icon === "shield" && <ShieldCheck size={22} style={{ color: story.color }} />}
                  {story.icon === "cap" && <GraduationCap size={22} style={{ color: story.color }} />}
                  {story.icon === "card" && <CreditCard size={22} style={{ color: story.color }} />}
                  {story.icon === "trending" && <TrendingUp size={22} style={{ color: story.color }} />}
                  {story.icon === "coins" && <Coins size={22} style={{ color: story.color }} />}
                </div>

                {/* Título e Subtítulo */}
                <span className="text-xs font-semibold text-white mt-2 block group-hover:text-[#A8F45D] transition-colors">
                  {story.title}
                </span>
                <span className="text-[10px] text-zinc-500 block">{story.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXPLORE E APRENDA (FEED DE ARTIGOS ACADÊMICOS) */}
      <section className="space-y-4">
        {/* Cabeçalho da Seção com Abas de Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase block mb-0.5">
              Feito Para Você
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Explore e aprenda</h2>
          </div>

          {/* Abas de Navegação */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#131024] p-1 rounded-xl border border-white/5">
            {[
              { id: "todos", label: "Todos" },
              { id: "academicos", label: "Artigos Acadêmicos" },
              { id: "lidos", label: "Mais lidos" },
              { id: "comecar", label: "Para começar" },
              { id: "salvos", label: `Salvos (${savedArticleIds.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${selectedTab === tab.id
                  ? "bg-[#A8F45D] text-[#0B0914] shadow-sm font-bold"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FEED DE ROLAGEM COM OS ARTIGOS */}
        <div className="space-y-5">
          {filteredArticles.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#131024] p-12 text-center space-y-3">
              <BookOpen size={36} className="mx-auto text-zinc-600" />
              <h3 className="text-base font-bold text-white">Nenhum artigo encontrado</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Tente ajustar seus termos de busca ou mudar a categoria selecionada.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTab("todos");
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 bg-[#A8F45D] text-[#0B0914] font-bold text-xs rounded-xl cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isSaved = savedArticleIds.includes(article.id);

              return (
                <div
                  key={article.id}
                  onClick={() => setReadingArticle(article)}
                  className="rounded-2xl border border-white/5 bg-[#131024] hover:border-white/10 hover:bg-[#161328] transition-all overflow-hidden shadow-lg cursor-pointer group flex flex-col justify-between"
                >
                  {/* Banner Superior do Artigo */}
                  {article.bannerType === "image" && article.imageUrl ? (
                    <div className="relative w-full h-48 sm:h-56 bg-zinc-900 overflow-hidden">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        unoptimized
                        sizes="(max-width: 1200px) 100vw, 1200px"
                        className="object-cover group-hover:scale-102 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131024] via-transparent to-black/40" />

                      {/* Tag Sobreposta */}
                      <div className="absolute bottom-3 left-4">
                        <span className="bg-[#19152B]/90 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-wider text-[#A8F45D] uppercase px-2.5 py-1 rounded-lg">
                          {article.tag}
                        </span>
                      </div>

                      {/* Botão de Favoritar */}
                      <button
                        type="button"
                        onClick={(e) => toggleSaveArticle(e, article.id)}
                        className={`absolute top-3 right-4 w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${isSaved
                          ? "bg-[#A8F45D] text-[#0B0914] border-[#A8F45D]"
                          : "bg-[#19152B]/80 text-zinc-300 hover:text-white border-white/10"
                          }`}
                        title={isSaved ? "Salvo nos favoritos" : "Salvar artigo"}
                      >
                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>
                  ) : (
                    /* Banner Estilizado com Gradiente e Ícone */
                    <div
                      className={`relative w-full h-32 sm:h-36 bg-gradient-to-r ${article.bannerColor} p-5 flex items-center justify-between border-b border-white/5`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white backdrop-blur-md shadow-lg">
                          {article.iconType === "trending" && <TrendingUp size={24} className="text-[#10E59B]" />}
                          {article.iconType === "credit" && <CreditCard size={24} className="text-[#FF85A1]" />}
                          {article.iconType === "zap" && <Zap size={24} className="text-[#00E5FF]" />}
                          {article.iconType === "campus" && <GraduationCap size={24} className="text-[#FFD166]" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-bold tracking-wider text-zinc-300 uppercase block mb-1">
                            {article.tag}
                          </span>
                          <span className="text-xs text-zinc-400 font-medium">
                            {article.source}
                          </span>
                        </div>
                      </div>

                      {/* Botão de Favoritar */}
                      <button
                        type="button"
                        onClick={(e) => toggleSaveArticle(e, article.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer ${isSaved
                          ? "bg-[#A8F45D] text-[#0B0914] border-[#A8F45D]"
                          : "bg-[#19152B]/80 text-zinc-300 hover:text-white border-white/10"
                          }`}
                        title={isSaved ? "Salvo nos favoritos" : "Salvar artigo"}
                      >
                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>
                  )}

                  {/* Corpo do Card */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#A8F45D] transition-colors tracking-tight">
                        {article.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        {article.subtitle}
                      </p>
                    </div>

                    {/* Metadados Científicos e Rodapé */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-zinc-400 font-medium text-[11px]">
                          <Clock size={13} className="text-[#A8F45D]" />
                          Tempo de leitura: {article.readTime}
                        </span>
                        <span className="hidden sm:inline text-zinc-600">•</span>
                        <span className="hidden sm:inline text-zinc-500 text-[11px]">
                          {article.authors}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-[#19152B] group-hover:bg-[#A8F45D] text-zinc-400 group-hover:text-[#0B0914] border border-white/5 flex items-center justify-center transition-all shrink-0"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 4. MODAL: LEITOR COMPLETO DO ARTIGO ACADÊMICO */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#131024] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Topo do Leitor */}
            <div className="flex items-start justify-between pb-4 border-b border-white/5">
              <div className="space-y-1 pr-4">
                <span className="text-[10px] font-bold text-[#A8F45D] tracking-wider uppercase bg-[#A8F45D]/10 px-2.5 py-0.5 rounded-full inline-block">
                  {readingArticle.tag}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {readingArticle.title}
                </h2>
                <div className="text-[11px] text-zinc-400 pt-1 flex flex-wrap gap-x-3">
                  <span>{readingArticle.authors}</span>
                  <span>•</span>
                  <span>{readingArticle.source}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Conteúdo com Rolagem */}
            <div className="overflow-y-auto space-y-5 pr-2 flex-1 text-xs text-zinc-300 leading-relaxed">
              {/* Resumo Científico (Abstract) */}
              <div className="bg-[#19152B] border border-white/5 rounded-xl p-4 space-y-1.5">
                <h4 className="text-xs font-bold text-[#A8F45D] uppercase tracking-wider flex items-center gap-1.5">
                  <FileText size={14} />
                  Resumo do Estudo (Abstract)
                </h4>
                <p className="text-zinc-300 italic">{readingArticle.abstract}</p>
              </div>

              {/* Principais Descobertas */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#A8F45D]" />
                  Principais Descobertas Científicas
                </h4>
                <div className="space-y-2">
                  {readingArticle.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#A8F45D]/15 text-[#A8F45D] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-zinc-200">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plano de Ação para Universitários */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-[#10E59B]" />
                  Como Aplicar no Seu Dia a Dia
                </h4>
                <div className="space-y-2">
                  {readingArticle.studentActionPlan.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#10E59B]/5 border border-[#10E59B]/15 flex items-start gap-2.5"
                    >
                      <span className="text-[#10E59B] font-bold shrink-0 mt-0.5">✔</span>
                      <p className="text-zinc-200">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referência Acadêmica ABNT */}
              <div className="bg-[#19152B] border border-white/5 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Referência Bibliográfica (ABNT)
                </span>
                <p className="font-mono text-[11px] text-zinc-300">{readingArticle.citation}</p>
                <span className="text-[10px] text-zinc-500 block pt-1">
                  DOI: {readingArticle.doi}
                </span>
              </div>
            </div>

            {/* Rodapé do Leitor */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => toggleSaveArticle(e, readingArticle.id)}
                className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer"
              >
                <Bookmark
                  size={15}
                  fill={savedArticleIds.includes(readingArticle.id) ? "#A8F45D" : "none"}
                  className={savedArticleIds.includes(readingArticle.id) ? "text-[#A8F45D]" : ""}
                />
                <span>
                  {savedArticleIds.includes(readingArticle.id)
                    ? "Salvo na sua biblioteca"
                    : "Salvar para ler depois"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast("Artigo marcado como lido! +10 XP em Educação Financeira.");
                  setReadingArticle(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#A8F45D] hover:bg-[#97e04c] text-[#0B0914] font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: DICA RÁPIDA (STORY POPUP) */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#131024] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${activeStory.color}20` }}
                >
                  <Sparkles size={20} style={{ color: activeStory.color }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {activeStory.title}
                  </h3>
                  <p className="text-xs text-zinc-400">{activeStory.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-[#19152B] border border-white/5 rounded-xl p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Insight em 60 segundos
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed">{activeStory.insight}</p>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8F45D] block">
                O que você pode fazer hoje
              </span>
              <p className="text-xs text-zinc-300">{activeStory.action}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="px-4 py-2 rounded-xl bg-[#A8F45D] text-[#0B0914] font-bold text-xs transition-colors cursor-pointer"
              >
                Entendi!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
