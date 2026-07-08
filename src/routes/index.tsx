import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowRight, MessageSquare, Bot, PhoneCall, Mic, Wrench, CalendarCheck2 } from "lucide-react";
import { SectionTitle, StatCard } from "@/components/leucotron/brand";
import { SocialProofStrip } from "@/components/leucotron/social-proof";
import { CompositionChart } from "@/components/leucotron/composition-chart";
import {
  conectaAtivacaoPremium,
  agenteInteligente,
  fluxModalidadeCloud, fluxModalidadeOnPremise,
  voicebot,
  sobMedida, sobMedidaFrentes,
} from "@/data/pricing";
import { formatBRL, formatNumber } from "@/lib/format";
import {
  useProposalConfig,
  getConectaPacote,
  getAgentePlano,
} from "@/lib/proposal-config";



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
 * Faz o cruzamento de dados entre a configuração comercial escolhida
 * (`useProposalConfig`) e os valores oficiais de `@/data/pricing`. Cada card
 * de solução mostra exatamente o pacote/plano/modalidade contratado.
 */
function DashboardHome() {
  const cfg = useProposalConfig();

  const conectaPacote = getConectaPacote(cfg);
  const agente = getAgentePlano(cfg);
  const flux = cfg.fluxModalidade === "cloud" ? fluxModalidadeCloud : fluxModalidadeOnPremise;
  const fluxMensal = cfg.fluxModalidade === "cloud" ? fluxModalidadeCloud.totalMensal : fluxModalidadeOnPremise.equivalenteMensal;
  const voiceMensal =
    cfg.voicebotModo === "off"
      ? 0
      : cfg.voicebotModo === "mensal"
      ? voicebot.valorMensal
      : voicebot.equivalenteMensalNoAnual;

  const composicao = useMemo(
    () =>
      [
        { name: "Conecta", value: conectaPacote.valorMensal },
        { name: `Agente · ${agente.plano}`, value: agente.valorMensal },
        { name: `Flux 3.0 (${cfg.fluxModalidade === "cloud" ? "Cloud" : "On-Prem"})`, value: fluxMensal },
        { name: "VoiceBOT", value: voiceMensal },
        { name: "Sob Medida", value: sobMedida.valorMensal },
      ].filter((c) => c.value > 0),
    [conectaPacote.valorMensal, agente.plano, agente.valorMensal, cfg.fluxModalidade, fluxMensal, voiceMensal],
  );

  const totalMensal = composicao.reduce((s, c) => s + c.value, 0);

  // Ativação = soma dos setups únicos + 1 mensalidade do VoiceBOT (padrão comercial).
  const totalAtivacao =
    conectaAtivacaoPremium +
    agenteInteligente.ativacaoMinima +
    flux.ativacaoUnica +
    (cfg.voicebotModo === "off" ? 0 : Math.round(voicebot.valorMensal)) +
    sobMedida.ativacaoUnica;

  const voiceHint =
    cfg.voicebotModo === "off"
      ? "Não incluso nesta configuração"
      : cfg.voicebotModo === "mensal"
      ? "3 agentes + 1 número · Mensal"
      : "3 agentes + 1 número · Anual à vista";

  const cards = [
    {
      to: "/conecta",
      icon: MessageSquare,
      nome: "Conecta",
      desc: "Plataforma omnichannel (WhatsApp, redes, chat, voz).",
      valor: conectaPacote.valorMensal,
      hint: `Pacote ${formatNumber(conectaPacote.mensagens)} msg/mês${cfg.conectaConfirmadorConsultas ? " · + Confirmador de Consultas" : ""}`,
      badge: cfg.conectaConfirmadorConsultas ? { icon: CalendarCheck2, label: "Confirmador de consultas" } : null,
    },
    {
      to: "/agente",
      icon: Bot,
      nome: "Agente Inteligente",
      desc: "IA conversacional por texto — plano contratado abaixo.",
      valor: agente.valorMensal,
      hint: `Plano ${agente.plano}`,
      badge: null,
    },
    {
      to: "/flux",
      icon: PhoneCall,
      nome: "Flux 3.0 · PABX",
      desc: cfg.fluxModalidade === "cloud"
        ? "Licença + hospedagem gerenciada pela Leucotron."
        : "Licenciamento anual — hospedagem na Incarmed.",
      valor: fluxMensal,
      hint: cfg.fluxModalidade === "cloud" ? "Modalidade Cloud (SaaS mensal)" : "Modalidade On-Premise (Licenciamento anual)",
      badge: null,
    },
    {
      to: "/voicebot",
      icon: Mic,
      nome: "VoiceBOT",
      desc: "Atendimento por voz com IA — 1.500.000 créditos/mês.",
      valor: voiceMensal,
      hint: voiceHint,
      badge: null,
    },
    {
      to: "/sob-medida",
      icon: Wrench,
      nome: "Sob Medida",
      desc: "Projeto de integração customizada com PIXEON.",
      valor: sobMedida.valorMensal,
      hint: `${cfg.sobMedidaFrentes.length} de ${sobMedidaFrentes.length} frentes contratadas`,
      badge: null,
    },
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
        <StatCard label="Investimento Mensal Recorrente" value={formatBRL(totalMensal)} hint={`Config. atual: Conecta ${formatNumber(conectaPacote.mensagens)} · Agente ${agente.plano} · Flux ${cfg.fluxModalidade === "cloud" ? "Cloud" : "On-Prem"}`} accent />
        <StatCard label="Investimento Único (Ativações)" value={formatBRL(totalAtivacao)} hint="Setup + configuração inicial" />
        <StatCard label="Soluções ativas" value={String(composicao.length)} hint={cfg.voicebotModo === "off" ? "VoiceBOT fora da configuração" : "Conecta · Agente · Flux · VoiceBOT · Sob Medida"} />
        <StatCard label="Frentes do Sob Medida" value={`${cfg.sobMedidaFrentes.length} / ${sobMedidaFrentes.length}`} hint="Integração PIXEON" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Composição do investimento mensal recorrente</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <p className="mt-2 text-xs text-muted-foreground">
            Reflete a configuração atual da proposta. Ajuste em <Link to="/financeiro" className="font-semibold text-[var(--brand-cyan)] hover:underline">Financeiro Consolidado</Link>.
          </p>
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
            {c.badge && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-cyan)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--brand-navy)]">
                <c.badge.icon className="h-3 w-3" /> {c.badge.label}
              </div>
            )}
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Contratado</p>
              <p className="text-xl font-bold text-[var(--brand-navy)]">
                {c.valor === 0 ? "—" : formatBRL(c.valor)}
                {c.valor > 0 && <span className="ml-1 text-xs font-normal text-muted-foreground">/mês</span>}
              </p>
              <p className="text-[11px] text-muted-foreground">{c.hint}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
