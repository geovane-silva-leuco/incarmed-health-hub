import { createFileRoute } from "@tanstack/react-router";
import { PhoneCall, Check, MousePointerClick, Sparkles } from "lucide-react";
import { ProductBanner, CheckList, StatCard } from "@/components/leucotron/brand";
import { SegmentedToggle } from "@/components/leucotron/segmented-toggle";
import {
  fluxModalidadeCloud, fluxModalidadeOnPremise,
  fluxRecursosTelefonia, fluxRecursosIA,
} from "@/data/pricing";
import { formatBRL } from "@/lib/format";
import { useProposalConfig, setProposalConfig, type FluxModalidade } from "@/lib/proposal-config";


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
  const cfg = useProposalConfig();
  const modo = cfg.fluxModalidade;
  const setModo = (v: FluxModalidade) => setProposalConfig({ fluxModalidade: v });
  const m = modo === "cloud" ? fluxModalidadeCloud : fluxModalidadeOnPremise;
  const isCloud = modo === "cloud";

  return (
    <div>
      <ProductBanner
        eyebrow="Solução 3 de 5"
        title="Flux 3.0 · PABX"
        subtitle="PABX, telefonia IP, call center e colaboração (Mobi). Duas modalidades comerciais reais e simultâneas — o cliente escolhe."
        icon={<PhoneCall className="h-7 w-7" />}
      />

      <div className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>Modalidade selecionada</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--signal)]/10 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-[var(--signal)]">
            <MousePointerClick className="h-3 w-3" /> clique para trocar e ver os valores
          </span>
        </div>
        <SegmentedToggle
          ariaLabel="Modalidade comercial do Flux 3.0"
          value={modo}
          onChange={setModo}
          options={[
            { value: "cloud", label: "Cloud · SaaS Mensal" },
            { value: "onpremise", label: "On-Premise · Licenciamento Anual" },
          ]}
        />
      </div>


      <div className="rounded-xl border-2 border-[var(--brand-cyan)] bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1 rounded-full bg-[var(--signal)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"><Check className="h-3 w-3" /> Selecionado nesta proposta</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--brand-navy)]">{m.nome}</h2>
            <p className="text-sm text-muted-foreground">Hospedagem {m.quemHospeda} · Pagamento {m.pagamento}</p>
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
                <th className="px-4 py-3 text-left font-semibold">Pgto</th>
              </tr>
            </thead>
            <tbody>
              {m.itens.map((it, i) => {
                const incluso = it.unitario === 0 && it.total === 0;
                return (
                  <tr
                    key={i}
                    className={
                      incluso
                        ? "border-l-2 border-[var(--brand-cyan)]/40 bg-[var(--brand-cyan)]/5"
                        : i % 2
                          ? "bg-[var(--brand-surface)]"
                          : "bg-white"
                    }
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{it.ref}</td>
                    <td className={`px-4 py-2.5 ${incluso ? "pl-8 text-muted-foreground" : ""}`}>
                      {incluso ? "↳ " : ""}{it.desc}
                    </td>
                    <td className="px-4 py-2.5 text-right">{it.qtd}</td>
                    <td className={`px-4 py-2.5 text-right ${incluso ? "text-[10px] font-bold uppercase tracking-wider text-[var(--brand-cyan)]" : ""}`}>
                      {incluso ? "INCLUSO" : formatBRL(it.unitario)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold">
                      {incluso ? "–" : formatBRL(it.total)}
                    </td>
                    <td className={`px-4 py-2.5 text-xs ${incluso ? "italic text-muted-foreground" : "text-muted-foreground"}`}>
                      {incluso ? "Incluso" : isCloud ? "Mensal" : "Anual"}
                    </td>
                  </tr>
                );
              })}
              {/* Linha de ativação — visualmente separada da recorrência */}
              <tr>
                <td colSpan={6} className="px-4 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Investimento único (não somar à recorrência)
                </td>
              </tr>
              <tr className="border-t-2 border-dashed border-[var(--brand-navy)]/30 bg-amber-50/60">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">SV03379</td>
                <td className="px-4 py-3 font-semibold text-[var(--brand-navy)]">Ativação do Flux 3.0</td>
                <td className="px-4 py-3 text-right">1</td>
                <td className="px-4 py-3 text-right">{formatBRL(m.ativacaoUnica)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatBRL(m.ativacaoUnica)}</td>
                <td className="px-4 py-3 text-xs font-semibold text-amber-800">Única</td>
              </tr>
            </tbody>
          </table>
        </div>

        {!isCloud && (
          <p className="mt-4 rounded-lg bg-[var(--brand-surface)] p-3 text-xs italic text-muted-foreground">
            {fluxModalidadeOnPremise.observacao}
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--brand-navy)]">Recursos de telefonia</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <div className="mt-3"><CheckList items={fluxRecursosTelefonia} /></div>
        </div>
        <div className="relative overflow-hidden rounded-xl border border-[var(--signal)]/30 bg-card p-5 shadow-sm">
          <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--signal)]" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--signal)]" />
            <h2 className="text-base font-semibold text-[var(--brand-navy)]">Recursos de IA</h2>
            <span className="rounded-full bg-[var(--signal)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--signal)]">
              Módulo opcional adicional
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Não faz parte do pacote base do Flux 3.0. Contratado separadamente conforme necessidade.
          </p>
          <div className="mt-3"><CheckList items={fluxRecursosIA} /></div>
        </div>
      </div>
    </div>
  );
}
