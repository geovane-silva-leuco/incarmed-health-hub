import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle, CheckList } from "@/components/leucotron/brand";
import { oportunidade } from "@/data/oportunidade";
import { Users, Building, Target, Activity } from "lucide-react";

export const Route = createFileRoute("/oportunidade")({
  head: () => ({
    meta: [
      { title: "Sobre a Oportunidade — Incarmed" },
      { name: "description", content: "Contexto do cliente Incarmed: dor, volumes, contatos e status da negociação." },
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
        description="Resumo executivo da negociação em curso com o Incarmed."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--brand-navy)]">
            <Building className="h-4 w-4 text-[var(--brand-cyan)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Cliente</h3>
          </div>
          <p className="mt-3 text-lg font-bold text-[var(--brand-navy)]">{oportunidade.cliente}</p>
          <p className="text-sm text-muted-foreground">{oportunidade.segmento}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--brand-navy)]">
            <Users className="h-4 w-4 text-[var(--brand-cyan)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contatos-chave</h3>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {oportunidade.contatos.map((c) => (
              <li key={c.nome}>
                <span className="font-semibold text-[var(--brand-navy)]">{c.nome}</span>
                <span className="text-muted-foreground"> — {c.papel}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--brand-navy)]">
            <Activity className="h-4 w-4 text-[var(--brand-cyan)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Status</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{oportunidade.status}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border-l-4 border-l-[var(--brand-cyan)] border-y border-r border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--brand-navy)]">
            <Target className="h-4 w-4 text-[var(--brand-cyan)]" />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Dor principal</h3>
          </div>
          <p className="mt-3 text-base leading-relaxed text-foreground">{oportunidade.dorPrincipal}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-navy)]">Necessidade central</h3>
          <div className="mt-1 h-[2px] w-8 bg-[var(--brand-cyan)]" />
          <p className="mt-3 text-base leading-relaxed text-foreground">{oportunidade.necessidade}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-navy)]">Confirmação de agenda</h3>
          <div className="mt-1 h-[2px] w-8 bg-[var(--brand-cyan)]" />
          <p className="mt-3 text-sm leading-relaxed text-foreground">{oportunidade.confirmacaoAgenda}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-navy)]">Volumes atuais</h3>
          <div className="mt-1 h-[2px] w-8 bg-[var(--brand-cyan)]" />
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {oportunidade.volumes.map((v) => (
              <div key={v.label} className="border-b border-border/60 pb-2">
                <dt className="text-xs text-muted-foreground">{v.label}</dt>
                <dd className="font-semibold text-[var(--brand-navy)]">{v.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

    </div>
  );
}
