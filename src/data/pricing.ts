// Todos os valores extraídos das propostas comerciais reais Leucotron × Incarmed.
// NÃO arredondar, NÃO inventar. Fonte única de verdade do app.

export const conectaPacotesMensagens = [
  { mensagens: 10000, valorMensal: 683.0, valorExcedente: 0.07513 },
  { mensagens: 15000, valorMensal: 945.0, valorExcedente: 0.0693 },
  { mensagens: 20000, valorMensal: 1260.0, valorExcedente: 0.0693 },
  { mensagens: 25000, valorMensal: 1531.0, valorExcedente: 0.06736 },
  { mensagens: 30000, valorMensal: 1838.0, valorExcedente: 0.06739 },
  { mensagens: 35000, valorMensal: 2143.0, valorExcedente: 0.06735 },
  { mensagens: 40000, valorMensal: 2450.0, valorExcedente: 0.06738 },
  { mensagens: 45000, valorMensal: 2756.0, valorExcedente: 0.06737 },
  { mensagens: 50000, valorMensal: 3063.0, valorExcedente: 0.06739 },
  { mensagens: 55000, valorMensal: 3368.0, valorExcedente: 0.06736 },
  { mensagens: 60000, valorMensal: 3675.0, valorExcedente: 0.06738 },
  { mensagens: 65000, valorMensal: 4012.0, valorExcedente: 0.0679 },
  { mensagens: 70000, valorMensal: 4155.0, valorExcedente: 0.06529 },
  { mensagens: 100000, valorMensal: 5009.0, valorExcedente: 0.0551 },
  { mensagens: 200000, valorMensal: 7829.0, valorExcedente: 0.04306 },
  { mensagens: 300000, valorMensal: 10618.0, valorExcedente: 0.03893 },
];

// Valor de base recomendado para o cliente Incarmed (~15-16 mil msg/mês)
export const conectaValorBaseMensal = 1531.0; // pacote 25k

export const conectaTaxaMidia = [
  { de: 5, ate: 10, valor: 0.01945 },
  { de: 10, ate: 15, valor: 0.02735 },
  { de: 15, ate: 20, valor: 0.03647 },
  { de: 20, ate: 25, valor: 0.04558 },
  { de: 25, ate: 30, valor: 0.0547 },
  { de: 30, ate: 35, valor: 0.06382 },
  { de: 35, ate: 40, valor: 0.07293 },
  { de: 40, ate: 45, valor: 0.08205 },
  { de: 45, ate: 50, valor: 0.09117 },
  { de: 50, ate: 55, valor: 0.10028 },
  { de: 55, ate: 60, valor: 0.1094 },
  { de: 60, ate: 65, valor: 0.11852 },
  { de: 65, ate: 70, valor: 0.12764 },
  { de: 70, ate: 75, valor: 0.13675 },
  { de: 75, ate: 80, valor: 0.14587 },
  { de: 80, ate: 85, valor: 0.15499 },
  { de: 85, ate: 90, valor: 0.1641 },
  { de: 90, ate: 95, valor: 0.17322 },
  { de: 95, ate: 100, valor: 0.18234 },
];

export const conectaBIC = [
  { tipo: "Utility", descricao: "Atualizações pós-transação", valor: 0.22 },
  { tipo: "Marketing", descricao: "Funil de marketing, ofertas (requer opt-in)", valor: 0.4 },
  { tipo: "Authentication", descricao: "Autenticação com código único (OTP)", valor: 0.2 },
];

export const conectaArmazenamentoAdicional = 30.0;
export const conectaAtivacaoPremium = 2000.0;

export const conectaRecursosIlimitados = [
  "Agentes e supervisores ilimitados",
  "Canais: WhatsApp, Facebook Messenger, Comentários FB/IG, Instagram Direct, WebChat, Telegram, Microsoft Teams, SMS, E-mail e Voz",
  "Fluxos de automação por canal",
  "1GB de armazenamento incluso (expansível)",
];

export const conectaDestaques = [
  "Atendimento omnichannel unificado numa única tela",
  "Atendimento simultâneo (mais de um agente na mesma conversa)",
  "Pré-atendimento automático, triagem, FAQ e chatbot",
  "Dashboard de monitoramento em tempo real",
  "Avaliação de atendimento (nota do cliente)",
  "Integração com CRM/ERP via API",
  "STT (transcrição de áudio), análise de sentimento, tradução automática, OCR — via integrações de IA",
];

