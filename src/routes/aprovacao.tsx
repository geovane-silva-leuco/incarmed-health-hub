import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileSignature, Download, Mail, CheckCircle2, Settings2 } from "lucide-react";
import jsPDF from "jspdf";
import { SectionTitle } from "@/components/leucotron/brand";
import { useProposalConfig, getConectaPacote, getAgentePlano } from "@/lib/proposal-config";
import { sobMedidaFrentes } from "@/data/pricing";
import { formatNumber } from "@/lib/format";


/**
 * Página de aprovação da proposta.
 * Cliente marca soluções escolhidas, preenche dados do responsável,
 * testemunha e contato técnico. Ao enviar:
 *   1. Gera e baixa um PDF com todos os dados
 *   2. Abre o cliente de e-mail (mailto:) preenchido para
 *      geovane.silva@leucotron.com.br, pedindo que anexe o PDF
 */
export const Route = createFileRoute("/aprovacao")({
  head: () => ({
    meta: [
      { title: "Aprovação da Proposta — Incarmed × Leucotron" },
      { name: "description", content: "Confirmação e assinatura da proposta comercial: escolha das soluções, dados do responsável, testemunha e contato técnico." },
    ],
  }),
  component: AprovacaoPage,
});

/** Soluções disponíveis para seleção. */
const SOLUCOES = [
  { id: "conecta", label: "Conecta (WhatsApp Business API)" },
  { id: "agente", label: "Agente Inteligente (IA por texto)" },
  { id: "flux", label: "Flux 3.0 (PABX em nuvem)" },
  { id: "voicebot", label: "VoiceBOT (Atendimento por voz)" },
  { id: "sob-medida", label: "Sob Medida (Integração PIXEON)" },
] as const;

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

  const configResumo = useMemo(() => ([
    {
      id: "conecta",
      solucao: "Conecta",
      escolha: `Pacote de ${formatNumber(conectaPacote.mensagens)} mensagens/mês${cfg.conectaConfirmadorConsultas ? " · com Confirmador de Consultas" : ""}`,
    },
    {
      id: "agente",
      solucao: "Agente Inteligente",
      escolha: `Plano ${agente.plano}`,
    },
    {
      id: "flux",
      solucao: "Flux 3.0",
      escolha: cfg.fluxModalidade === "cloud" ? "Modalidade Cloud (SaaS mensal)" : "Modalidade On-Premise (licenciamento anual)",
    },
    {
      id: "voicebot",
      solucao: "VoiceBOT",
      escolha:
        cfg.voicebotModo === "off"
          ? "Não incluído nesta proposta"
          : cfg.voicebotModo === "mensal"
            ? "Contratação mensal"
            : "Contratação anual à vista",
    },
    {
      id: "sob-medida",
      solucao: "Sob Medida",
      escolha: `${cfg.sobMedidaFrentes.length} de ${sobMedidaFrentes.length} frentes${cfg.sobMedidaFrentes.length ? " · Frentes: " + cfg.sobMedidaFrentes.join(", ") : ""}`,
    },
  ]), [cfg, conectaPacote, agente]);

  const [leuEEntendi, setLeuEEntendi] = useState(false);


  const podeEnviar = useMemo(() => {
    if (!leuEEntendi || selecionadas.length === 0) return false;
    const check = (c: Contato) => c.nome && c.cargo && c.cpf && c.email && c.telefone;
    return check(responsavel) && check(testemunha) && check(tecnico);
  }, [leuEEntendi, selecionadas, responsavel, testemunha, tecnico]);

  function toggleSolucao(id: string) {
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

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
    doc.text(`Emitido em: ${new Date().toLocaleString("pt-BR")}`, marginX, y);
    y += 24;

    doc.setDrawColor(0, 180, 216);
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
    if (selecionadas.length === 0) {
      doc.text("(nenhuma)", marginX, y);
      y += 14;
    } else {
      SOLUCOES.filter((s) => selecionadas.includes(s.id)).forEach((s) => {
        doc.text(`• ${s.label}`, marginX, y);
        y += 14;
      });
    }
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
    doc.text(`CPF: ${responsavel.cpf || "—"}`, marginX, y);

    return doc;
  }

  function montarCorpoEmail(): string {
    const contatoTxt = (c: Contato) =>
      `  Nome: ${c.nome}\n  Cargo: ${c.cargo}\n  CPF: ${c.cpf}\n  E-mail: ${c.email}\n  Telefone: ${c.telefone}`;

    const sols = SOLUCOES.filter((s) => selecionadas.includes(s.id)).map((s) => `  - ${s.label}`).join("\n");

    return [
      "Aprovação da proposta comercial Incarmed × Leucotron",
      "",
      `Data: ${new Date().toLocaleString("pt-BR")}`,
      "",
      "O responsável confirma que leu e entendeu integralmente a proposta comercial.",
      "",
      "SOLUÇÕES APROVADAS:",
      sols || "  (nenhuma)",
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

    // 1. Gera e baixa o PDF
    const doc = gerarPDF();
    const pdfFileName = `aprovacao-incarmed-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(pdfFileName);

    // 2. Abre cliente de e-mail com corpo pré-preenchido
    const subject = encodeURIComponent(`Aprovação de proposta — Incarmed (${responsavel.nome})`);
    const body = encodeURIComponent(montarCorpoEmail());
    window.location.href = `mailto:${DESTINATARIO}?subject=${subject}&body=${body}`;

    setEnviado(true);
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Fechamento · Assinatura"
        title="Aprovação da Proposta"
        description="Confirme leitura, marque as soluções contratadas e preencha os dados de responsável, testemunha e contato técnico."
      />

      {enviado && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-emerald-600" />
          <div className="text-sm text-emerald-900">
            <p className="font-semibold">Aprovação registrada.</p>
            <p className="mt-1">
              O PDF <strong>{`aprovacao-incarmed-${new Date().toISOString().slice(0, 10)}.pdf`}</strong> foi baixado automaticamente. Seu cliente de e-mail abriu com a mensagem endereçada a{" "}
              <strong>{DESTINATARIO}</strong> — <strong>anexe o PDF baixado</strong> antes de enviar.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleEnviar} className="space-y-6">
        {/* Declaração */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--brand-navy)]">
            <FileSignature className="h-4 w-4 text-[var(--brand-cyan)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Declaração de leitura</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            Declaro que li, entendi e aceito integralmente os termos da proposta comercial apresentada,
            incluindo escopo, valores mensais e de ativação, prazos, dependências, cronograma e condições
            de contratação das soluções abaixo selecionadas.
          </p>
          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-[var(--brand-surface)] p-3 hover:bg-[var(--brand-cyan)]/5">
            <input
              type="checkbox"
              checked={leuEEntendi}
              onChange={(e) => setLeuEEntendi(e.target.checked)}
              className="h-4 w-4 accent-[var(--brand-cyan)]"
              required
            />
            <span className="text-sm font-semibold text-[var(--brand-navy)]">
              Li e entendi a proposta comercial na íntegra.
            </span>
          </label>
        </div>

        {/* Seleção de soluções */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-navy)]">
            Soluções que serão contratadas
          </h3>
          <div className="mt-1 h-[2px] w-8 bg-[var(--brand-cyan)]" />
          <p className="mt-2 text-xs text-muted-foreground">Marque uma ou mais.</p>
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {SOLUCOES.map((s) => {
              const marcada = selecionadas.includes(s.id);
              return (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    marcada
                      ? "border-[var(--brand-cyan)] bg-[var(--brand-cyan)]/5"
                      : "border-border bg-white hover:border-[var(--brand-cyan)]/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={marcada}
                    onChange={() => toggleSolucao(s.id)}
                    className="h-4 w-4 accent-[var(--brand-cyan)]"
                  />
                  <span className="text-sm font-medium text-[var(--brand-navy)]">{s.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <ContatoForm
          titulo="Responsável pela contratação e assinatura"
          descricao="Pessoa autorizada a assinar o contrato pela Incarmed."
          value={responsavel}
          onChange={setResponsavel}
        />
        <ContatoForm
          titulo="Testemunha"
          descricao="Segunda pessoa que testemunha a aprovação."
          value={testemunha}
          onChange={setTestemunha}
        />
        <ContatoForm
          titulo="Contato técnico (apoio à implantação)"
          descricao="Pessoa da TI/infraestrutura que dará suporte ao time de implantação Leucotron."
          value={tecnico}
          onChange={setTecnico}
        />

        <div className="sticky bottom-4 z-10 flex flex-col items-stretch gap-3 rounded-xl border border-border bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Ao enviar, um PDF será baixado e seu e-mail abrirá endereçado a{" "}
            <strong className="text-[var(--brand-navy)]">{DESTINATARIO}</strong>. Anexe o PDF antes de enviar.
          </p>
          <button
            type="submit"
            disabled={!podeEnviar}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-navy)]/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            <Mail className="h-4 w-4" />
            Enviar aprovação
          </button>
        </div>
      </form>
    </div>
  );
}

/** Bloco de formulário para um contato (5 campos padronizados). */
function ContatoForm({
  titulo,
  descricao,
  value,
  onChange,
}: {
  titulo: string;
  descricao: string;
  value: Contato;
  onChange: (c: Contato) => void;
}) {
  const upd = (k: keyof Contato) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [k]: e.target.value });

  const inputCls =
    "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-[var(--brand-navy)] shadow-sm focus:border-[var(--brand-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-cyan)]/30";
  const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-navy)]">{titulo}</h3>
      <div className="mt-1 h-[2px] w-8 bg-[var(--brand-cyan)]" />
      <p className="mt-2 text-xs text-muted-foreground">{descricao}</p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className={labelCls}>Nome completo *</label>
          <input required className={inputCls} value={value.nome} onChange={upd("nome")} />
        </div>
        <div>
          <label className={labelCls}>Cargo *</label>
          <input required className={inputCls} value={value.cargo} onChange={upd("cargo")} />
        </div>
        <div>
          <label className={labelCls}>CPF *</label>
          <input
            required
            className={inputCls}
            value={value.cpf}
            onChange={upd("cpf")}
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </div>
        <div>
          <label className={labelCls}>E-mail *</label>
          <input required type="email" className={inputCls} value={value.email} onChange={upd("email")} />
        </div>
        <div>
          <label className={labelCls}>Telefone *</label>
          <input
            required
            className={inputCls}
            value={value.telefone}
            onChange={upd("telefone")}
            placeholder="(00) 00000-0000"
            inputMode="tel"
          />
        </div>
      </div>
    </div>
  );
}
