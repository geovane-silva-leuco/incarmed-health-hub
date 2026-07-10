import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/leucotron/brand";
import {
  dependenciasBloqueantes,
  dependenciasInfra,
  dependenciasConteudo,
  type DependenciaItem,
  type Responsavel,
} from "@/data/dependencias";
import { AlertCircle, Server, FileText, Check, Info } from "lucide-react";
import { useProposalConfig } from "@/lib/proposal-config";

export const Route = createFileRoute("/dependencias")({
  head: () => ({
    meta: [
      { title: "Pré-requisitos — Projeto Incarmed" },
      { name: "description", content: "Condições necessárias para o início da implantação, por responsável." },
    ],
  }),
  component: DependenciasPage,
});

const badgeColor: Record<Responsavel, string> = {
  Cliente: "bg-[var(--signal)]/10 text-[var(--signal)] border-[var(--signal)]/30",
  Leucotron: "bg-[var(--ink)]/5 text-[var(--ink)] border-[var(--ink)]/20",
  Ambos: "bg-[var(--paper-ink)]/5 text-[var(--paper-ink)] border-[var(--paper-ink)]/20",
  "Cliente + PIXEON": "bg-[var(--signal)]/10 text-[var(--signal)] border-[var(--signal)]/30",
  "Cliente + fornecedor": "bg-[var(--signal)]/10 text-[var(--signal)] border-[var(--signal)]/30",
};

function Bloco({
  titulo,
  subtitulo,
  icone: Icon,
  itens,
  fluxOnPremise,
}: {
  titulo: string;
  subtitulo: string;
  icone: typeof Server;
  itens: DependenciaItem[];
  fluxOnPremise: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--line-paper)] bg-[var(--card)] shadow-[0_1px_2px_rgba(14,17,23,0.04),0_8px_20px_-12px_rgba(14,17,23,0.15)]">
      <div className="flex items-start gap-3 border-b border-[var(--line-paper)] px-5 py-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[var(--signal)]/10 text-[var(--signal)]">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <h3 className="text-base font-semibold text-[var(--ink)]">{titulo}</h3>
          <p className="text-xs text-[var(--paper-ink)]/60">{subtitulo}</p>
        </div>
      </div>
      <ul className="divide-y divide-[var(--line-paper)]">
        {itens.map((d, i) => {
          const naoAplica = d.apenasFluxOnPremise && !fluxOnPremise;
          const enviado = d.status === "enviado";
          return (
            <li key={i} className={`flex items-start gap-3 px-5 py-3 ${naoAplica ? "opacity-60" : ""}`}>
              {enviado ? (
                <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
              ) : naoAplica ? (
                <Info className="mt-0.5 h-4 w-4 flex-none text-[var(--paper-ink)]/40" />
              ) : (
                <Check className="mt-0.5 h-4 w-4 flex-none text-[var(--signal)]" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--ink)]">{d.item}</p>
                {d.solucao && (
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-[var(--paper-ink)]/50">
                    {d.solucao}
                  </p>
                )}
                {naoAplica && (
                  <p className="mt-1 text-xs italic text-[var(--paper-ink)]/60">
                    Não necessário na modalidade Cloud.
                  </p>
                )}
                {enviado && !naoAplica && (
                  <p className="mt-1 text-xs font-semibold text-emerald-700">
                    {d.nota ?? "Enviado, aguardando validação."}
                  </p>
                )}
              </div>
              <span className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badgeColor[d.responsavel]}`}>
                {d.responsavel}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DependenciasPage() {
  const cfg = useProposalConfig();
  const fluxOnPremise = cfg.fluxModalidade === "onpremise";

  return (
    <div>
      <SectionTitle
        eyebrow="Pré-requisitos"
        title="Pré-requisitos e condições para início"
        description="Itens que precisam estar prontos para o projeto avançar, organizados por natureza e responsável."
      />

      <div className="space-y-4">
        <Bloco
          titulo="Pré-requisitos essenciais"
          subtitulo="Condições necessárias para iniciar a integração"
          icone={AlertCircle}
          itens={dependenciasBloqueantes}
          fluxOnPremise={fluxOnPremise}
        />
        <Bloco
          titulo="Infraestrutura"
          subtitulo="Ambientes que precisam estar operacionais"
          icone={Server}
          itens={dependenciasInfra}
          fluxOnPremise={fluxOnPremise}
        />
        <Bloco
          titulo="Conteúdo e definições de negócio"
          subtitulo="Insumos e decisões que dependem do cliente"
          icone={FileText}
          itens={dependenciasConteudo}
          fluxOnPremise={fluxOnPremise}
        />
      </div>
    </div>
  );
}
