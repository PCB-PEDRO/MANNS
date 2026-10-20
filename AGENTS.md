# Contexto do Projeto: MANNS

## 1. Visão Geral
O **MANNS** é uma plataforma web de gestão financeira e organização acadêmica voltada para estudantes universitários.
Atualmente, o projeto está na fase de construção de um **front-end 100% interativo** (utilizando estados locais do React) baseado no protótipo do Figma, preparando a estrutura para futura integração com o back-end.

## 2. Stack Tecnológica e Particularidades Críticas
- **Framework:** Next.js (App Router) com TypeScript (`src/app`).
- **Estilização:** **Tailwind CSS v4** (`@tailwindcss/postcss`).
  - **IMPORTANTE:** O projeto usa Tailwind v4. **NÃO** utilize nem recrie o arquivo `tailwind.config.ts`.
  - A importação no `@src/app/globals.css` é feita via `@import "tailwindcss";` e variáveis customizadas usam a diretiva `@theme`.
- **Ícones:** `lucide-react`.
- **Idioma da Interface e Código:** Textos da UI em Português (pt-BR), formatação monetária em Real (`BRL`).
- **Padrão de Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `style:`).

## 3. Identidade Visual e Sistema de Cores (Dark + Neon)
O design segue um tema escuro profundo com acentos neon suaves e cartões com bordas sutis (`border-white/5` ou `border-white/[0.07]`):

- **Fundos principais:**
  - Background global (`body`): `#0B0914`
  - Sidebar background: `#0D0B18`
  - Cards / Painéis principais: `#131022` / `#131024` / `#1A162B`
  - Item ativo na Sidebar / Inputs secundários: `#1C1832` / `#19152B`
- **Cores de Destaque por Módulo (Sidebar e Destaques):**
  - **Visão Geral (`/`)**: `#4DE8B3` (Verde menta neon) e `#10E59B`
  - **Planejamento (`/planejamento`)**: `#D6B2FF` (Lilás suave) e `#9D4EDD` (Roxo)
  - **Investimentos (`/investimentos`)**: `#00E5FF` (Ciano elétrico)
  - **Hub Acadêmico (`/hub-academico`)**: `#FFD166` (Âmbar dourado)
  - **Educação Financeira (`/educacao`)**: `#A8F45D` (Verde lima)
  - **Relatórios (`/relatorios`)**: `#FF85A1` (Rosa suave)

## 4. Arquitetura Atual de Arquivos
- `@src/app/globals.css`: Configuração do Tailwind v4 e tema `@theme`.
- `@src/app/layout.tsx`: Layout raiz com `suppressHydrationWarning`, renderizando a `<Sidebar />` fixa à esquerda (`w-64`) e o `<main className="ml-64 flex-1 p-8">`.
- `@src/components/Sidebar.tsx`: Barra lateral fixa com:
  - Logo em `/public/logo.png` usando `next/image` (`fill`, `sizes="48px"`, `object-cover`) dentro de uma moldura com borda gradiente (`from-[#9D4EDD] to-[#00E5FF]`).
  - Navegação principal com indicador luminoso lateral na rota ativa e cor dinâmica por página.
  - Rodapé compacto com ícones de *Central de ajuda* (`/ajuda`) e *Configurações* (`/configuracoes`) lado a lado, seguidos pelo card de perfil do usuário.
- `@src/app/page.tsx` (**Visão Geral - Concluída**):
  - Header com saudação, popover de notificações e botões que abrem modal interativo para **Adicionar Receita** e **Adicionar Despesa**.
  - Seção **Minhas Contas** com cálculo de saldo total e cards individuais (Nubank, Inter, C6 Bank) com efeito radial glow.
  - Card **Despesas por Categoria** com gráfico de rosca (Donut Chart em SVG puro) exibindo simultaneamente as fatias coloridas proporcionais a cada categoria (*Moradia*, *Alimentação*, *Estudos*, *Outros*) e destaque interativo no `hover`.
  - Card **Orçamento Restante** com barras de progresso dinâmicas (*Mercado e alimentação*, *Livros e materiais*, *Lazer e passeios*).
- **Páginas com estrutura inicial (placeholders prontos para desenvolvimento):**
  - `@src/app/planejamento/page.tsx`
  - `@src/app/investimentos/page.tsx`
  - `@src/app/hub-academico/page.tsx`
  - `@src/app/educacao/page.tsx`
  - `@src/app/relatorios/page.tsx`
  - `@src/app/ajuda/page.tsx`
  - `@src/app/configuracoes/page.tsx`

## 5. Diretrizes de Desenvolvimento para o Agente
1. **Fidelidade aos Protótipos:** Sempre que o usuário enviar uma imagem do Figma para uma das páginas, siga rigorosamente as cores da respectiva aba, tipografia, arredondamentos (`rounded-xl`, `rounded-2xl`) e espaçamentos.
2. **Interatividade Front-end:** Enquanto o back-end não for acoplado, implemente estados reais com `useState` (filtros funcionais, modais de criação/edição, cálculos dinâmicos de saldos e gráficos em SVG ou componentes leves) para que a tela seja testável de ponta a ponta.
3. **Componentização Limpa:** Evite instalar bibliotecas pesadas de gráficos se o visual puder ser resolvido com SVG nativo e Tailwind CSS com alta fidelidade.
4. **Verificação de Código:** Garanta que todas as tags JSX estejam devidamente fechadas e tipadas em TypeScript sem usar `any`.
## 6. Protocolo de Auto-Atualização do GEMINI.md (Obrigatório)
O agente deve manter este documento sempre sincronizado com o estado real do código:
1. **Ao concluir qualquer nova funcionalidade ou página:** Atualize a seção `4. Arquitetura Atual de Arquivos`, mudando o status da página de "placeholder" para "concluída" e descrevendo brevemente os componentes, estados e regras criadas.
2. **Ao adicionar novas bibliotecas, variáveis de ambiente ou regras de design:** Registre imediatamente nas seções correspondentes.
3. **Ao final de cada sessão de desenvolvimento:** Faça uma revisão rápida deste arquivo para garantir que nenhuma alteração arquitetural recente ficou de fora.