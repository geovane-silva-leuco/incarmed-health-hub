import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle, CheckList } from "@/components/leucotron/brand";
import { escopoResumo, naoEscopo } from "@/data/escopo";
import { XCircle } from "lucide-react";

export const Route = createFileRoute("/escopo")({
  head: () => ({
    meta: [
      { title: "Escopo & Não Escopo — Sob Medida Incarmed" },
      { name: "description", content: "O que está e o que não está incluído no projeto de integração PIXEON." },
    ],
  }),
  component: EscopoPage,
});

function EscopoPage() {
  return (
    <div>
      <SectionTitle
        eyebrow="Delimitação do projeto"
        title="Escopo & Não Escopo"
        description="Baseado nas 5 frentes do projeto Sob Medida — evita retrabalho e alinha expectativas com o cliente."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border-t-4 border-t-[var(--brand-cyan)] border-x border-b border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">✓ Escopo — o que está incluído</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <div className="mt-4"><CheckList items={escopoResumo} /></div>
        </div>

        <div className="rounded-xl border-t-4 border-t-red-500 border-x border-b border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">✗ Não Escopo — o que NÃO está incluído</h2>
          <div className="mt-1 h-[3px] w-10 bg-red-500" />
          <ul className="mt-4 space-y-2.5">
            {naoEscopo.map((it, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <XCircle className="mt-0.5 h-4 w-4 flex-none text-red-500/70" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
