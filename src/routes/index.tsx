import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import {
  conectaAtivacaoPremium,
  agenteInteligente,
  fluxModalidadeCloud, fluxModalidadeOnPremise,
  voicebot,
  sobMedida, sobMedidaFrentes,
} from "@/data/pricing";
import { formatBRL, formatNumber } from "@/lib/format";
import {
  useProposalConfig,
  getConectaPacote,
  getAgentePlano,
} from "@/lib/proposal-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Proposta Incarmed × Leucotron" },
      { name: "description", content: "Proposta comercial Leucotron para o grupo Incarmed — 5 soluções, uma leitura, sem planilhas." },
    ],
  }),
  component: DashboardHome,
});

/**
 * Home — narrativa tipográfica de abertura.
 *
 * Substitui o antigo dashboard executivo (grid de KPIs + gráfico) por uma
 * frase de tese em display grande, seguida por três números tabulares em
 * mono e um índice das seções da proposta. É a única superfície que o
 * decisor precisa ver para entender o pitch em 30 segundos.
 */
function DashboardHome() {
  const cfg = useProposalConfig();
  const conectaPacote = getConectaPacote(cfg);
  const agente = getAgentePlano(cfg);
  const flux = cfg.fluxModalidade === "cloud" ? fluxModalidadeCloud : fluxModalidadeOnPremise;
  const fluxMensal = cfg.fluxModalidade === "cloud"
    ? fluxModalidadeCloud.totalMensal
    : fluxModalidadeOnPremise.equivalenteMensal;
  const voiceMensal =
    cfg.voicebotModo === "off" ? 0
    : cfg.voicebotModo === "mensal" ? voicebot.valorMensal
    : voicebot.equivalenteMensalNoAnual;

  const composicao = useMemo(
    () => [
      { name: "Conecta", value: conectaPacote.valorMensal },
      { name: "Agente Inteligente", value: agente.valorMensal },
      { name: "Flux 3.0", value: fluxMensal },
      { name: "VoiceBOT", value: voiceMensal },
      { name: "Sob Medida", value: sobMedida.valorMensal },
    ].filter((c) => c.value > 0),
    [conectaPacote.valorMensal, agente.valorMensal, fluxMensal, voiceMensal],
  );

  const totalMensal = composicao.reduce((s, c) => s + c.value, 0);
  const totalAnual = totalMensal * 12;
  const totalAtivacao =
    conectaAtivacaoPremium
    + agenteInteligente.ativacaoMinima
    + flux.ativacaoUnica
    + (cfg.voicebotModo === "off" ? 0 : Math.round(voicebot.valorMensal))
    + sobMedida.ativacaoUnica;

  const secoes = [
    { url: "/oportunidade", n: "01", titulo: "Oportunidade", hint: "O problema documentado com o PIXEON" },
    { url: "/conecta",      n: "02", titulo: "Soluções",     hint: "Conecta · Agente · Flux · VoiceBOT · Sob Medida" },
    { url: "/financeiro",   n: "03", titulo: "Financeiro",   hint: "Investimento consolidado, anual e mensal" },
    { url: "/escopo",       n: "04", titulo: "Escopo",       hint: "O que está e o que não está incluído" },
    { url: "/cronograma",   n: "05", titulo: "Cronograma",   hint: "Marcos de implantação" },
    { url: "/aprovacao",    n: "06", titulo: "Aprovação",    hint: "Assinar e começar" },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Tese-frase — abertura ------------------------------------------------ */}
      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">
        Proposta comercial · 2026 · {formatNumber(sobMedidaFrentes.length)} frentes · 6 seções
      </p>
      <h1 className="font-display text-[42px] font-semibold leading-[1.05] tracking-tight text-[var(--ink)] md:text-[64px]">
        O Incarmed está travado para colocar IA em cima do PIXEON.
        <br />
        <span className="text-[var(--paper-ink)]/45">
          Esta proposta destrava — em 5 soluções integradas, sem trocar de fornecedor.
        </span>
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--paper-ink)]/70">
        Hoje o grupo processa cerca de 16 mil mensagens/mês em WhatsApp sem
        integração ao ERP hospitalar. Cada agendamento, confirmação e
        recontato depende de trabalho manual. A Leucotron entrega a central
        de relacionamento inteligente, integrada e pronta para escalar.
      </p>

      {/* Números-chave em mono tabular --------------------------------------- */}
      <div className="mt-16 grid grid-cols-1 gap-10 border-t border-[var(--line-paper)] pt-10 md:grid-cols-3">
        <KeyNumber
          label="Investimento anual"
          value={formatBRL(totalAnual)}
          hint={`${formatBRL(totalMensal)} / mês recorrente`}
          accent
        />
        <KeyNumber
          label="Ativação única"
          value={formatBRL(totalAtivacao)}
          hint="Setup + configuração inicial"
        />
        <KeyNumber
          label="Soluções ativas"
          value={`${composicao.length} / 5`}
          hint={cfg.voicebotModo === "off" ? "VoiceBOT opcional" : "Todas contratadas"}
        />
      </div>

      {/* Índice das seções — substitui os cards coloridos --------------------- */}
      <div className="mt-24">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--paper-ink)]/50">
          Índice
        </p>
        <ul className="divide-y divide-[var(--line-paper)] border-y border-[var(--line-paper)]">
          {secoes.map((s) => (
            <li key={s.url}>
              <Link
                to={s.url}
                className="group flex items-baseline gap-6 py-6 transition-colors hover:bg-[var(--ink)]/[0.02]"
              >
                <span className="font-mono text-[12px] tabular-nums text-[var(--signal)] tracking-wider">
                  {s.n}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-xl font-semibold text-[var(--ink)] md:text-2xl">
                    {s.titulo}
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--paper-ink)]/60">{s.hint}</p>
                </div>
                <ArrowRight className="h-4 w-4 flex-none text-[var(--paper-ink)]/30 transition-all group-hover:translate-x-1 group-hover:text-[var(--signal)]" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KeyNumber({
  label, value, hint, accent,
}: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--paper-ink)]/55">
        {label}
      </p>
      <p
        data-pulse-anchor
        className={`num-mono mt-3 font-semibold ${
          accent ? "text-[38px] text-[var(--signal)]" : "text-[32px] text-[var(--ink)]"
        }`}
      >
        {value}
      </p>

      {hint && (
        <p className="mt-1.5 text-[12px] text-[var(--paper-ink)]/60">{hint}</p>
      )}
    </div>
  );
}
