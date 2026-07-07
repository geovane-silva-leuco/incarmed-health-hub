import { createFileRoute } from "@tanstack/react-router";
import { Wrench, AlertTriangle } from "lucide-react";
import { ProductBanner, StatCard } from "@/components/leucotron/brand";
import { sobMedida, sobMedidaFrentes } from "@/data/pricing";
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/sob-medida")({
  head: () => ({
    meta: [
      { title: "Sob Medida — Integração PIXEON" },
      { name: "description", content: "Projeto de desenvolvimento customizado para integrar PIXEON com Conecta, Agente Inteligente, VoiceBOT e Flux." },
    ],
  }),
  component: SobMedidaPage,
});

function SobMedidaPage() {
  return (
    <div>
      <ProductBanner
        eyebrow="Solução 5 de 5 · Projeto sob encomenda"
        title="Sob Medida — Integração PIXEON"
        subtitle={sobMedida.descricao}
        icon={<Wrench className="h-7 w-7" />}
      />




      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Mensal recorrente" value={formatBRL(sobMedida.valorMensal)} hint="Manutenção e evolução do projeto" accent />
        <StatCard label="Ativação única" value={formatBRL(sobMedida.ativacaoUnica)} hint="Kickoff + escopo detalhado" />
        <StatCard label="LLM — Input" value={formatBRL(sobMedida.cobrancaLLM.input)} hint="por 1M tokens processados" />
        <StatCard label="LLM — Output" value={formatBRL(sobMedida.cobrancaLLM.output)} hint="por 1M tokens gerados" />
      </div>

      <h2 className="mt-8 mb-4 text-xl font-semibold text-[var(--brand-navy)]">
        Frentes de trabalho <span className="text-muted-foreground">({sobMedidaFrentes.length})</span>
      </h2>

      <div className="space-y-4">
        {sobMedidaFrentes.map((f) => (
          <div key={f.id} className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-start gap-4 border-b border-border bg-[var(--brand-surface)] px-6 py-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-[var(--brand-navy)] font-bold text-[var(--brand-cyan)]">
                {f.id}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-cyan)]">Frente {f.id}</p>
                <h3 className="text-lg font-semibold text-[var(--brand-navy)]">{f.titulo}</h3>
              </div>
            </div>
            <div className="divide-y divide-border">
              {f.subitens.map((s, i) => (
                <div key={i} className="grid grid-cols-1 gap-2 px-6 py-3 md:grid-cols-[220px_1fr]">
                  <p className="text-sm font-semibold text-[var(--brand-navy)]">{s.nome}</p>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
