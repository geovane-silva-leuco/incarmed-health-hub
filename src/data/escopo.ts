/**
 * Escopo e Não Escopo organizados por solução.
 * Cada bloco lista o que a Leucotron entrega e o que não faz parte
 * do escopo daquela solução específica.
 */
export type EscopoSolucao = {
  id: string;
  solucao: string;
  escopo: string[];
  naoEscopo: string[];
};

export const escopoPorSolucao: EscopoSolucao[] = [
  {
    id: "conecta",
    solucao: "Conecta · WhatsApp",
    escopo: [
      "Ativação da plataforma omnichannel (WhatsApp, redes sociais, webchat, e-mail e voz)",
      "Configuração de filas, agentes, supervisores e fluxos de atendimento",
      "Dashboard de monitoramento em tempo real e avaliação do atendimento",
      "Treinamento inicial da equipe",
    ],
    naoEscopo: [
      "Criação, aprovação ou gestão de templates HSM junto à Meta (devem ser fornecidos já aprovados pelo cliente)",
      "Operação diária das filas e campanhas do cliente",
      "Responsabilidade por bloqueios, custos ou instabilidades da Meta/WhatsApp",
    ],
  },
  {
    id: "agente",
    solucao: "Agente Inteligente",
    escopo: [
      "Configuração do agente por texto sobre a base de conhecimento fornecida pelo cliente",
      "Ajuste de personalidade, tom de voz e regras de escalonamento para atendente humano",
      "Leitura de imagens enviadas pelo paciente (carteirinha, pedido médico e similares)",
      "Integração com Conecta e demais canais compatíveis",
    ],
    naoEscopo: [
      "Diagnóstico médico, prescrição ou decisão clínica automatizada (a IA é apenas orientativa)",
      "Garantia de leitura perfeita por OCR ou por leitura de imagem",
      "Criação de conteúdo e curadoria da base de conhecimento",
    ],
  },
  {
    id: "flux",
    solucao: "Flux 3.0 · PABX",
    escopo: [
      "Instalação e configuração do PABX (Cloud ou On-Premise, conforme modalidade contratada)",
      "Provisionamento de ramais, troncos, URAs, filas e gravação",
      "Ativação do Call Center (agentes, supervisores e Avali-e) e do Mobi Colaboração",
      "Treinamento inicial de administradores e supervisores",
    ],
    naoEscopo: [
      "Alterações na infraestrutura física de telefonia, rede, elétrica ou servidores do cliente",
      "Suporte funcional a sistemas de terceiros integrados ao PABX",
    ],
  },
  {
    id: "voicebot",
    solucao: "VoiceBOT",
    escopo: [
      "Ativação da plataforma de voz e integração via SIP com o PABX existente",
      "Configuração do agente de voz (voz natural ElevenLabs, RAG e fluxos)",
      "Monitoramento, auditoria e consumo em tempo real",
    ],
    naoEscopo: [
      "Contratação ou operação do tronco SIP externo (fica sob responsabilidade do cliente)",
      "Roteiros e campanhas de conteúdo, salvo contratação específica",
    ],
  },
  {
    id: "sob-medida",
    solucao: "Sob Medida · Integração PIXEON",
    escopo: [
      "Integração Conecta + PIXEON com fluxo de atendimento digital (Frente 1)",
      "Recuperação automática de no-show via HSM WhatsApp (Frente 2)",
      "Atendimento inteligente por voz com VoiceBOT integrado ao PIXEON (Frente 3)",
      "Automação de marketing e disparo de campanhas segmentadas (Frente 4)",
      "Check-in financeiro online e validação pré-chegada (Frente 5)",
      "Homologação técnica dos fluxos junto ao time do cliente",
    ],
    naoEscopo: [
      "Customizações internas no PIXEON, ERP/PACS, CRM ou qualquer sistema de terceiros",
      "Criação de novas funcionalidades dentro do PIXEON",
      "Criação de aplicativo móvel dedicado (canais previstos são WhatsApp, Conecta, VoiceBOT e Flux)",
      "Criação, contratação ou homologação de gateway de pagamento próprio",
      "Homologações bancárias, financeiras, fiscais ou regulatórias",
      "Criação de campanhas, estratégia de marketing ou redação de conteúdo, salvo contratação específica",
      "Suporte funcional ao PIXEON, gateway de pagamento, CRM/ERP ou infraestrutura do cliente",
      "Qualquer item não descrito explicitamente no escopo técnico e comercial aprovado",
    ],
  },
];

/** Mantido por compatibilidade com apresentar.tsx / referências antigas. */
export const escopoResumo = escopoPorSolucao.flatMap((s) => s.escopo);
export const naoEscopo = escopoPorSolucao.flatMap((s) => s.naoEscopo);