// ---------- Agente Inteligente ----------

export type PlanoAgente = "Tiny" | "Small" | "Medium";

export const agenteInteligentePlanos: {
  plano: PlanoAgente;
  limites: string;
  valorMensal: number;
}[] = [
  {
    plano: "Tiny",
    limites: "Até 5 agentes, 600 fontes, 100MB de dados treinados, 1GB de armazenamento",
    valorMensal: 1447.0,
  },
  {
    plano: "Small",
    limites: "Até 10 agentes, 1.200 fontes, 200MB de dados treinados, 2GB de armazenamento",
    valorMensal: 1745.0,
  },
  {
    plano: "Medium",
    limites: "Até 20 agentes, 5.000 fontes, 800MB de dados treinados, 6GB de armazenamento",
    valorMensal: 2854.0,
  },
];

export const agenteInteligente = {
  ativacaoMinima: 1500.0,
  horaAdicionalForaEscopo: 120.0,
  suporteTecnicoMensal: "4 horas/mês, não acumulativas (todos os planos)",
  cobrancaLLM: { input: 16.8, output: 67.2 },
  descricao:
    "Sistema de atendimento inteligente 24/7 baseado em IA generativa. Responde dúvidas apoiado em base de conhecimento, sugere respostas para o agente humano e executa ações simples em sistemas integrados (consultar status, gerar 2ª via, registrar solicitações). Também faz leitura de imagens enviadas pelo paciente (carteirinha do plano de saúde, pedido médico e similares); leitura de imagem consome mais créditos que texto. Aplicável em WhatsApp, Webchat, e-mail, Mobi e demais canais compatíveis.",
};

// ---------- Flux 3.0 ----------

export const fluxModalidadeCloud = {
  nome: "Licença + Hospedagem Gerenciada pela Leucotron (Cloud)",
  pagamento: "Mensal (SaaS)",
  quemHospeda: "Leucotron",
  itens: [
    { ref: "SV03189", desc: "Flux 3.0 Essential – 30 Chamadas / 150 Ramais", qtd: 1, unitario: 3026.25, total: 3026.25 },
    { ref: "SV03423", desc: "Contact Board – Telefonista (incluso)", qtd: 1, unitario: 0, total: 0 },
    { ref: "-", desc: "Mobi Colaboração (Chat + Vídeo + Calendário, incluso)", qtd: 150, unitario: 0, total: 0 },
    { ref: "-", desc: "Gravação 250h (incluso)", qtd: 1, unitario: 0, total: 0 },
    { ref: "SV03431", desc: "Espaço Adicional de Gravação (1.000h / 100GB)", qtd: 1, unitario: 112.5, total: 112.5 },
    { ref: "SV03395", desc: "Call Center – Agente (inclui 1 Contact Board)", qtd: 25, unitario: 47.25, total: 1181.25 },
    { ref: "SV03407", desc: "Call Center – Supervisor", qtd: 3, unitario: 67.5, total: 202.5 },
    { ref: "SV03093", desc: "Avali-e", qtd: 1, unitario: 150.0, total: 150.0 },
  ],
  ativacaoUnica: 4672.5,
  totalMensal: 4672.5,
  equivalenteAnual12x: 56070.0,
  investimentoPorUsuario: 31.15,
};

