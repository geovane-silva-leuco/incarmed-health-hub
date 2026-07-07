import { createFileRoute } from "@tanstack/react-router";
import { Bot, AlertTriangle } from "lucide-react";
import { ProductBanner } from "@/components/leucotron/brand";
import { agenteInteligentePlanos, agenteInteligente } from "@/data/pricing";
import { formatBRL, formatBRLLong } from "@/lib/format";

export const Route = createFileRoute("/agente")({
  head: () => ({
    meta: [
      { title: "Agente Inteligente — IA conversacional por texto" },
      { name: "description", content: "Planos Tiny, Small e Medium do Agente Inteligente Leucotron." },
    ],
  }),
  component: AgentePage,
});

function AgentePage() {
  return (
    <div>
      <ProductBanner
        eyebrow="Solução 2 de 5 · Produto de prateleira"
        title="Agente Inteligente"
        subtitle={agenteInteligente.descricao}
        icon={<Bot className="h-7 w-7" />}
      />

      <div className="mb-6 rounded-lg border-l-4 border-l-[var(--brand-cyan)] bg-[var(--brand-cyan)]/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-[var(--brand-cyan)]" />
          <p className="text-sm text-foreground">
            <strong>Atenção:</strong> o plano <strong>Tiny</strong> (R$ 1.447,00/mês) coincide numericamente com o valor mensal do projeto <strong>Sob Medida</strong>, mas são cobranças de recursos totalmente diferentes. Nunca some como se fosse um único item.
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-[var(--brand-navy)]">Planos disponíveis</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {agenteInteligentePlanos.map((p, i) => (
          <div key={p.plano} className={`rounded-xl border p-6 shadow-sm ${i === 0 ? "border-[var(--brand-cyan)] bg-white ring-1 ring-[var(--brand-cyan)]/30" : "border-border bg-card"}`}>
            {i === 0 && (
              <span className="mb-3 inline-block rounded-full bg-[var(--brand-cyan)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Base sugerida
              </span>
            )}
            <h3 className="text-2xl font-bold text-[var(--brand-navy)]">{p.plano}</h3>
            <p className="mt-1 text-3xl font-bold text-[var(--brand-navy)]">
              {formatBRL(p.valorMensal)}<span className="ml-1 text-sm font-normal text-muted-foreground">/mês</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.limites}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-navy)]">Ativação e serviços</h3>
          <div className="mt-1 h-[2px] w-8 bg-[var(--brand-cyan)]" />
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-baseline justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">Ativação mínima (sem integrações externas)</dt>
              <dd className="font-semibold text-[var(--brand-navy)]">{formatBRL(agenteInteligente.ativacaoMinima)}</dd>
            </div>
            <div className="flex items-baseline justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">Hora adicional fora do escopo</dt>
              <dd className="font-semibold text-[var(--brand-navy)]">{formatBRL(agenteInteligente.horaAdicionalForaEscopo)}<span className="ml-1 text-xs font-normal text-muted-foreground">/h</span></dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Suporte técnico</dt>
              <dd className="mt-1 font-semibold text-[var(--brand-navy)]">{agenteInteligente.suporteTecnicoMensal}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-navy)]">Cobrança de LLM (tokens)</h3>
          <div className="mt-1 h-[2px] w-8 bg-[var(--brand-cyan)]" />
          <p className="mt-3 text-xs text-muted-foreground">Cobrado por milhão de tokens processados/gerados, adicional ao plano.</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[var(--brand-surface)] p-4">
              <p className="text-xs uppercase text-muted-foreground">Input</p>
              <p className="mt-1 text-xl font-bold text-[var(--brand-navy)]">{formatBRL(agenteInteligente.cobrancaLLM.input)}</p>
              <p className="text-[11px] text-muted-foreground">por 1M tokens</p>
            </div>
            <div className="rounded-lg bg-[var(--brand-surface)] p-4">
              <p className="text-xs uppercase text-muted-foreground">Output</p>
              <p className="mt-1 text-xl font-bold text-[var(--brand-navy)]">{formatBRL(agenteInteligente.cobrancaLLM.output)}</p>
              <p className="text-[11px] text-muted-foreground">por 1M tokens</p>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground font-mono">
            {formatBRLLong(agenteInteligente.cobrancaLLM.input / 1_000_000)} / token in ·{" "}
            {formatBRLLong(agenteInteligente.cobrancaLLM.output / 1_000_000)} / token out
          </p>
        </div>
      </div>
    </div>
  );
}
