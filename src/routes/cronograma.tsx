import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/leucotron/brand";
import { FileText, CheckCircle2, FileSignature, Rocket, Settings2, ClipboardCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/cronograma")({
  head: () => ({
    meta: [
      { title: "Cronograma — Projeto Incarmed" },
      { name: "description", content: "Etapas macro da entrega, da proposta ao go-live." },
    ],
  }),
  component: CronogramaPage,
});

const steps = [
  { icon: FileText, titulo: "Proposta", desc: "Envio e validação comercial", semanas: 1 },
  { icon: CheckCircle2, titulo: "Aceite", desc: "Confirmação do cliente", semanas: 1 },
  { icon: FileSignature, titulo: "Contrato", desc: "Assinatura em até 5 dias úteis", semanas: 1 },
  { icon: Rocket, titulo: "Kickoff", desc: "Handoff para o time técnico", semanas: 1 },
  { icon: Settings2, titulo: "Ativação", desc: "Configuração e treinamento", semanas: 3 },
  { icon: ClipboardCheck, titulo: "Homologação", desc: "Testes conjuntos (Sob Medida)", semanas: 2 },
  { icon: Zap, titulo: "Go Live", desc: "Operação em produção", semanas: 1 },
];

const totalSemanas = steps.reduce((s, x) => s + x.semanas, 0);

function CronogramaPage() {
  let acumulado = 0;
  return (
    <div>
      <SectionTitle
        eyebrow="Fluxo de execução"
        title="Cronograma"
        description="Etapas macro da entrega. Prazos específicos variam por solução."
      />

      {/* Timeline horizontal compacta */}
      <div className="rounded-xl border border-[var(--line-paper)] bg-[var(--card)] p-5 shadow-[0_1px_2px_rgba(14,17,23,0.04),0_8px_20px_-12px_rgba(14,17,23,0.15)]">
        <ol className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {steps.map((s, i) => (
            <li key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-5 hidden h-[2px] w-full bg-[var(--signal)]/30 lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--signal)] shadow-md">
                  <s.icon className="h-4 w-4" />
                </div>
                <p className="mt-2 text-xs font-semibold text-[var(--ink)]">{s.titulo}</p>
                <p className="text-[11px] text-[var(--paper-ink)]/60">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Gantt simplificado */}
      <div className="mt-4 rounded-xl border border-[var(--line-paper)] bg-[var(--card)] p-5 shadow-[0_1px_2px_rgba(14,17,23,0.04),0_8px_20px_-12px_rgba(14,17,23,0.15)]">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--ink)]">
            Distribuição no tempo
          </h2>
          <span className="font-mono text-[11px] tabular-nums text-[var(--paper-ink)]/60">
            {totalSemanas} semanas totais
          </span>
        </div>
        <div className="space-y-1.5">
          {steps.map((s, i) => {
            const start = (acumulado / totalSemanas) * 100;
            const width = (s.semanas / totalSemanas) * 100;
            acumulado += s.semanas;
            return (
              <div key={i} className="grid grid-cols-[140px_1fr_60px] items-center gap-3 text-xs">
                <span className="truncate font-semibold text-[var(--ink)]">{s.titulo}</span>
                <div className="relative h-5 rounded-sm bg-[var(--paper-ink)]/5">
                  <div
                    className="absolute inset-y-0 rounded-sm bg-[var(--signal)]"
                    style={{ left: `${start}%`, width: `${width}%` }}
                  />
                </div>
                <span className="text-right font-mono tabular-nums text-[var(--paper-ink)]/60">
                  {s.semanas} sem.
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-xs italic text-[var(--paper-ink)]/60">
        Estimativa referencial. Prazos definitivos por solução são acordados após o kickoff.
      </p>
    </div>
  );
}
