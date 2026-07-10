import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FileSignature, CheckCircle2, Settings2, Lock } from "lucide-react";
import jsPDF from "jspdf";
import { SectionTitle } from "@/components/leucotron/brand";
import { SegmentedToggle } from "@/components/leucotron/segmented-toggle";
import {
  useProposalConfig, setProposalConfig, getConectaPacote, getAgentePlano,
  type FluxModalidade, type VoiceBotModo,
} from "@/lib/proposal-config";
import { conectaPacotesMensagens, agenteInteligentePlanos, sobMedidaFrentes, type PlanoAgente } from "@/data/pricing";
import { formatBRL, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/aprovacao")({
  head: () => ({
    meta: [
      { title: "Aprovação da Proposta — Incarmed × Leucotron" },
      { name: "description", content: "Confirmação e assinatura da proposta comercial." },
    ],
  }),
  component: AprovacaoPage,
});

type SolucaoId = "conecta" | "agente" | "flux" | "voicebot" | "sob-medida";

const SOLUCOES: { id: SolucaoId; label: string }[] = [
  { id: "conecta", label: "Conecta · WhatsApp Business API" },
  { id: "agente", label: "Agente Inteligente (IA por texto)" },
  { id: "flux", label: "Flux 3.0 (PABX)" },
  { id: "voicebot", label: "VoiceBOT (atendimento por voz)" },
  { id: "sob-medida", label: "Sob Medida (integração PIXEON)" },
];

interface Contato {
  nome: string;
  cargo: string;
  cpf: string;
  email: string;
  telefone: string;
}

const contatoVazio: Contato = { nome: "", cargo: "", cpf: "", email: "", telefone: "" };
const DESTINATARIO = "geovane.silva@leucotron.com.br";