export const fluxModalidadeOnPremise = {
  nome: "Licenciamento Anual — Hospedagem gerenciada pela Incarmed",
  pagamento: "Anual (pode ser parcelado em 1+5 sem juros ou até 10x, a negociar)",
  quemHospeda: "Incarmed (cliente mantém autonomia total sobre a infra)",
  itens: [
    { ref: "SV03569", desc: "Flux 3.0 Essential – 30 Chamadas / 150 Ramais", qtd: 1, unitario: 21195.0, total: 21195.0 },
    { ref: "SV03423", desc: "Contact Board – Telefonista (incluso)", qtd: 1, unitario: 0, total: 0 },
    { ref: "-", desc: "Mobi Colaboração (incluso)", qtd: 150, unitario: 0, total: 0 },
    { ref: "-", desc: "Gravação de 100% dos ramais e troncos (conforme disco do servidor)", qtd: 1, unitario: 0, total: 0 },
    { ref: "SV03395", desc: "Call Center – Agente (inclui 1 Contact Board)", qtd: 25, unitario: 567.0, total: 14175.0 },
    { ref: "SV03407", desc: "Call Center – Supervisor", qtd: 3, unitario: 810.0, total: 2430.0 },
    { ref: "SV03093", desc: "Avali-e", qtd: 1, unitario: 1800.0, total: 1800.0 },
  ],
  ativacaoUnica: 3300.0,
  totalAnual: 39600.0,
  equivalenteMensal: 3300.0,
  investimentoPorUsuario: 22.0,
  observacao:
    "Licença válida para até 2 anos nesta condição, podendo se estender até 5 anos. Valor apresentado refere-se a 1 ano — multiplicar pela quantidade de anos desejada.",
};

export const fluxPlanosOpcionais = [
  { recurso: "Softphone para Telefonista (Contact Board)", basic: true, essential: true, advanced: true },
  { recurso: "Softphone para Usuários (Mobi Softphone)", basic: true, essential: false, advanced: false },
  { recurso: "Call Center (Agente, Supervisor ou Discador)", basic: false, essential: true, advanced: true },
  { recurso: "Flux Analytics – Dashboards de Telefonia", basic: true, essential: true, advanced: true },
  { recurso: "Flux Analytics – Dashboards Call Center + Telefonia", basic: false, essential: true, advanced: true },
  { recurso: "Sistema de Tarifação (Phone Report)", basic: true, essential: true, advanced: true },
  { recurso: "Sistema de Avaliação de Atendimentos", basic: false, essential: true, advanced: true },
  { recurso: "Espaço Adicional de Gravação (Flux)", basic: false, essential: true, advanced: true },
  { recurso: "Espaço Adicional de Gravação (Mobi)", basic: false, essential: true, advanced: true },
  { recurso: "Hospedagem Dedicada para Mobi Colaboração", basic: false, essential: true, advanced: true },
  { recurso: "Pacotes Adicionais de IA (transcrição, resumos, insights)", basic: false, essential: false, advanced: true },
  { recurso: "Hospedagem Dedicada ou On Premise para IA", basic: false, essential: false, advanced: true },
  { recurso: "Servidor On Premise para Flux 3.0", basic: true, essential: true, advanced: true },
];

export const fluxRecursosTelefonia = [
  "Ramal IP", "Tronco IP", "URA (Unidade de Resposta Audível)", "Filas de Atendimento",
  "Grupos de Atendimento", "DDR (Discagem Direta a Ramal)", "Roteamento Inteligente de Chamadas",
  "Bilhetagem Detalhada", "Correio de Voz", "Mensagens de Espera Personalizadas",
  "Siga-me", "Não Perturbe (DND)", "Conferência Multiusuário", "Rediscagem Automática",
  "Captura de Chamadas",
];

export const fluxRecursosIA = [
  "Transcrição automática de chamadas",
  "Resumos inteligentes por tópicos (tarefas, responsáveis, prazos)",
  "Insights estratégicos para gestão e melhoria contínua",
  "Auditoria automatizada para conformidade e segurança",
  "Interação tipo chat com o conteúdo da ligação (perguntar sobre a reunião)",
  "Análise de sentimento por ligação/conversa",
];

// ---------- VoiceBOT ----------

export const voicebot = {
  creditosIncluidos: 1_500_000,
  agentesNumeroAtendimento: 3,
  suporte: "Prioritário",
  valorExcedentePor1000Creditos: 1.69,
  ativacaoPlataformaMais1Agente: "1 mensalidade",
  ativacaoAgenteExtra: "1/2 mensalidade",
  valorMensal: 2699.0,
  anualAVista: 28501.0,
  equivalenteMensalNoAnual: 2375.0,
};

export const voicebotModulos = [
  "Voz natural (parceria com ElevenLabs)",
  "Integração via SIP (tronco SIP, ramal SIP ou encaminhamento; opera junto ao PABX existente)",
  "Base de conhecimento (RAG)",
  "Integrações via API (CRM / ERP / Tickets)",
  "Monitoramento, auditoria e consumo em tempo real",
];

