import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/leucotron/brand";
import { escopoPorSolucao } from "@/data/escopo";
import { CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/escopo")({
  head: () => ({
    meta: [
      { title: "Escopo e Não Escopo — Proposta Incarmed" },
      { name: "description", content: "O que está e o que não está incluído em cada solução da proposta." },
    ],
  }),
  component: EscopoPage,
});

function EscopoPage() {
  return (
    <div>
      <SectionTitle
        eyebrow="Delimitação do projeto"
        title="Escopo e Não Escopo"
        description="Organizado por solução para alinhar expectativas e evitar retrabalho."
      />

      <div className="space-y-6">
        {escopoPorSolucao.map((s) => (
          <section
            key={s.id}
            className="rounded-xl border border-[var(--line-paper)] bg-[var(--card)] p-5 shadow-[0_1px_2px_rgba(14,17,23,0.04),0_8px_20px_-12px_rgba(14,17,23,0.15)]"
          >
            <div className="flex items-center gap-3 border-b border-[var(--line-paper)] pb-3">
              <span className="h-2 w-2 rounded-full bg-[var(--signal)]" aria-hidden />
              <h2 className="text-base font-semibold text-[var(--ink)]">{s.solucao}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--paper-ink)]/60">
                  Incluído
                </p>
                <ul className="space-y-2">
                  {s.escopo.map((it, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[var(--signal)]" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--paper-ink)]/60">
                  Não incluído
                </p>
                <ul className="space-y-2">
                  {s.naoEscopo.map((it, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-[var(--paper-ink)]/80">
                      <XCircle className="mt-0.5 h-4 w-4 flex-none text-[var(--paper-ink)]/40" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