function AprovacaoPage() {
  const cfg = useProposalConfig();
  const conectaPacote = getConectaPacote(cfg);
  const agente = getAgentePlano(cfg);

  const [leuEEntendi, setLeuEEntendi] = useState(false);
  const [responsavel, setResponsavel] = useState<Contato>({ ...contatoVazio });
  const [testemunha, setTestemunha] = useState<Contato>({ ...contatoVazio });
  const [tecnico, setTecnico] = useState<Contato>({ ...contatoVazio });
  const [enviado, setEnviado] = useState(false);

  // Check binário "sim/não" por solução. Conecta, Agente e Flux permanecem
  // sempre disponíveis (podem ser retirados desmarcando o "sim"). VoiceBOT
  // e Sob Medida têm seu próprio estado dentro da ProposalConfig.
  const [incluiConecta, setIncluiConecta] = useState(true);
  const [incluiAgente, setIncluiAgente] = useState(true);
  const [incluiFlux, setIncluiFlux] = useState(true);
  const incluiVoicebot = cfg.voicebotModo !== "off";
  const incluiSobMedida = cfg.sobMedidaFrentes.length > 0;

  // Se o cliente desativar o VoiceBOT/Sob Medida, refletir no config.
  // Ao reativar, restaurar valores padrão.
  const setIncluiVoicebot = (v: boolean) => {
    if (enviado) return;
    setProposalConfig({ voicebotModo: v ? "mensal" : "off" });
  };
  const setIncluiSobMedida = (v: boolean) => {
    if (enviado) return;
    setProposalConfig({ sobMedidaFrentes: v ? [1, 2, 3, 4, 5] : [] });
  };

  const solucoesAtivas: Record<SolucaoId, boolean> = {
    conecta: incluiConecta,
    agente: incluiAgente,
    flux: incluiFlux,
    voicebot: incluiVoicebot,
    "sob-medida": incluiSobMedida,
  };

  const configResumo = useMemo(() => ([
    {
      id: "conecta" as SolucaoId,
      solucao: "Conecta · WhatsApp",
      escolha: `Pacote de ${formatNumber(conectaPacote.mensagens)} mensagens por mês${cfg.conectaConfirmadorConsultas ? " com Confirmador de Consultas" : ""}`,
    },
    { id: "agente" as SolucaoId, solucao: "Agente Inteligente", escolha: `Plano ${agente.plano}` },
    {
      id: "flux" as SolucaoId,
      solucao: "Flux 3.0",
      escolha: cfg.fluxModalidade === "cloud" ? "Modalidade Cloud (SaaS mensal)" : "Modalidade On-Premise (licenciamento anual)",
    },
    {
      id: "voicebot" as SolucaoId,
      solucao: "VoiceBOT",
      escolha:
        cfg.voicebotModo === "off"
          ? "Não incluído nesta proposta"
          : cfg.voicebotModo === "mensal" ? "Contratação mensal" : "Contratação anual à vista",
    },
    {
      id: "sob-medida" as SolucaoId,
      solucao: "Sob Medida",
      escolha: cfg.sobMedidaFrentes.length === 0
        ? "Não incluído nesta proposta"
        : `${cfg.sobMedidaFrentes.length} de ${sobMedidaFrentes.length} frentes, IDs ${cfg.sobMedidaFrentes.join(", ")}`,
    },
  ]), [cfg, conectaPacote, agente]);

  const totalSelecionadas = (Object.values(solucoesAtivas) as boolean[]).filter(Boolean).length;

  const podeEnviar = useMemo(() => {
    if (!leuEEntendi || totalSelecionadas === 0) return false;
    const check = (c: Contato) => c.nome && c.cargo && c.cpf && c.email && c.telefone;
    return check(responsavel) && check(testemunha) && check(tecnico);
  }, [leuEEntendi, totalSelecionadas, responsavel, testemunha, tecnico]);

  // Sincroniza dependências úteis (não estritamente necessário aqui).
  useEffect(() => {}, [enviado]);

  function gerarPDF(): jsPDF {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const marginX = 48;
    let y = 56;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(10, 31, 68);
    doc.text("Aprovação da Proposta Comercial", marginX, y);
    y += 20;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Incarmed × Leucotron Telecom", marginX, y);
    y += 14;
    doc.text(`Emitido em ${new Date().toLocaleString("pt-BR")}`, marginX, y);
    y += 24;

    doc.setDrawColor(15, 97, 255);
    doc.setLineWidth(1);
    doc.line(marginX, y, 547, y);
    y += 20;

    const section = (title: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(10, 31, 68);
      doc.text(title, marginX, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
    };
    const line = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}: `, marginX, y);
      const w = doc.getTextWidth(`${label}: `);
      doc.setFont("helvetica", "normal");
      const wrapped = doc.splitTextToSize(value || "—", 500 - w);
      doc.text(wrapped, marginX + w, y);
      y += 14 * wrapped.length;
    };

    section("Confirmação");
    const declaracao = doc.splitTextToSize(
      "Declaro que li, entendi e aceito integralmente os termos da proposta comercial apresentada, incluindo escopo, valores, prazos e condições de contratação das soluções abaixo selecionadas.",
      500,
    );
    doc.text(declaracao, marginX, y);
    y += 14 * declaracao.length + 10;

    section("Soluções aprovadas");
    SOLUCOES.filter((s) => solucoesAtivas[s.id]).forEach((s) => {
      doc.text(`• ${s.label}`, marginX, y);
      y += 14;
    });
    y += 10;

    section("Configuração escolhida");
    configResumo.filter((r) => solucoesAtivas[r.id]).forEach((r) => line(r.solucao, r.escolha));
    y += 10;

    const bloco = (titulo: string, c: Contato) => {
      section(titulo);
      line("Nome completo", c.nome);
      line("Cargo", c.cargo);
      line("CPF", c.cpf);
      line("E-mail", c.email);
      line("Telefone", c.telefone);
      y += 10;
    };
    bloco("Responsável pela contratação e assinatura", responsavel);
    if (y > 700) { doc.addPage(); y = 56; }
    bloco("Testemunha", testemunha);
    if (y > 700) { doc.addPage(); y = 56; }
    bloco("Contato técnico (apoio à implantação)", tecnico);

    y += 20;
    doc.setDrawColor(200);
    doc.line(marginX, y, 547, y);
    y += 30;
    doc.text("_______________________________________________", marginX, y);
    y += 14;
    doc.text(`${responsavel.nome || "Responsável"} — ${responsavel.cargo || "Cargo"}`, marginX, y);
    y += 14;
    doc.text(`CPF ${responsavel.cpf || "—"}`, marginX, y);

    return doc;
  }

  function montarCorpoEmail(): string {
    const contatoTxt = (c: Contato) =>
      `  Nome: ${c.nome}\n  Cargo: ${c.cargo}\n  CPF: ${c.cpf}\n  E-mail: ${c.email}\n  Telefone: ${c.telefone}`;
    const sols = SOLUCOES.filter((s) => solucoesAtivas[s.id]).map((s) => `  - ${s.label}`).join("\n");
    return [
      "Aprovação da proposta comercial Incarmed × Leucotron",
      "",
      `Data ${new Date().toLocaleString("pt-BR")}`,
      "",
      "O responsável confirma que leu e entendeu integralmente a proposta comercial.",
      "",
      "SOLUÇÕES APROVADAS:",
      sols || "  (nenhuma)",
      "",
      "CONFIGURAÇÃO ESCOLHIDA:",
      configResumo.filter((r) => solucoesAtivas[r.id]).map((r) => `  - ${r.solucao}: ${r.escolha}`).join("\n") || "  (nenhuma)",
      "",
      "RESPONSÁVEL PELA CONTRATAÇÃO E ASSINATURA:",
      contatoTxt(responsavel),
      "",
      "TESTEMUNHA:",
      contatoTxt(testemunha),
      "",
      "CONTATO TÉCNICO (apoio à implantação):",
      contatoTxt(tecnico),
      "",
      "---",
      "PDF com dados completos anexo a este e-mail.",
    ].join("\n");
  }

  function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!podeEnviar) return;
    const doc = gerarPDF();
    doc.save(`aprovacao-incarmed-${new Date().toISOString().slice(0, 10)}.pdf`);
    const subject = encodeURIComponent(`Aprovação de proposta — Incarmed (${responsavel.nome})`);
    const body = encodeURIComponent(montarCorpoEmail());
    window.location.href = `mailto:${DESTINATARIO}?subject=${subject}&body=${body}`;
    setEnviado(true);
  }

  const solucoesEstado: { id: SolucaoId; label: string; ativa: boolean; setAtiva: (v: boolean) => void }[] = [
    { id: "conecta", label: "Conecta · WhatsApp Business API", ativa: incluiConecta, setAtiva: setIncluiConecta },
    { id: "agente", label: "Agente Inteligente (IA por texto)", ativa: incluiAgente, setAtiva: setIncluiAgente },
    { id: "flux", label: "Flux 3.0 (PABX)", ativa: incluiFlux, setAtiva: setIncluiFlux },
    { id: "voicebot", label: "VoiceBOT (atendimento por voz)", ativa: incluiVoicebot, setAtiva: setIncluiVoicebot },
    { id: "sob-medida", label: "Sob Medida (integração PIXEON)", ativa: incluiSobMedida, setAtiva: setIncluiSobMedida },
  ];

  return (
    <div>
      <SectionTitle
        eyebrow="Fechamento · Assinatura"
        title="Aprovação da Proposta"
        description="Confirme leitura, escolha quais soluções entram e preencha os dados de responsável, testemunha e contato técnico."
      />

      {enviado && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
          <div className="text-sm text-emerald-900">
            <p className="font-semibold">Aprovação registrada.</p>
            <p className="mt-1">Sua aprovação foi processada e a Leucotron entrará em contato para os próximos passos.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleEnviar} className="space-y-5">
        {/* Declaração */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--brand-navy)]">
            <FileSignature className="h-4 w-4 text-[var(--signal)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Declaração de leitura</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            Declaro que li, entendi e aceito integralmente os termos da proposta comercial apresentada,
            incluindo escopo, valores mensais e de ativação, prazos, dependências, cronograma e condições
            de contratação das soluções abaixo selecionadas.
          </p>
          <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-[var(--paper)] p-3 hover:bg-[var(--signal)]/5">
            <input
              type="checkbox"
              checked={leuEEntendi}
              onChange={(e) => setLeuEEntendi(e.target.checked)}
              className="h-4 w-4 accent-[var(--signal)]"
              required
            />
            <span className="text-sm font-semibold text-[var(--brand-navy)]">
              Li e entendi a proposta comercial na íntegra.
            </span>
          </label>
        </div>

        {/* Configuração — check binário sim/não por solução; seletor aparece quando sim */}
        <div className="rounded-xl border border-[var(--signal)]/40 bg-[var(--signal)]/5 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--brand-navy)]">
            <Settings2 className="h-4 w-4 text-[var(--signal)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Soluções que serão contratadas</h3>
            {enviado && (
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[var(--brand-navy)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                <Lock className="h-3 w-3" /> Aprovada — travada
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Marque "Sim" nas soluções que fazem parte desta proposta. Ao marcar, aparece o seletor de configuração daquela solução.
          </p>

          <div className="mt-4 space-y-3">
            {solucoesEstado.map((s) => (
              <div key={s.id} className="rounded-lg border border-border bg-white p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--brand-navy)]">{s.label}</p>
                  <SegmentedToggle
                    ariaLabel={`Incluir ${s.label}`}
                    size="sm"
                    disabled={enviado}
                    value={s.ativa ? "sim" : "nao"}
                    onChange={(v) => s.setAtiva(v === "sim")}
                    options={[
                      { value: "sim", label: "Sim" },
                      { value: "nao", label: "Não" },
                    ]}
                  />
                </div>

                {s.ativa && (
                  <div className="mt-3 border-t border-[var(--line-paper)] pt-3">
                    {s.id === "conecta" && (
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto] md:items-center">
                        <select
                          value={cfg.conectaPacoteMensagens}
                          onChange={(e) => setProposalConfig({ conectaPacoteMensagens: Number(e.target.value) })}
                          disabled={enviado}
                          className="w-full rounded-md border border-input bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Pacote Conecta"
                        >
                          {conectaPacotesMensagens.map((p) => (
                            <option key={p.mensagens} value={p.mensagens}>
                              {formatNumber(p.mensagens)} msg · {formatBRL(p.valorMensal)}/mês
                            </option>
                          ))}
                        </select>
                        <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={cfg.conectaConfirmadorConsultas}
                            onChange={(e) => setProposalConfig({ conectaConfirmadorConsultas: e.target.checked })}
                            disabled={enviado}
                            className="h-4 w-4 accent-[var(--signal)] disabled:cursor-not-allowed"
                          />
                          Incluir <strong>Confirmador de Consultas</strong>
                        </label>
                      </div>
                    )}
                    {s.id === "agente" && (
                      <SegmentedToggle
                        ariaLabel="Plano do Agente Inteligente"
                        size="sm"
                        disabled={enviado}
                        value={cfg.agentePlano}
                        onChange={(v: PlanoAgente) => setProposalConfig({ agentePlano: v })}
                        options={agenteInteligentePlanos.map((p) => ({ value: p.plano, label: p.plano }))}
                      />
                    )}
                    {s.id === "flux" && (
                      <SegmentedToggle
                        ariaLabel="Modalidade do Flux 3.0"
                        size="sm"
                        disabled={enviado}
                        value={cfg.fluxModalidade}
                        onChange={(v: FluxModalidade) => setProposalConfig({ fluxModalidade: v })}
                        options={[
                          { value: "cloud", label: "Cloud · Mensal" },
                          { value: "onpremise", label: "On-Premise · Anual" },
                        ]}
                      />
                    )}
                    {s.id === "voicebot" && (
                      <SegmentedToggle
                        ariaLabel="Contratação do VoiceBOT"
                        size="sm"
                        disabled={enviado}
                        value={cfg.voicebotModo === "off" ? "mensal" : (cfg.voicebotModo as VoiceBotModo)}
                        onChange={(v: VoiceBotModo) => setProposalConfig({ voicebotModo: v })}
                        options={[
                          { value: "mensal", label: "Mensal" },
                          { value: "anual", label: "Anual à vista" },
                        ]}
                      />
                    )}
                    {s.id === "sob-medida" && (
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Frentes incluídas ({cfg.sobMedidaFrentes.length}/{sobMedidaFrentes.length})
                        </p>
                        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                          {sobMedidaFrentes.map((f) => {
                            const incluida = cfg.sobMedidaFrentes.includes(f.id);
                            return (
                              <label
                                key={f.id}
                                className={`flex cursor-pointer items-start gap-2 rounded-md border p-2 text-xs transition-colors ${
                                  enviado ? "cursor-not-allowed opacity-70" : ""
                                } ${
                                  incluida ? "border-[var(--brand-navy)] bg-white" : "border-border bg-white/50 hover:border-[var(--brand-navy)]/40"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={incluida}
                                  disabled={enviado}
                                  onChange={(e) => {
                                    const next = e.target.checked
                                      ? [...cfg.sobMedidaFrentes, f.id].sort((a, b) => a - b)
                                      : cfg.sobMedidaFrentes.filter((id) => id !== f.id);
                                    setProposalConfig({ sobMedidaFrentes: next });
                                  }}
                                  className="mt-0.5 h-4 w-4 accent-[var(--brand-navy)] disabled:cursor-not-allowed"
                                />
                                <span className="leading-snug text-[var(--brand-navy)]">
                                  <strong>Frente {f.id}.</strong> {f.titulo}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Resumo */}
          <div className="mt-5 divide-y divide-[var(--signal)]/20 border-t border-[var(--signal)]/30 pt-3">
            <p className="pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Resumo do que será aprovado
            </p>
            {configResumo.map((r) => {
              const incluido = solucoesAtivas[r.id];
              return (
                <div key={r.id} className={`flex flex-col gap-1 py-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ${incluido ? "" : "opacity-40"}`}>
                  <p className="text-sm font-semibold text-[var(--brand-navy)]">
                    {r.solucao}
                    {!incluido && <span className="ml-2 text-[10px] font-normal uppercase text-muted-foreground">(não incluída)</span>}
                  </p>
                  <p className="text-sm text-foreground sm:text-right">{incluido ? r.escolha : "—"}</p>
                </div>
              );
            })}
          </div>
        </div>

        <ContatosCompactos
          responsavel={responsavel} setResponsavel={setResponsavel}
          testemunha={testemunha} setTestemunha={setTestemunha}
          tecnico={tecnico} setTecnico={setTecnico}
        />

        <div className="sticky bottom-4 z-10 flex flex-col items-stretch gap-3 rounded-xl border border-border bg-white p-3 shadow-lg sm:flex-row sm:items-center sm:justify-end">
          <button
            type="submit"
            disabled={!podeEnviar}
            className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-navy)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-navy)]/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Enviar aprovação
          </button>
        </div>
      </form>
    </div>
  );
}

