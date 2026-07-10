import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";
import { ProductBanner, StatCard } from "@/components/leucotron/brand";
import { sobMedida, sobMedidaFrentes } from "@/data/pricing";
import { formatBRL } from "@/lib/format";

export const Route = createFileRoute("/sob-medida")({
  head: () => ({
    meta: [
      { title: "Sob Medida — Integração PIXEON" },
      { name: "description", content: "Projeto de desenvolvimento customizado para integrar o PIXEON com Conecta, Agente Inteligente, VoiceBOT e Flux." },
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
        <StatCard label="Ativação única" value={formatBRL(sobMedida.ativacaoUnica)} hint="Kickoff e escopo detalhado" />
        <StatCard label="LLM Input" value={formatBRL(sobMedida.cobrancaLLM.input)} hint="por 1M tokens processados" />
        <StatCard label="LLM Output" value={formatBRL(sobMedida.cobrancaLLM.output)} hint="por 1M tokens gerados" />
      </div>

      <h2 className="mt-6 mb-3 text-lg font-semibold text-[var(--ink)]">
        Frentes de trabalho <span className="text-[var(--paper-ink)]/60">({sobMedidaFrentes.length})</span>
      </h2>

      <div className="space-y-4">
        {sobMedidaFrentes.map((f) => (
          <div
            key={f.id}
            className="relative overflow-hidden rounded-xl border border-[var(--line-paper)] bg-[var(--card)] shadow-[0_1px_2px_rgba(14,17,23,0.04),0_8px_20px_-12px_rgba(14,17,23,0.15)]"
          >
            <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--signal)]" />
            <div className="flex items-start gap-3 border-b border-[var(--line-paper)] bg-[var(--paper)] px-5 py-3">
              <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[var(--ink)] font-bold text-[var(--signal)]">
                {f.id}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--signal)]">Frente {f.id}</p>
                <h3 className="text-base font-semibold text-[var(--ink)]">{f.titulo}</h3>
                <p className="mt-1 text-sm text-[var(--paper-ink)]/70">{f.resumo}</p>
              </div>
            </div>
            <div className="divide-y divide-[var(--line-paper)]">
              {f.subitens.map((s, i) => (
                <div key={i} className="grid grid-cols-1 gap-1 px-5 py-2.5 md:grid-cols-[220px_1fr]">
                  <p className="text-sm font-semibold text-[var(--ink)]">{s.nome}</p>
                  <p className="text-sm text-[var(--paper-ink)]/70">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