export const voicebotCasosDeUso = [
  { area: "Atendimento e Recepção", desc: "Boas-vindas, direcionamento por motivo, transferência por setor/ramal" },
  { area: "Financeiro", desc: "2ª via, status de pagamento, cobrança amigável, negociação inicial" },
  { area: "Agendamento e Confirmação", desc: "Confirmar, remarcar, cancelar, reduzir no-show" },
  { area: "Comercial", desc: "Qualificação de lead antes do vendedor" },
  { area: "Suporte Nível 1 (RAG)", desc: "Respostas por FAQ, procedimentos, abertura de chamado" },
  { area: "RH / Corporativo", desc: "Informações e triagens internas" },
];

// ---------- Sob Medida ----------

export const sobMedida = {
  valorMensal: 1447.0,
  ativacaoUnica: 2100.0,
  cobrancaLLM: { input: 16.8, output: 67.2 },
  descricao:
    "Projeto de desenvolvimento sob encomenda para estruturar um ecossistema de comunicação, automação e atendimento inteligente integrado ao ERP/PACS PIXEON, usando Conecta, Agente Inteligente, VoiceBOT e Flux como base. Não é um produto de prateleira.",
};

export const sobMedidaFrentes = [
  {
    id: 1,
    titulo: "Integração Conecta + PIXEON e fluxo de atendimento digital com Agente Inteligente",
    subitens: [
      { nome: "Agendamento e Reagendamento", desc: "Coleta CPF/dados via Agente Inteligente, consulta REST ao PIXEON (especialidades, profissionais, horários) e confirma agendamento." },
      { nome: "Triagem inteligente", desc: "Apoio orientativo para direcionar especialidade. Não realiza diagnóstico médico, prescrição ou decisão clínica." },
      { nome: "Esclarecimento de dúvidas", desc: "Respostas com base na base de conhecimento fornecida pelo cliente (horários, preparo de exames, convênios etc.)." },
      { nome: "Transferência para atendente humano", desc: "Ocorre quando o paciente solicita, há falha de integração, ou o caso exige avaliação manual." },
    ],
  },
  {
    id: 2,
    titulo: "Recuperação de No-show / Não Comparecimento",
    subitens: [
      { nome: "Recuperação automática de faltas", desc: "Middleware consulta periodicamente a API do PIXEON, identifica ausências do dia e aciona envio de HSM via WhatsApp oferecendo reagendamento." },
      { nome: "Middleware ativo de consulta periódica", desc: "Componente interno que evita disparos duplicados, registra logs de sucesso/falha e aciona o Conecta." },
    ],
  },
  {
    id: 3,
    titulo: "Atendimento inteligente por voz com VoiceBOT",
    subitens: [
      { nome: "Agendamento e reagendamento por voz", desc: "Mesmo fluxo da Frente 1, mas conduzido por voz." },
      { nome: "Triagem inteligente por voz", desc: "Apoio orientativo, sem decisão clínica." },
      { nome: "Esclarecimento de dúvidas por voz", desc: "Baseado na base de conhecimento do cliente." },
      { nome: "Transferência para atendente humano", desc: "Para o Call Center/fila/ramal definido no Flux." },
    ],
  },
  {
    id: 4,
    titulo: "Automação de marketing e relacionamento",
    subitens: [
      { nome: "Disparos automatizados via Webhook", desc: "Cliente fornece CSV com contatos + template HSM aprovado pela Meta; Conecta realiza o disparo." },
      { nome: "Campanhas segmentadas", desc: "Aniversário, relacionamento, por convênio/perfil, orientações preventivas. Segmentação é responsabilidade do ERP/CRM/sistema do cliente." },
    ],
  },
  {
    id: 5,
    titulo: "Check-in financeiro online e validação pré-chegada",
    subitens: [
      { nome: "Integração com gateway de pagamento (Pix)", desc: "Sistema consome API de gateway fornecida pelo cliente (QR Code, copia-e-cola, link). Leucotron não processa pagamento diretamente, apenas consome a API." },
      { nome: "Validação pré-chegada e redução de filas", desc: "Valida dados cadastrais, documentação, convênio, pedido médico antes da chegada do paciente." },
      { nome: "Limitações", desc: "Criação/homologação do gateway de pagamento NÃO faz parte do escopo — deve ser fornecido pelo cliente." },
    ],
  },
];
