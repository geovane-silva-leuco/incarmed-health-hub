import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle } from "@/components/leucotron/brand";
import { FileText, CheckCircle2, FileSignature, Rocket, Settings2, ClipboardCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/cronograma")({
  head: () => ({
    meta: [
      { title: "Cronograma — Projeto Incarmed" },
      { name: "description", content: "Etapas de execução: da proposta ao go-live." },
    ],
  }),
  component: CronogramaPage,
});

const steps = [
  { icon: FileText, titulo: "Proposta", desc: "Envio e validação comercial" },
  { icon: CheckCircle2, titulo: "Aceite", desc: "Confirmação do cliente" },
  { icon: FileSignature, titulo: "Contrato", desc: "Assinatura (5 dias úteis após envio)" },
  { icon: Rocket, titulo: "Kickoff / Handoff", desc: "Transferência para o time técnico" },
  { icon: Settings2, titulo: "Ativação", desc: "Configuração + treinamento" },
  { icon: ClipboardCheck, titulo: "Homologação", desc: "Testes conjuntos (Sob Medida)" },
  { icon: Zap, titulo: "Go Live", desc: "Operação em produção" },
];

function CronogramaPage() {
  return (
    <div>
      <SectionTitle
        eyebrow="Fluxo de execução"
        title="Cronograma"
        description="Etapas macro da entrega. Prazos específicos variam por solução."
      />

      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {steps.map((s, i) => (
            <li key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-[2px] w-full bg-gradient-to-r from-[var(--brand-cyan)]/70 to-[var(--brand-cyan)]/20 lg:block" />
              )}
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-navy)] text-[var(--brand-cyan)] shadow-md">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[var(--brand-navy)]">{s.titulo}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                <span className="mt-2 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-cyan)]">Etapa {i + 1}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 rounded-lg border-l-4 border-l-[var(--brand-cyan)] bg-[var(--brand-cyan)]/5 p-4 text-sm text-foreground">
        <p>
          <strong>Prazos por solução:</strong> Conecta — contrato disponibilizado em até 3 dias úteis após aceite, com 5 dias úteis para assinatura. Flux, VoiceBOT e Sob Medida — cronograma definido conforme escopo aprovado e disponibilização de acessos/documentação pelo cliente.
        </p>
      </div>
    </div>
  );
}
