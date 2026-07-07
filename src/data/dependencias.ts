export type Responsavel = "Cliente" | "Leucotron" | "Ambos" | "Cliente + PIXEON" | "Cliente + fornecedor";

export const dependenciasBloqueantes: { item: string; responsavel: Responsavel }[] = [
  { item: "Documentação completa das APIs REST do PIXEON (endpoints, payloads, autenticação, regras de negócio)", responsavel: "Cliente + PIXEON" },
  { item: "Credenciais de acesso às APIs (tokens, chaves, certificados)", responsavel: "Cliente + PIXEON" },
  { item: "Suporte técnico do PIXEON disponível durante integração, testes e homologação", responsavel: "Cliente" },
  { item: "Templates HSM previamente aprovados pela Meta", responsavel: "Cliente" },
  { item: "Documentação da API do gateway de pagamento (se a Frente 5 for executada)", responsavel: "Cliente + fornecedor" },
];

export const dependenciasInfra: { item: string; responsavel: Responsavel }[] = [
  { item: "Ambiente Flux 3 em operação, com acesso remoto liberado", responsavel: "Cliente" },
  { item: "Ambiente Conecta em operação, com credenciais administrativas", responsavel: "Ambos" },
  { item: "Ambiente de VoiceBOT (número externo, ramal, fila ou rota telefônica)", responsavel: "Ambos" },
];

export const dependenciasConteudo: { item: string; responsavel: Responsavel }[] = [
  { item: "Base de conhecimento para o Agente Inteligente e VoiceBOT (FAQ, preparo de exames, convênios, políticas)", responsavel: "Cliente" },
  { item: "Definição dos fluxos de atendimento (menus, regras de transferência, filas de destino)", responsavel: "Ambos" },
  { item: "Definição das campanhas (periodicidade, público, opt-in/opt-out)", responsavel: "Cliente" },
  { item: "Definição da personalidade do agente (tom de voz, formalidade, empatia)", responsavel: "Cliente" },
  { item: "Participação na homologação dos fluxos e aceite final", responsavel: "Ambos" },
];
