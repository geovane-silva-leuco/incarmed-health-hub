export type Responsavel = "Cliente" | "Leucotron" | "Ambos" | "Cliente + PIXEON" | "Cliente + fornecedor";

export type DependenciaItem = {
  item: string;
  responsavel: Responsavel;
  /** Solução ou trilha à qual o item pertence (rótulo curto). */
  solucao?: string;
  /** Status atual. Default "pendente" quando ausente. */
  status?: "pendente" | "enviado" | "nao-aplica";
  /** Observação exibida quando o status é diferente do padrão. */
  nota?: string;
  /** Se true, o item só se aplica no Flux On-Premise. */
  apenasFluxOnPremise?: boolean;
};

export const dependenciasBloqueantes: DependenciaItem[] = [
  {
    item: "Documentação completa das APIs REST do PIXEON, incluindo endpoints, payloads, autenticação e regras de negócio",
    responsavel: "Cliente + PIXEON",
    solucao: "Sob Medida · PIXEON",
    status: "enviado",
    nota: "Enviado, aguardando validação.",
  },
  {
    item: "Credenciais de acesso às APIs (tokens, chaves e certificados)",
    responsavel: "Cliente + PIXEON",
    solucao: "Sob Medida · PIXEON",
    status: "enviado",
    nota: "Enviado, aguardando validação.",
  },
  {
    item: "Suporte técnico do PIXEON disponível durante integração, testes e homologação",
    responsavel: "Cliente",
    solucao: "Sob Medida · PIXEON",
  },
  {
    item: "Templates HSM previamente aprovados pela Meta (WhatsApp) para o Conecta",
    responsavel: "Cliente",
    solucao: "Conecta · WhatsApp",
  },
  {
    item: "Documentação da API do gateway de pagamento (aplica-se se a Frente 5 for executada)",
    responsavel: "Cliente + fornecedor",
    solucao: "Sob Medida · Frente 5",
  },
];

export const dependenciasInfra: DependenciaItem[] = [
  {
    item: "Ambiente Flux 3 em operação, com acesso remoto liberado",
    responsavel: "Cliente",
    solucao: "Flux 3.0",
    apenasFluxOnPremise: true,
  },
  {
    item: "Ambiente Conecta em operação, com credenciais administrativas",
    responsavel: "Ambos",
    solucao: "Conecta · WhatsApp",
  },
  {
    item: "Ambiente de VoiceBOT (número externo, ramal, fila ou rota telefônica)",
    responsavel: "Ambos",
    solucao: "VoiceBOT",
  },
];

export const dependenciasConteudo: DependenciaItem[] = [
  {
    item: "Base de conhecimento para o Agente Inteligente e VoiceBOT (FAQ, preparo de exames, convênios e políticas)",
    responsavel: "Cliente",
    solucao: "Agente Inteligente · VoiceBOT",
  },
  {
    item: "Definição dos fluxos de atendimento (menus, regras de transferência e filas de destino)",
    responsavel: "Ambos",
    solucao: "Conecta · Agente Inteligente",
  },
  {
    item: "Definição das campanhas (periodicidade, público, opt-in e opt-out)",
    responsavel: "Cliente",
    solucao: "Sob Medida · Frente 4",
  },
  {
    item: "Definição da personalidade do agente (tom de voz, formalidade e empatia)",
    responsavel: "Cliente",
    solucao: "Agente Inteligente",
  },
  {
    item: "Participação na homologação dos fluxos e aceite final",
    responsavel: "Ambos",
    solucao: "Todas as soluções",
  },
];
