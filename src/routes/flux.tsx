import { createFileRoute } from "@tanstack/react-router";
import { PhoneCall, Check, X } from "lucide-react";
import { useState } from "react";
import { ProductBanner, CheckList, StatCard } from "@/components/leucotron/brand";
import { SegmentedToggle } from "@/components/leucotron/segmented-toggle";
import {
  fluxModalidadeCloud, fluxModalidadeOnPremise,
  fluxPlanosOpcionais, fluxRecursosTelefonia, fluxRecursosIA,
} from "@/data/pricing";
import { formatBRL } from "@/lib/format";


export const Route = createFileRoute("/flux")({
  head: () => ({
    meta: [
      { title: "Flux 3.0 — PABX, telefonia e call center" },
      { name: "description", content: "Duas modalidades: Cloud (SaaS mensal) e On-Premise (licenciamento anual)." },
    ],
  }),
  component: FluxPage,
});

function FluxPage() {
  const [modo, setModo] = useState<"cloud" | "onpremise">("cloud");
  const m = modo === "cloud" ? fluxModalidadeCloud : fluxModalidadeOnPremise;
  const isCloud = modo === "cloud";

  return (
    <div>
      <ProductBanner
        eyebrow="Solução 3 de 5"
        title="Flux 3.0"
        subtitle="PABX, telefonia IP, call center e colaboração (Mobi). Duas modalidades comerciais reais e simultâneas — o cliente escolhe."
        icon={<PhoneCall className="h-7 w-7" />}
      />

      <div className="mb-6">
        <SegmentedToggle
          ariaLabel="Modalidade comercial do Flux 3.0"
          value={modo}
          onChange={setModo}
          options={[
            { value: "cloud", label: "Cloud · Mensal" },
            { value: "onpremise", label: "On-Premise · Anual" },
          ]}
        />
      </div>


      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--brand-cyan)] font-semibold">Modalidade selecionada</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--brand-navy)]">{m.nome}</h2>
            <p className="text-sm text-muted-foreground">Hospedagem: {m.quemHospeda} · Pagamento: {m.pagamento}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            label={isCloud ? "Total mensal" : "Total anual"}
            value={isCloud ? formatBRL(fluxModalidadeCloud.totalMensal) : formatBRL(fluxModalidadeOnPremise.totalAnual)}
            accent
          />
          <StatCard
            label={isCloud ? "Equivalente anual (12x)" : "Equivalente mensal"}
            value={isCloud ? formatBRL(fluxModalidadeCloud.equivalenteAnual12x) : formatBRL(fluxModalidadeOnPremise.equivalenteMensal)}
          />
          <StatCard label="Ativação única" value={formatBRL(m.ativacaoUnica)} />
          <StatCard
            label="Investimento por usuário"
            value={formatBRL(m.investimentoPorUsuario)}
            hint={isCloud ? "por mês" : "por mês (equivalente)"}
          />
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--brand-navy)] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Ref.</th>
                <th className="px-4 py-3 text-left font-semibold">Descrição</th>
                <th className="px-4 py-3 text-right font-semibold">Qtd.</th>
                <th className="px-4 py-3 text-right font-semibold">Unitário</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {m.itens.map((it, i) => (
                <tr key={i} className={i % 2 ? "bg-[var(--brand-surface)]" : "bg-white"}>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{it.ref}</td>
                  <td className="px-4 py-2.5">{it.desc}</td>
                  <td className="px-4 py-2.5 text-right">{it.qtd}</td>
                  <td className="px-4 py-2.5 text-right">{it.unitario === 0 ? "—" : formatBRL(it.unitario)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">{it.total === 0 ? "Incluso" : formatBRL(it.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isCloud && (
          <p className="mt-4 rounded-lg bg-[var(--brand-surface)] p-3 text-xs italic text-muted-foreground">
            {fluxModalidadeOnPremise.observacao}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="p-6 pb-3">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Comparativo de planos opcionais</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--brand-navy)] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Recurso</th>
                <th className="px-4 py-3 text-center font-semibold">Basic</th>
                <th className="px-4 py-3 text-center font-semibold">Essential</th>
                <th className="px-4 py-3 text-center font-semibold">Advanced</th>
              </tr>
            </thead>
            <tbody>
              {fluxPlanosOpcionais.map((r, i) => (
                <tr key={r.recurso} className={i % 2 ? "bg-[var(--brand-surface)]" : "bg-white"}>
                  <td className="px-4 py-2">{r.recurso}</td>
                  <td className="px-4 py-2 text-center">{r.basic ? <Check className="mx-auto h-4 w-4 text-[var(--brand-cyan)]" /> : <X className="mx-auto h-4 w-4 text-muted-foreground/40" />}</td>
                  <td className="px-4 py-2 text-center">{r.essential ? <Check className="mx-auto h-4 w-4 text-[var(--brand-cyan)]" /> : <X className="mx-auto h-4 w-4 text-muted-foreground/40" />}</td>
                  <td className="px-4 py-2 text-center">{r.advanced ? <Check className="mx-auto h-4 w-4 text-[var(--brand-cyan)]" /> : <X className="mx-auto h-4 w-4 text-muted-foreground/40" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Recursos de telefonia</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <div className="mt-4"><CheckList items={fluxRecursosTelefonia} /></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Recursos de IA (adicionais)</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <div className="mt-4"><CheckList items={fluxRecursosIA} /></div>
        </div>
      </div>
    </div>
  );
}
