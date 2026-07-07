import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/leucotron/brand";
import { dependenciasBloqueantes, dependenciasInfra, dependenciasConteudo, type Responsavel } from "@/data/dependencias";
import { AlertTriangle, Server, FileText, Check } from "lucide-react";

export const Route = createFileRoute("/dependencias")({
  head: () => ({
    meta: [
      { title: "Dependências & Pré-requisitos — Projeto Incarmed" },
      { name: "description", content: "Checklist de bloqueantes, infraestrutura e conteúdo por responsável." },
    ],
  }),
  component: DependenciasPage,
});

const badgeColor: Record<Responsavel, string> = {
  Cliente: "bg-red-500/10 text-red-700 border-red-500/30",
  Leucotron: "bg-[var(--brand-cyan)]/10 text-[var(--brand-navy)] border-[var(--brand-cyan)]/40",
  Ambos: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  "Cliente + PIXEON": "bg-red-500/10 text-red-700 border-red-500/30",
  "Cliente + fornecedor": "bg-red-500/10 text-red-700 border-red-500/30",
};

function Bloco({
  titulo, subtitulo, icone: Icon, cor, itens,
}: {
  titulo: string; subtitulo: string; icone: any; cor: string;
  itens: { item: string; responsavel: Responsavel }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className={`flex items-start gap-3 border-b border-border px-6 py-4 ${cor}`}>
        <Icon className="mt-0.5 h-5 w-5 flex-none" />
        <div>
          <h3 className="text-base font-semibold">{titulo}</h3>
          <p className="text-xs opacity-80">{subtitulo}</p>
        </div>
      </div>
      <ul className="divide-y divide-border">
        {itens.map((d, i) => (
          <li key={i} className="flex items-start gap-4 px-6 py-3">
            <Check className="mt-0.5 h-4 w-4 flex-none text-[var(--brand-cyan)]" />
            <div className="flex-1">
              <p className="text-sm text-foreground">{d.item}</p>
            </div>
            <span className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeColor[d.responsavel]}`}>
              {d.responsavel}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DependenciasPage() {
  return (
    <div>
      <SectionTitle
        eyebrow="Pré-requisitos"
        title="Dependências & Pré-requisitos"
        description="Itens que precisam estar prontos para o projeto avançar. Bloqueantes impedem o início da integração."
      />

      <div className="space-y-6">
        <Bloco
          titulo="Bloqueantes"
          subtitulo="Impedem o início da integração"
          icone={AlertTriangle}
          cor="bg-red-500/5 text-red-700"
          itens={dependenciasBloqueantes}
        />
        <Bloco
          titulo="Infraestrutura obrigatória"
          subtitulo="Ambientes necessários em operação"
          icone={Server}
          cor="bg-[var(--brand-navy)]/5 text-[var(--brand-navy)]"
          itens={dependenciasInfra}
        />
        <Bloco
          titulo="Dependências de conteúdo e negócio"
          subtitulo="Insumos e decisões necessárias"
          icone={FileText}
          cor="bg-[var(--brand-cyan)]/5 text-[var(--brand-navy)]"
          itens={dependenciasConteudo}
        />
      </div>
    </div>
  );
}
