export const oportunidade = {
  cliente: "Incarmed",
  segmento: "Hospital / clínica de grande porte — Bahia",
  contatos: [
    { nome: "Audrey", papel: "Contato inicial" },
    { nome: "João Victor", papel: "Supervisor da Central de Relacionamento (responsável técnico do lado do cliente)" },
    { nome: "Anderson", papel: "TI do cliente (a envolver na próxima etapa)" },
  ],
  dorPrincipal:
    "O hospital já tem uma plataforma de telefonia + WhatsApp, mas está travado para adicionar IA porque a ferramenta atual não assume a criação da API de integração com o sistema interno (PIXEON/Smart). O cliente precisa que a Leucotron intermedie essa integração.",
  necessidade:
    "Plataforma multicanal única (telefonia + WhatsApp), com painel de monitoramento em tempo real, transferência entre setores (entrega de exames, autorização etc.), disparo de campanhas, repescagem automática de no-show, relatórios por palavra-chave e histórico completo de atendimento.",
  confirmacaoAgenda:
    "Já tentaram por ligação (baixa efetividade, gerava reclamações por ligações duplicadas). Preferência clara por WhatsApp.",
  volumes: [
    { label: "Mensagens de WhatsApp / mês", valor: "~15 a 16 mil" },
    { label: "Equipe de atendimento", valor: "~38 pessoas" },
    { label: "Telefonistas — manhã", valor: "13" },
    { label: "Telefonistas — tarde", valor: "12" },
    { label: "Exclusivas de WhatsApp", valor: "7" },
    { label: "Colaboradores totais no hospital", valor: "~700 a 800" },
  ],
  referencias: [
    "Unimed Santos",
    "Unimed Mineiro",
    "Unimed Capixaba",
    "Hospital Sírio-Libanês",
  ],
  status:
    "Proposta enviada. Próximo passo: envolver o time de TI (Anderson) para validar requisitos técnicos de telefonia e formalizar o orçamento.",
};
