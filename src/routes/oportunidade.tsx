import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle, FeatureCard } from "@/components/leucotron/brand";
import { oportunidade } from "@/data/oportunidade";
import { Users, Building, Target, Activity, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/oportunidade")({
  head: () => ({
    meta: [
      { title: "Sobre a Oportunidade — Incarmed" },
      { name: "description", content: "Contexto do cliente Incarmed com dor principal, volumes e contatos-chave." },
    ],
  }),
  component: OportunidadePage,
});

function OportunidadePage() {
  return (
    <div>
      <SectionTitle
        eyebrow="Contexto do cliente"
        title="Sobre a Oportunidade"
        description="Resumo executivo do contexto do Incarmed que motivou esta proposta."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard icon={<Building className="h-4 w-4" />} title="Cliente">
          <p className="text-base font-semibold text-[var(--ink)]">{oportunidade.cliente}</p>
          <p className="text-xs text-[var(--paper-ink)]/60">{oportunidade.segmento}</p>
        </FeatureCard>

        <FeatureCard icon={<Users className="h-4 w-4" />} title="Contatos-chave">
          <ul className="space-y-1 text-sm">
            {oportunidade.contatos.map((c) => (
              <li key={c.nome}>
                <span className="font-semibold text-[var(--ink)]">{c.nome}</span>
                <span className="text-[var(--paper-ink)]/60"> · {c.papel}</span>
              </li>
            ))}
          </ul>
        </FeatureCard>

        <FeatureCard icon={<Activity className="h-4 w-4" />} title="Preferência de contato">
          <p className="text-sm">{oportunidade.confirmacaoAgenda}</p>
        </FeatureCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FeatureCard icon={<Target className="h-4 w-4" />} title="Dor principal">
          <p className="text-sm">{oportunidade.dorPrincipal}</p>
        </FeatureCard>
        <FeatureCard icon={<Target className="h-4 w-4" />} title="Necessidade central">
          <p className="text-sm">{oportunidade.necessidade}</p>
        </FeatureCard>
      </div>

      <div className="mt-4">
        <FeatureCard icon={<BarChart3 className="h-4 w-4" />} title="Volumes atuais">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm md:grid-cols-3">
            {oportunidade.volumes.map((v) => (
              <div key={v.label} className="border-b border-[var(--line-paper)] pb-1.5">
                <dt className="text-[11px] text-[var(--paper-ink)]/60">{v.label}</dt>
                <dd className="font-semibold text-[var(--ink)]">{v.valor}</dd>
              </div>
            ))}
          </dl>
        </FeatureCard>
      </div>
    </div>
  );
}
