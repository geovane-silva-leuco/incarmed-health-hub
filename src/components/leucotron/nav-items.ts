import {
  LayoutDashboard, Building2, MessageSquare, Bot, PhoneCall, Mic,
  Wrench, Wallet, ListChecks, Link2, CalendarDays, FileSignature,
} from "lucide-react";

/**
 * Itens do menu, agrupados em seções visíveis na sidebar.
 * Cada seção representa uma fase do roteiro de venda.
 */
export const navSections = [
  {
    id: "contexto",
    label: "Contexto",
    items: [
      { title: "Dashboard Geral", url: "/", icon: LayoutDashboard },
      { title: "Sobre a Oportunidade", url: "/oportunidade", icon: Building2 },
    ],
  },
  {
    id: "solucoes",
    label: "Soluções",
    items: [
      { title: "Conecta", url: "/conecta", icon: MessageSquare },
      { title: "Agente Inteligente", url: "/agente", icon: Bot },
      { title: "Flux 3.0", url: "/flux", icon: PhoneCall },
      { title: "VoiceBOT", url: "/voicebot", icon: Mic },
      { title: "Sob Medida", url: "/sob-medida", icon: Wrench },
    ],
  },
  {
    id: "consolidacao",
    label: "Consolidação",
    items: [
      { title: "Financeiro Consolidado", url: "/financeiro", icon: Wallet },
      { title: "Escopo & Não Escopo", url: "/escopo", icon: ListChecks },
      { title: "Dependências", url: "/dependencias", icon: Link2 },
      { title: "Cronograma", url: "/cronograma", icon: CalendarDays },
    ],
  },
  {
    id: "fechamento",
    label: "Fechamento",
    items: [
      { title: "Aprovação da Proposta", url: "/aprovacao", icon: FileSignature },
    ],
  },
] as const;

export const allNavItems = navSections.flatMap((s) => s.items as ReadonlyArray<{ title: string; url: string; icon: typeof LayoutDashboard }>);
