import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionTitle, StatCard } from "@/components/leucotron/brand";
import { SegmentedToggle } from "@/components/leucotron/segmented-toggle";
import {
  conectaPacotesMensagens, conectaAtivacaoPremium,
  agenteInteligentePlanos, agenteInteligente,
  fluxModalidadeCloud, fluxModalidadeOnPremise,
  voicebot, sobMedida, sobMedidaFrentes,
  type PlanoAgente,
} from "@/data/pricing";
import { formatBRL, formatNumber } from "@/lib/format";
import {
  useProposalConfig, setProposalConfig,
  getConectaPacote, getAgentePlano,
  type FluxModalidade, type VoiceBotModo,
} from "@/lib/proposal-config";

type VisaoTotal = "mensal" | "anual";



export const Route = createFileRoute("/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro Consolidado — Proposta Incarmed" },
      { name: "description", content: "Tabela consolidada das 5 soluções com totalizadores mensais, únicos e anuais." },
    ],
  }),
  component: FinanceiroPage,
});

/**
 * Página financeira — controla a `ProposalConfig` global. Toda alteração
 * aqui reflete no Dashboard, cards de soluções, tela de Aprovação, etc.
 */
function FinanceiroPage() {
  const cfg = useProposalConfig();
  const [visao, setVisao] = useState<VisaoTotal>("mensal");

  const conectaPacote = getConectaPacote(cfg);
  const agente = getAgentePlano(cfg);
  const isFluxOnPremise = cfg.fluxModalidade === "onpremise";
  const flux = isFluxOnPremise ? fluxModalidadeOnPremise : fluxModalidadeCloud;
  const fluxMensal = isFluxOnPremise ? 0 : fluxModalidadeCloud.totalMensal;
  const incluirVoice = cfg.voicebotModo !== "off";
  const voiceMensal = !incluirVoice
    ? 0
    : cfg.voicebotModo === "mensal"
    ? voicebot.valorMensal
    : voicebot.equivalenteMensalNoAnual;
  const voiceAtivacao = incluirVoice ? Math.round(voicebot.valorMensal) : 0;

  // Linhas de recorrência mensal (Flux on-premise NÃO entra aqui — vira linha anual separada)
  const linhasMensais = [
    {
      solucao: `Conecta · Pacote ${formatNumber(conectaPacote.mensagens)} msg${cfg.conectaConfirmadorConsultas ? " + Confirmador de Consultas" : ""}`,
      tipo: "SaaS",
      mensal: conectaPacote.valorMensal,
      ativacao: conectaAtivacaoPremium,
      pagamento: `Mensal (pacote ${formatNumber(conectaPacote.mensagens)} msg)`,
    },
    {
      solucao: `Agente Inteligente · ${agente.plano}`,
      tipo: "SaaS",
      mensal: agente.valorMensal,
      ativacao: agenteInteligente.ativacaoMinima,
      pagamento: "Mensal",
    },
    ...(!isFluxOnPremise
      ? [{
          solucao: "Flux 3.0 · Cloud (SaaS)",
          tipo: "SaaS",
          mensal: fluxMensal,
          ativacao: flux.ativacaoUnica,
          pagamento: flux.pagamento,
        }]
      : []),
    {
      solucao: "VoiceBOT",
      tipo: "SaaS",
      mensal: voiceMensal,
      ativacao: voiceAtivacao,
      pagamento: incluirVoice ? (cfg.voicebotModo === "mensal" ? "Mensal" : "Anual à vista") : "—",
    },
    {
      solucao: `Sob Medida · ${cfg.sobMedidaFrentes.length}/${sobMedidaFrentes.length} frentes`,
      tipo: "Projeto",
      mensal: sobMedida.valorMensal,
      ativacao: sobMedida.ativacaoUnica,
      pagamento: "Mensal + ativação",
    },
  ];

  const totalMensalRecorrente = linhasMensais.reduce((s, l) => s + l.mensal, 0);
  const totalAtivacao = linhasMensais.reduce((s, l) => s + l.ativacao, 0)
    + (isFluxOnPremise ? fluxModalidadeOnPremise.ativacaoUnica : 0);
  const fluxAnualSeparado = isFluxOnPremise ? fluxModalidadeOnPremise.totalAnual : 0;
  const totalAnual = totalMensalRecorrente * 12 + fluxAnualSeparado + totalAtivacao;

  return (
    <div>
      <SectionTitle
        eyebrow="Consolidação"
        title="Financeiro Consolidado"
        description="Ajuste a configuração da proposta. As mudanças refletem em todo o dashboard, cards de soluções e tela de aprovação."
      />

      <div className="mb-6 space-y-5 rounded-xl border border-border bg-card p-5 shadow-sm print:hidden">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conecta · Pacote de mensagens</p>
            <select
              value={cfg.conectaPacoteMensagens}
              onChange={(e) => setProposalConfig({ conectaPacoteMensagens: Number(e.target.value) })}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              aria-label="Pacote Conecta"
            >
              {conectaPacotesMensagens.map((p) => (
                <option key={p.mensagens} value={p.mensagens}>
                  {formatNumber(p.mensagens)} msg — {formatBRL(p.valorMensal)}/mês
                </option>
              ))}
            </select>
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cfg.conectaConfirmadorConsultas}
                onChange={(e) => setProposalConfig({ conectaConfirmadorConsultas: e.target.checked })}
                className="h-4 w-4 accent-[var(--brand-cyan)]"
              />
              Incluir <strong>Confirmador de Consultas</strong> (módulo Conecta)
            </label>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agente Inteligente</p>
            <SegmentedToggle
              ariaLabel="Plano do Agente Inteligente"
              size="sm"
              value={cfg.agentePlano}
              onChange={(v: PlanoAgente) => setProposalConfig({ agentePlano: v })}
              options={agenteInteligentePlanos.map((p) => ({ value: p.plano, label: p.plano }))}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flux 3.0 · PABX</p>
            <SegmentedToggle
              ariaLabel="Modalidade do Flux 3.0"
              size="sm"
              value={cfg.fluxModalidade}
              onChange={(v: FluxModalidade) => setProposalConfig({ fluxModalidade: v })}
              options={[
                { value: "cloud", label: "Cloud · Mensal" },
                { value: "onpremise", label: "On-Premise · Anual" },
              ]}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">VoiceBOT</p>
            <SegmentedToggle
              ariaLabel="Contratação do VoiceBOT"
              size="sm"
              value={cfg.voicebotModo}
              onChange={(v: VoiceBotModo) => setProposalConfig({ voicebotModo: v })}
              options={[
                { value: "mensal", label: "Mensal" },
                { value: "anual", label: "Anual" },
                { value: "off", label: "Sem VoiceBOT" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Toggle de visão do total */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Visão do total
        </p>
        <SegmentedToggle
          ariaLabel="Visão do total (mensal ou anual)"
          size="sm"
          value={visao}
          onChange={setVisao}
          options={[
            { value: "mensal", label: "Mensal" },
            { value: "anual", label: "Anual" },
          ]}
        />
      </div>

      {visao === "mensal" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatCard label="Total mensal recorrente" value={formatBRL(totalMensalRecorrente)} accent hint={isFluxOnPremise ? "Flux On-Premise é anual — não entra na visão mensal" : undefined} />
          <StatCard label="Total único (ativações)" value={formatBRL(totalAtivacao)} hint="Investimento único, pago uma vez" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Recorrente mensal × 12" value={formatBRL(totalMensalRecorrente * 12)} hint={`${formatBRL(totalMensalRecorrente)}/mês × 12`} />
          {isFluxOnPremise && (
            <StatCard label="Flux 3.0 · Anual (On-Premise)" value={formatBRL(fluxAnualSeparado)} hint="Licenciamento anual à vista (linha separada)" />
          )}
          <StatCard label="Total anual estimado" value={formatBRL(totalAnual)} accent hint={isFluxOnPremise ? "(mensal × 12) + Flux anual + ativações" : "(mensal × 12) + ativações"} />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[var(--brand-navy)] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Solução</th>
              <th className="px-4 py-3 text-left font-semibold">Tipo</th>
              <th className="px-4 py-3 text-right font-semibold">Mensal</th>
              {visao === "anual" && <th className="px-4 py-3 text-right font-semibold">Anual</th>}
              <th className="px-4 py-3 text-right font-semibold">Ativação</th>
              <th className="px-4 py-3 text-left font-semibold">Forma de pagamento</th>
            </tr>
          </thead>
          <tbody>
            {linhasMensais.map((l, i) => (
              <tr key={i} className={i % 2 ? "bg-[var(--brand-surface)]" : "bg-white"}>
                <td className="px-4 py-3 font-semibold text-[var(--brand-navy)]">{l.solucao}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.tipo}</td>
                <td className="px-4 py-3 text-right font-semibold">{l.mensal === 0 ? "—" : formatBRL(l.mensal)}</td>
                {visao === "anual" && (
                  <td className="px-4 py-3 text-right">{l.mensal === 0 ? "—" : formatBRL(l.mensal * 12)}</td>
                )}
                <td className="px-4 py-3 text-right">{l.ativacao === 0 ? "—" : formatBRL(l.ativacao)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{l.pagamento}</td>
              </tr>
            ))}
            {isFluxOnPremise && visao === "anual" && (
              <tr className="border-t-2 border-dashed border-[var(--brand-navy)]/30 bg-amber-50/60">
                <td className="px-4 py-3 font-semibold text-[var(--brand-navy)]">Flux 3.0 · On-Premise (Licenciamento anual)</td>
                <td className="px-4 py-3 text-muted-foreground">Licenciamento anual</td>
                <td className="px-4 py-3 text-right text-xs italic text-muted-foreground">n/a</td>
                <td className="px-4 py-3 text-right font-semibold">{formatBRL(fluxAnualSeparado)}</td>
                <td className="px-4 py-3 text-right">{formatBRL(fluxModalidadeOnPremise.ativacaoUnica)}</td>
                <td className="px-4 py-3 text-xs font-semibold text-amber-800">Anual à vista (linha separada)</td>
              </tr>
            )}
            {isFluxOnPremise && visao === "mensal" && (
              <tr className="bg-[var(--brand-surface)]/60">
                <td className="px-4 py-3 font-semibold text-[var(--brand-navy)]">Flux 3.0 · On-Premise</td>
                <td className="px-4 py-3 text-muted-foreground">Licenciamento anual</td>
                <td className="px-4 py-3 text-right text-xs italic text-muted-foreground">Não aplicável na visão mensal</td>
                <td className="px-4 py-3 text-right">{formatBRL(fluxModalidadeOnPremise.ativacaoUnica)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">Ver visão Anual</td>
              </tr>
            )}
            <tr className="bg-[var(--brand-navy)] font-bold text-white">
              <td className="px-4 py-3" colSpan={2}>TOTAL</td>
              <td className="px-4 py-3 text-right">{formatBRL(totalMensalRecorrente)}</td>
              {visao === "anual" && (
                <td className="px-4 py-3 text-right">{formatBRL(totalMensalRecorrente * 12 + fluxAnualSeparado)}</td>
              )}
              <td className="px-4 py-3 text-right">{formatBRL(totalAtivacao)}</td>
              <td className="px-4 py-3" />
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs italic text-muted-foreground">
        Valores válidos conforme condições comerciais vigentes em 11/06/2026, sujeitos a revalidação. Proposta original com validade de 15 dias.
        {isFluxOnPremise && " O Flux 3.0 On-Premise é contratado em regime anual e aparece como linha separada — não é diluído em 'mensal × 12'."}
      </p>
    </div>
  );
}

