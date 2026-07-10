import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building, Users, MapPin } from "lucide-react";
import { sobMedidaFrentes } from "@/data/pricing";
import { oportunidade } from "@/data/oportunidade";
import { formatNumber } from "@/lib/format";
import { FeatureCard } from "@/components/leucotron/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Proposta Incarmed × Leucotron" },
      { name: "description", content: "Proposta comercial da Leucotron para o grupo Incarmed, com 5 soluções integradas em uma única leitura." },
    ],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const secoes = [
    { url: "/oportunidade", n: "01", titulo: "Oportunidade", hint: "Contexto do cliente Incarmed" },
    { url: "/conecta",      n: "02", titulo: "Soluções",     hint: "Conecta, Agente, Flux, VoiceBOT e Sob Medida" },
    { url: "/financeiro",   n: "03", titulo: "Financeiro",   hint: "Investimento consolidado, mensal e anual" },
    { url: "/escopo",       n: "04", titulo: "Escopo",       hint: "O que está e o que não está incluído" },
    { url: "/cronograma",   n: "05", titulo: "Cronograma",   hint: "Marcos de implantação" },
    { url: "/aprovacao",    n: "06", titulo: "Aprovação",    hint: "Assinar e começar" },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">
        Proposta comercial · 2026 · {formatNumber(sobMedidaFrentes.length)} frentes · 6 seções
      </p>
      <h1 className="font-display text-[36px] font-semibold leading-[1.05] tracking-tight text-[var(--ink)] md:text-[56px]">
        Uma proposta unificada de automação de atendimento para o Incarmed.
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--paper-ink)]/70">
        Esta proposta reúne 5 soluções integradas em uma única contratação, sem trocar de fornecedor.
        Hoje o grupo processa cerca de 16 mil mensagens por mês em WhatsApp sem integração ao ERP hospitalar.
        A Leucotron entrega a central de relacionamento inteligente, pronta para escalar.
      </p>

      {/* Bloco de valorização do cliente — usa apenas dados já existentes em oportunidade.ts */}
      <div className="mt-10">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--paper-ink)]/50">
          Sobre o {oportunidade.cliente}
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FeatureCard icon={<Building className="h-4 w-4" />} title="Porte">
            <p className="text-sm">
              Grupo hospitalar de grande porte, referência regional em serviços de saúde,
              com estrutura consolidada de atendimento presencial e digital.
            </p>
          </FeatureCard>
          <FeatureCard icon={<Users className="h-4 w-4" />} title="Time de relacionamento">
            <p className="text-sm">
              Cerca de <strong>38 pessoas</strong> dedicadas ao atendimento, distribuídas entre telefonia
              (manhã e tarde) e canais digitais, dentro de um quadro total próximo de
              <strong> 700 a 800 colaboradores</strong>.
            </p>
          </FeatureCard>
          <FeatureCard icon={<MapPin className="h-4 w-4" />} title="Atuação">
            <p className="text-sm">
              Operação de destaque na <strong>Bahia</strong>, com processos de agendamento e
              relacionamento maduros e pronta para dar o próximo salto com automação e IA.
            </p>
          </FeatureCard>
        </div>
      </div>

      <div className="mt-14">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--paper-ink)]/50">
          Índice
        </p>
        <ul className="divide-y divide-[var(--line-paper)] border-y border-[var(--line-paper)]">
          {secoes.map((s) => (
            <li key={s.url}>
              <Link
                to={s.url}
                className="group flex items-baseline gap-6 py-5 transition-colors hover:bg-[var(--ink)]/[0.02]"
              >
                <span className="font-mono text-[12px] tabular-nums text-[var(--signal)] tracking-wider">
                  {s.n}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-semibold text-[var(--ink)] md:text-xl">
                    {s.titulo}
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--paper-ink)]/60">{s.hint}</p>
                </div>
                <ArrowRight className="h-4 w-4 flex-none text-[var(--paper-ink)]/30 transition-all group-hover:translate-x-1 group-hover:text-[var(--signal)]" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