/** Trio de contatos em layout compacto (3 colunas em desktop, 1 em mobile). */
function ContatosCompactos({
  responsavel, setResponsavel,
  testemunha, setTestemunha,
  tecnico, setTecnico,
}: {
  responsavel: Contato; setResponsavel: (c: Contato) => void;
  testemunha: Contato; setTestemunha: (c: Contato) => void;
  tecnico: Contato; setTecnico: (c: Contato) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <ContatoCard titulo="Responsável pela assinatura" value={responsavel} onChange={setResponsavel} />
      <ContatoCard titulo="Testemunha" value={testemunha} onChange={setTestemunha} />
      <ContatoCard titulo="Contato técnico" value={tecnico} onChange={setTecnico} />
    </div>
  );
}

function ContatoCard({
  titulo, value, onChange,
}: { titulo: string; value: Contato; onChange: (c: Contato) => void }) {
  const upd = (k: keyof Contato) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value });
  const inputCls =
    "w-full rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-[var(--brand-navy)] shadow-sm focus:border-[var(--signal)] focus:outline-none focus:ring-1 focus:ring-[var(--signal)]/40";
  const labelCls = "mb-0.5 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[var(--brand-navy)]">{titulo}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className={labelCls}>Nome *</label>
          <input required className={inputCls} value={value.nome} onChange={upd("nome")} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Cargo *</label>
          <input required className={inputCls} value={value.cargo} onChange={upd("cargo")} />
        </div>
        <div>
          <label className={labelCls}>CPF *</label>
          <input required className={inputCls} value={value.cpf} onChange={upd("cpf")} placeholder="000.000.000-00" inputMode="numeric" />
        </div>
        <div>
          <label className={labelCls}>Telefone *</label>
          <input required className={inputCls} value={value.telefone} onChange={upd("telefone")} placeholder="(00) 00000-0000" inputMode="tel" />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>E-mail *</label>
          <input required type="email" className={inputCls} value={value.email} onChange={upd("email")} />
        </div>
      </div>
    </div>
  );
}
