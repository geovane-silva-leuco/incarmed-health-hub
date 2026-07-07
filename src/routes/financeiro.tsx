import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionTitle, StatCard } from "@/components/leucotron/brand";
import { SegmentedToggle } from "@/components/leucotron/segmented-toggle";
import {
  conectaValorBaseMensal, conectaAtivacaoPremium,
  agenteInteligentePlanos, agenteInteligente,
  fluxModalidadeCloud, fluxModalidadeOnPremise,
  voicebot, sobMedida,
  type PlanoAgente,
} from "@/data/pricing";
import { formatBRL } from "@/lib/format";


export const Route = createFileRoute("/financeiro")({
  head: () => ({
    meta: [
      { title: "Financeiro Consolidado — Proposta Incarmed" },
      { name: "description", content: "Tabela consolidada das 5 soluções com totalizadores mensais, únicos e anuais." },
    ],
  }),
  component: FinanceiroPage,
});

function FinanceiroPage() {
  const [fluxModo, setFluxModo] = useState<"cloud" | "onpremise">("cloud");
  const [planoAgente, setPlanoAgente] = useState<PlanoAgente>("Tiny");
  const [incluirVoiceBot, setIncluirVoiceBot] = useState(true);
  const [modoVoice, setModoVoice] = useState<"mensal" | "anual">("mensal");

  const agente = agenteInteligentePlanos.find((p) => p.plano === planoAgente)!;
  const flux = fluxModo === "cloud" ? fluxModalidadeCloud : fluxModalidadeOnPremise;
  const fluxMensal = fluxModo === "cloud" ? fluxModalidadeCloud.totalMensal : fluxModalidadeOnPremise.equivalenteMensal;
  const voiceMensal = incluirVoiceBot ? (modoVoice === "mensal" ? voicebot.valorMensal : voicebot.equivalenteMensalNoAnual) : 0;
  const voiceAtivacao = incluirVoiceBot ? Math.round(voicebot.valorMensal) : 0; // 1 mensalidade

  const linhas = [
    { solucao: "Conecta", tipo: "SaaS", mensal: conectaValorBaseMensal, ativacao: conectaAtivacaoPremium, pagamento: "Mensal (pacote 25.000 msg)" },
    { solucao: `Agente Inteligente · ${planoAgente}`, tipo: "SaaS", mensal: agente.valorMensal, ativacao: agenteInteligente.ativacaoMinima, pagamento: "Mensal" },
    { solucao: `Flux 3.0 · ${fluxModo === "cloud" ? "Cloud" : "On-Premise"}`, tipo: fluxModo === "cloud" ? "SaaS" : "Licenciamento anual", mensal: fluxMensal, ativacao: flux.ativacaoUnica, pagamento: flux.pagamento },
    { solucao: "VoiceBOT", tipo: "SaaS", mensal: voiceMensal, ativacao: voiceAtivacao, pagamento: incluirVoiceBot ? (modoVoice === "mensal" ? "Mensal" : "Anual à vista") : "—" },
    { solucao: "Sob Medida — Integração PIXEON", tipo: "Projeto", mensal: sobMedida.valorMensal, ativacao: sobMedida.ativacaoUnica, pagamento: "Mensal + ativação" },
  ];

  const totalMensal = linhas.reduce((s, l) => s + l.mensal, 0);
  const totalAtivacao = linhas.reduce((s, l) => s + l.ativacao, 0);
  const totalAnual = totalMensal * 12 + totalAtivacao;

  return (
    <div>
      <SectionTitle
        eyebrow="Consolidação"
        title="Financeiro Consolidado"
        description="Ajuste as variáveis para simular diferentes combinações. Os totais recalculam automaticamente."
      />

      <div className="mb-6 flex flex-wrap gap-6 rounded-xl border border-border bg-card p-5 shadow-sm print:hidden">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flux 3.0</p>
          <SegmentedToggle
            ariaLabel="Modalidade do Flux 3.0"
            size="sm"
            value={fluxModo}
            onChange={setFluxModo}
            options={[
              { value: "cloud", label: "Cloud · Mensal" },
              { value: "onpremise", label: "On-Premise · Anual" },
            ]}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agente Inteligente</p>
          <SegmentedToggle
            ariaLabel="Plano do Agente Inteligente"
            size="sm"
            value={planoAgente}
            onChange={setPlanoAgente}
            options={agenteInteligentePlanos.map((p) => ({ value: p.plano, label: p.plano }))}
          />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">VoiceBOT</p>
          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={incluirVoiceBot} onChange={(e) => setIncluirVoiceBot(e.target.checked)} className="h-4 w-4 accent-[var(--brand-cyan)]" />
              Incluir
            </label>
            {incluirVoiceBot && (
              <SegmentedToggle
                ariaLabel="Forma de pagamento do VoiceBOT"
                size="sm"
                value={modoVoice}
                onChange={setModoVoice}
                options={[
                  { value: "mensal", label: "Mensal" },
                  { value: "anual", label: "Anual à vista" },
                ]}
              />
            )}
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total mensal recorrente" value={formatBRL(totalMensal)} accent />
        <StatCard label="Total único (ativações)" value={formatBRL(totalAtivacao)} />
        <StatCard label="Total anual estimado" value={formatBRL(totalAnual)} hint="12 × mensal + ativações" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[var(--brand-navy)] text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Solução</th>
              <th className="px-4 py-3 text-left font-semibold">Tipo</th>
              <th className="px-4 py-3 text-right font-semibold">Mensal</th>
              <th className="px-4 py-3 text-right font-semibold">Ativação</th>
              <th className="px-4 py-3 text-left font-semibold">Forma de pagamento</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => (
              <tr key={i} className={i % 2 ? "bg-[var(--brand-surface)]" : "bg-white"}>
                <td className="px-4 py-3 font-semibold text-[var(--brand-navy)]">{l.solucao}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.tipo}</td>
                <td className="px-4 py-3 text-right font-semibold">{l.mensal === 0 ? "—" : formatBRL(l.mensal)}</td>
                <td className="px-4 py-3 text-right">{l.ativacao === 0 ? "—" : formatBRL(l.ativacao)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{l.pagamento}</td>
              </tr>
            ))}
            <tr className="bg-[var(--brand-navy)] text-white font-bold">
              <td className="px-4 py-3" colSpan={2}>TOTAL</td>
              <td className="px-4 py-3 text-right">{formatBRL(totalMensal)}</td>
              <td className="px-4 py-3 text-right">{formatBRL(totalAtivacao)}</td>
              <td className="px-4 py-3" />
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs italic text-muted-foreground">
        Valores válidos conforme condições comerciais vigentes em 11/06/2026, sujeitos a revalidação. Proposta original com validade de 15 dias.
      </p>
    </div>
  );
}
