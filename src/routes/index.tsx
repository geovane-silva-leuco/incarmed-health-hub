import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { sobMedidaFrentes } from "@/data/pricing";
import { oportunidade } from "@/data/oportunidade";
import { formatNumber } from "@/lib/format";


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

      {/* Bloco de valorização do cliente */}
      <div className="mt-10">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--paper-ink)]/50">
          Sobre o {oportunidade.cliente}
        </p>
        <div className="border-l-2 border-[var(--signal)] pl-5">
          <p className="text-[15px] leading-relaxed text-[var(--paper-ink)]/80">
            Fundado em 2003, em Santo Antônio de Jesus, o Incarmed é hoje o maior hospital privado do Recôncavo Baiano,
            com laboratório e centro cirúrgico próprios e especialidades que vão de cardiologia a cirurgia bariátrica.
            Sua equipe médica já ocupou posições de referência nacional, como a presidência da Associação Brasileira
            para o Estudo da Obesidade (Abeso), e liderou procedimentos inéditos na região, incluindo tratamentos
            avançados de arritmia cardíaca em Salvador. É para uma operação desse porte que esta proposta foi desenhada.
          </p>
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
