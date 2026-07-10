import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SectionTitle, StatCard } from "@/components/leucotron/brand";
import { SegmentedToggle } from "@/components/leucotron/segmented-toggle";
import {
  conectaAtivacaoPremium,
  agenteInteligente,
  fluxModalidadeCloud, fluxModalidadeOnPremise,
  voicebot, sobMedida, sobMedidaFrentes,
} from "@/data/pricing";
import { formatBRL, formatNumber } from "@/lib/format";
import {
  useProposalConfig,
  getConectaPacote, getAgentePlano,
} from "@/lib/proposal-config";
import { ArrowRight } from "lucide-react";

type VisaoTotal = "mensal" | "anual";

export const Route = createFileRoute("/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro Consolidado — Proposta Incarmed" },
      { name: "description", content: "Visão consolidada das 5 soluções com totais mensais, anuais e de ativação." },
    ],
  }),
  component: FinanceiroPage,
});

/**
 * Visão só-leitura. A configuração (planos, modalidade, VoiceBOT, frentes)
 * é ajustada na tela de Aprovação, para evitar duas fontes de interação
 * sobre o mesmo estado.
 */
function FinanceiroPage() {
  const cfg = useProposalConfig();
  const [visao, setVisao] = useState<VisaoTotal>("mensal");

  const conectaPacote = getConectaPacote(cfg);
  const agente = getAgentePlano(cfg);
  const isFluxOnPremise = cfg.fluxModalidade === "onpremise";
  const fluxMensal = isFluxOnPremise ? 0 : fluxModalidadeCloud.totalMensal;
  const incluirVoice = cfg.voicebotModo !== "off";
  const voiceMensal = !incluirVoice
    ? 0
    : cfg.voicebotModo === "mensal"
      ? voicebot.valorMensal
      : voicebot.equivalenteMensalNoAnual;
  const voiceAtivacao = incluirVoice ? Math.round(voicebot.valorMensal) : 0;

  const linhasMensais = [
    {
      solucao: `Conecta · WhatsApp · Pacote ${formatNumber(conectaPacote.mensagens)} msg${cfg.conectaConfirmadorConsultas ? " com Confirmador de Consultas" : ""}`,
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
          ativacao: fluxModalidadeCloud.ativacaoUnica,
          pagamento: fluxModalidadeCloud.pagamento,
        }]
      : []),
    ...(incluirVoice
      ? [{
          solucao: "VoiceBOT",
          tipo: "SaaS",
          mensal: voiceMensal,
          ativacao: voiceAtivacao,
          pagamento: cfg.voicebotModo === "mensal" ? "Mensal" : "Anual à vista",
        }]
      : []),
    ...(cfg.sobMedidaFrentes.length > 0
      ? [{
          solucao: `Sob Medida · ${cfg.sobMedidaFrentes.length}/${sobMedidaFrentes.length} frentes`,
          tipo: "Projeto",
          mensal: sobMedida.valorMensal,
          ativacao: sobMedida.ativacaoUnica,
          pagamento: "Mensal + ativação",
        }]
      : []),
  ];

  const totalMensalRecorrente = linhasMensais.reduce((s, l) => s + l.mensal, 0);
  const totalAtivacao = linhasMensais.reduce((s, l) => s + l.ativacao, 0)
    + (isFluxOnPremise ? fluxModalidadeOnPremise.ativacaoUnica : 0);
  const fluxAnualSeparado = isFluxOnPremise ? fluxModalidadeOnPremise.totalAnual : 0;

  return (
    <div>
      <SectionTitle
        eyebrow="Consolidação"
        title="Financeiro Consolidado"
        description="Visão consolidada da configuração atual da proposta. Para alterar planos, modalidade ou frentes, use a tela de Aprovação."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Visão do total
        </p>
        <div className="flex items-center gap-3">
          <SegmentedToggle
            ariaLabel="Visão do total"
            size="sm"
            value={visao}
            onChange={setVisao}
            options={[
              { value: "mensal", label: "Mensal" },
              { value: "anual", label: "Anual" },
            ]}
          />
          <Link
            to="/aprovacao"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--signal)]/40 bg-[var(--signal)]/5 px-3 py-1.5 text-xs font-semibold text-[var(--signal)] hover:bg-[var(--signal)]/10"
          >
            Ajustar configuração <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {visao === "mensal" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatCard label="Total mensal recorrente" value={formatBRL(totalMensalRecorrente)} accent hint={isFluxOnPremise ? "Flux On-Premise é anual, não entra na visão mensal" : undefined} />
          <StatCard label="Total único de ativações" value={formatBRL(totalAtivacao)} hint="Investimento único, pago uma vez" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard label="Recorrente mensal × 12" value={formatBRL(totalMensalRecorrente * 12)} hint={`${formatBRL(totalMensalRecorrente)} por mês × 12`} />
          {isFluxOnPremise && (
            <StatCard label="Flux 3.0 anual (On-Premise)" value={formatBRL(fluxAnualSeparado)} hint="Licenciamento anual à vista" />
          )}
          <StatCard label="Total anual estimado" value={formatBRL(totalMensalRecorrente * 12 + fluxAnualSeparado + totalAtivacao)} accent />
        </div>
      )}

      <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[var(--brand-navy)] text-white">
            <tr>
              <th className="px-4 py-2.5 text-left font-semibold">Solução</th>
              <th className="px-4 py-2.5 text-left font-semibold">Tipo</th>
              <th className="px-4 py-2.5 text-right font-semibold">Mensal</th>
              {visao === "anual" && <th className="px-4 py-2.5 text-right font-semibold">Anual</th>}
              <th className="px-4 py-2.5 text-right font-semibold">Ativação</th>
              <th className="px-4 py-2.5 text-left font-semibold">Pagamento</th>
            </tr>
          </thead>
          <tbody>
            {linhasMensais.map((l, i) => (
              <tr key={i} className={i % 2 ? "bg-[var(--brand-surface)]" : "bg-white"}>
                <td className="px-4 py-2 font-semibold text-[var(--brand-navy)]">{l.solucao}</td>
                <td className="px-4 py-2 text-muted-foreground">{l.tipo}</td>
                <td className="num-mono px-4 py-2 text-right font-semibold" data-pulse-anchor>{l.mensal === 0 ? "—" : formatBRL(l.mensal)}</td>
                {visao === "anual" && (
                  <td className="num-mono px-4 py-2 text-right" data-pulse-anchor>{l.mensal === 0 ? "—" : formatBRL(l.mensal * 12)}</td>
                )}
                <td className="num-mono px-4 py-2 text-right" data-pulse-anchor>{l.ativacao === 0 ? "—" : formatBRL(l.ativacao)}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{l.pagamento}</td>
              </tr>
            ))}
            {isFluxOnPremise && (
              <tr className="border-t-2 border-dashed border-[var(--brand-navy)]/30 bg-[var(--paper)]">
                <td className="px-4 py-2 font-semibold text-[var(--brand-navy)]">Flux 3.0 · On-Premise (Anual)</td>
                <td className="px-4 py-2 text-muted-foreground">Licenciamento anual</td>
                <td className="px-4 py-2 text-right text-xs italic text-muted-foreground">n/a</td>
                {visao === "anual" && (
                  <td className="num-mono px-4 py-2 text-right font-semibold" data-pulse-anchor>{formatBRL(fluxAnualSeparado)}</td>
                )}
                <td className="num-mono px-4 py-2 text-right" data-pulse-anchor>{formatBRL(fluxModalidadeOnPremise.ativacaoUnica)}</td>
                <td className="px-4 py-2 text-xs font-semibold">Anual à vista</td>
              </tr>
            )}
            <tr className="bg-[var(--brand-navy)] font-bold text-white">
              <td className="px-4 py-2.5" colSpan={2}>TOTAL</td>
              <td className="num-mono px-4 py-2.5 text-right" data-pulse-anchor>{formatBRL(totalMensalRecorrente)}</td>
              {visao === "anual" && (
                <td className="num-mono px-4 py-2.5 text-right" data-pulse-anchor>{formatBRL(totalMensalRecorrente * 12 + fluxAnualSeparado)}</td>
              )}
              <td className="num-mono px-4 py-2.5 text-right" data-pulse-anchor>{formatBRL(totalAtivacao)}</td>
              <td className="px-4 py-2.5" />
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs italic text-muted-foreground">
        Valores válidos conforme condições comerciais vigentes em 11/06/2026, sujeitos a revalidação. Proposta original com validade de 15 dias.
        {isFluxOnPremise && " O Flux 3.0 On-Premise é contratado em regime anual e aparece como linha separada."}
      </p>
    </div>
  );
}
