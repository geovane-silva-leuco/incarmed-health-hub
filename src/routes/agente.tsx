import { createFileRoute } from "@tanstack/react-router";
import { Bot, AlertTriangle, Check } from "lucide-react";
import { ProductBanner } from "@/components/leucotron/brand";
import { agenteInteligentePlanos, agenteInteligente } from "@/data/pricing";
import { formatBRL, formatBRLLong } from "@/lib/format";
import { useProposalConfig } from "@/lib/proposal-config";

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
  const cfg = useProposalConfig();
  return (
    <div>
      <ProductBanner
        eyebrow="Solução 2 de 5 · Produto de prateleira"
        title="Agente Inteligente"
        subtitle={agenteInteligente.descricao}
        icon={<Bot className="h-7 w-7" />}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#25D366]/40 bg-[#25D366]/5 p-5">
        <div>
          <p className="text-sm font-semibold text-[var(--brand-navy)]">Teste o Agente Inteligente agora</p>
          <p className="text-xs text-muted-foreground">Converse com um agente real via WhatsApp — sem instalação.</p>
        </div>
        <a
          href="https://wa.me/553534719799"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Testar via WhatsApp
        </a>
      </div>

      <div className="mb-6 rounded-lg border border-[var(--line-paper)] border-l-4 border-l-[var(--signal)] bg-[var(--paper)] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-[var(--signal)]" />
          <p className="text-sm text-[var(--paper-ink)]">
            O valor do plano <strong>Tiny</strong> (<span className="num-mono">R$ 1.447,00</span>/mês) coincide com o do projeto <strong>Sob Medida</strong>, mas são cobranças de escopos diferentes — não representam o mesmo item somado duas vezes.
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-[var(--brand-navy)]">Planos disponíveis</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {agenteInteligentePlanos.map((p) => {
          const contratado = p.plano === cfg.agentePlano;
          return (
            <div key={p.plano} className={`rounded-xl border p-6 shadow-sm ${contratado ? "border-[var(--brand-cyan)] bg-white ring-2 ring-[var(--brand-cyan)]/40" : "border-border bg-card"}`}>
              {contratado && (
                <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-[var(--brand-cyan)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  <Check className="h-3 w-3" /> Contratado
                </span>
              )}
              <h3 className="text-2xl font-bold text-[var(--brand-navy)]">{p.plano}</h3>
              <p className="mt-1 text-3xl font-bold text-[var(--brand-navy)]">
                {formatBRL(p.valorMensal)}<span className="ml-1 text-sm font-normal text-muted-foreground">/mês</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.limites}</p>
            </div>
          );
        })}
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
