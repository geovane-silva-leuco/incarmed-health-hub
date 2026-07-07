import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowRight, MessageSquare, Bot, PhoneCall, Mic, Wrench } from "lucide-react";
import { SectionTitle, StatCard } from "@/components/leucotron/brand";
import { SocialProofStrip } from "@/components/leucotron/social-proof";
import { CompositionChart } from "@/components/leucotron/composition-chart";
import {
  conectaValorBaseMensal, conectaAtivacaoPremium,
  agenteInteligentePlanos, agenteInteligente,
  fluxModalidadeCloud,
  voicebot,
  sobMedida, sobMedidaFrentes,
} from "@/data/pricing";
import { formatBRL } from "@/lib/format";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Geral — Proposta Incarmed × Leucotron" },
      { name: "description", content: "Visão consolidada da proposta: 5 soluções Leucotron para o Incarmed com totais mensais, únicos e composição financeira." },
    ],
  }),
  component: DashboardHome,
});

/**
 * Home / Dashboard executivo.
 *
 * - Neuromarketing: H1 com aversão à perda; prova social (Padrão F) logo
 *   abaixo do título, antes dos preços aparecerem.
 * - Performance: o gráfico Recharts está em chunk lazy (~90KB) via
 *   `CompositionChart`, tirando-o do bundle inicial.
 * - Cálculo: `composicao`, `totalMensal` e `totalAtivacao` são memoizados
 *   pois derivam apenas de constantes dos data files.
 */
function DashboardHome() {
  const agenteTiny = agenteInteligentePlanos[0].valorMensal;

  const composicao = useMemo(
    () => [
      { name: "Conecta", value: conectaValorBaseMensal },
      { name: "Agente Inteligente", value: agenteTiny },
      { name: "Flux 3.0 (Cloud)", value: fluxModalidadeCloud.totalMensal },
      { name: "VoiceBOT", value: voicebot.valorMensal },
      { name: "Sob Medida", value: sobMedida.valorMensal },
    ],
    [agenteTiny],
  );

  const totalMensal = useMemo(
    () => composicao.reduce((s, c) => s + c.value, 0),
    [composicao],
  );

  // Ativação = soma dos setups únicos + 1 mensalidade do VoiceBOT (padrão comercial).
  const totalAtivacao =
    conectaAtivacaoPremium +
    agenteInteligente.ativacaoMinima +
    fluxModalidadeCloud.ativacaoUnica +
    Math.round(voicebot.valorMensal) +
    sobMedida.ativacaoUnica;

  const cards = [
    { to: "/conecta", icon: MessageSquare, nome: "Conecta", desc: "Plataforma omnichannel (WhatsApp, redes, chat, voz).", valor: conectaValorBaseMensal, hint: "Pacote 25.000 msg" },
    { to: "/agente", icon: Bot, nome: "Agente Inteligente", desc: "IA conversacional por texto — planos Tiny, Small e Medium.", valor: agenteTiny, hint: "Plano Tiny" },
    { to: "/flux", icon: PhoneCall, nome: "Flux 3.0", desc: "PABX, telefonia, call center e colaboração Mobi.", valor: fluxModalidadeCloud.totalMensal, hint: "Modalidade Cloud" },
    { to: "/voicebot", icon: Mic, nome: "VoiceBOT", desc: "Atendimento por voz com IA — 1.500.000 créditos/mês.", valor: voicebot.valorMensal, hint: "3 agentes + 1 número" },
    { to: "/sob-medida", icon: Wrench, nome: "Sob Medida", desc: "Projeto de integração customizada com PIXEON — 5 frentes.", valor: sobMedida.valorMensal, hint: `${sobMedidaFrentes.length} frentes de trabalho` },
  ] as const;

  return (
    <div>
      <SectionTitle
        eyebrow="Proposta comercial · Incarmed · Bahia"
        title="Toda a proposta Leucotron em uma tela — sem planilhas, sem retrabalho"
        description="5 soluções, valores atualizados e cenários de investimento prontos para a reunião com o TI do Incarmed. Sem esta visão consolidada, cada revisão custa dias de e-mail."
      />

      {/* Prova social — Padrão F, disparado antes de qualquer preço aparecer */}
      <SocialProofStrip />




      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Investimento Mensal Recorrente" value={formatBRL(totalMensal)} hint="Soma das 5 soluções (Flux Cloud + Agente Tiny)" accent />
        <StatCard label="Investimento Único (Ativações)" value={formatBRL(totalAtivacao)} hint="Setup + configuração inicial" />
        <StatCard label="Soluções na proposta" value="5" hint="Conecta · Agente · Flux · VoiceBOT · Sob Medida" />
        <StatCard label="Frentes do Sob Medida" value={String(sobMedidaFrentes.length)} hint="Integração PIXEON completa" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Composição do investimento mensal recorrente</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <div className="mt-4">
            <CompositionChart data={composicao} />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Contexto rápido</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-muted-foreground">Cliente</dt><dd className="font-semibold text-[var(--brand-navy)]">Incarmed — Bahia</dd></div>
            <div><dt className="text-muted-foreground">Contato técnico</dt><dd className="font-semibold text-[var(--brand-navy)]">João Victor — Supervisor da Central</dd></div>
            <div><dt className="text-muted-foreground">Volume atual WhatsApp</dt><dd className="font-semibold text-[var(--brand-navy)]">~15 a 16 mil msg/mês</dd></div>
            <div><dt className="text-muted-foreground">Sistema a integrar</dt><dd className="font-semibold text-[var(--brand-navy)]">PIXEON (ERP/PACS)</dd></div>
            <div><dt className="text-muted-foreground">Status</dt><dd className="font-semibold text-[var(--brand-navy)]">Proposta enviada · aguardando TI</dd></div>
          </dl>
          <Link to="/oportunidade" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-cyan)] hover:underline">
            Ver oportunidade completa <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <h2 className="mt-10 mb-4 text-xl font-semibold text-[var(--brand-navy)]">Soluções em negociação</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--brand-cyan)] hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand-navy)] text-[var(--brand-cyan)]">
                <c.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--brand-cyan)]" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--brand-navy)]">{c.nome}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">A partir de</p>
              <p className="text-xl font-bold text-[var(--brand-navy)]">{formatBRL(c.valor)}<span className="ml-1 text-xs font-normal text-muted-foreground">/mês</span></p>
              <p className="text-[11px] text-muted-foreground">{c.hint}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
