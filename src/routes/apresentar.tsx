import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, X, MessageSquare, Bot, PhoneCall, Mic, Wrench,
  CalendarCheck2, ShieldCheck, Zap, Clock, TrendingUp, Users, Check,
  FileSignature, Sparkles, HeartHandshake, type LucideIcon,
} from "lucide-react";
import {
  agenteInteligentePlanos, fluxModalidadeCloud, fluxModalidadeOnPremise,
  voicebot, sobMedida, sobMedidaFrentes, conectaPacotesMensagens,
} from "@/data/pricing";
import { formatBRL, formatNumber } from "@/lib/format";
import {
  useProposalConfig, getConectaPacote, getAgentePlano,
} from "@/lib/proposal-config";

/**
 * Modo apresentação executiva — slide-a-slide, tela cheia.
 *
 * Direção visual: branco clean + acentos ciano (Leucotron).
 * Cada slide tem 1 ideia, pictograma grande, benefício em destaque
 * e preço discreto no rodapé (ancoragem valor > preço).
 *
 * Navegação: setas ← → ou Espaço; ESC sai. Também há dots clicáveis.
 * A rota é fixed inset-0 z-50 para cobrir sidebar/header do app.
 */
export const Route = createFileRoute("/apresentar")({
  head: () => ({
    meta: [
      { title: "Apresentação executiva — Leucotron × Incarmed" },
      { name: "description", content: "Modo apresentação slide-a-slide da proposta comercial." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PresentationMode,
});

type Benefit = { icon: LucideIcon; text: string };
type Slide = {
  kind: "cover" | "context" | "solution" | "investment" | "closing";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  accent?: string; // hint mostrado abaixo dos benefícios
  benefits?: Benefit[];
  price?: { label: string; value: string; note?: string };
  footnote?: string;
};

function PresentationMode() {
  const cfg = useProposalConfig();
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  const slides = useMemo<Slide[]>(() => {
    const conecta = getConectaPacote(cfg);
    const agente = getAgentePlano(cfg);
    const flux = cfg.fluxModalidade === "cloud" ? fluxModalidadeCloud : fluxModalidadeOnPremise;
    const fluxMensal = cfg.fluxModalidade === "cloud"
      ? fluxModalidadeCloud.totalMensal
      : fluxModalidadeOnPremise.equivalenteMensal;
    const voiceMensal = cfg.voicebotModo === "off"
      ? 0
      : cfg.voicebotModo === "mensal" ? voicebot.valorMensal : voicebot.equivalenteMensalNoAnual;

    const items: Slide[] = [
      {
        kind: "cover",
        eyebrow: "Proposta comercial · Bahia · 2026",
        title: "Uma central de relacionamento inteligente para o Incarmed",
        subtitle: "5 soluções integradas ao PIXEON — atendimento, agendamento e pós-consulta em uma única operação.",
        icon: Sparkles,
      },
      {
        kind: "context",
        eyebrow: "Onde estamos",
        title: "Hoje, ~16 mil mensagens/mês em WhatsApp — sem integração ao PIXEON",
        subtitle: "Cada agendamento, confirmação e recontato depende de trabalho manual. Isso limita crescimento e gera no-show.",
        icon: TrendingUp,
        benefits: [
          { icon: Clock, text: "Tempo do time consumido em tarefas repetitivas" },
          { icon: Users, text: "Pacientes esperando resposta fora do horário comercial" },
          { icon: ShieldCheck, text: "Falta de rastreabilidade e SLA por canal" },
        ],
      },
      {
        kind: "solution",
        eyebrow: "01 · Atendimento",
        title: "Conecta — todos os canais em uma só tela",
        subtitle: "WhatsApp, Instagram, webchat, e-mail e voz unificados. Seus agentes param de trocar de sistema.",
        icon: MessageSquare,
        benefits: [
          { icon: Zap, text: "Atendimento simultâneo, com triagem automática e chatbot" },
          { icon: ShieldCheck, text: "Dashboard em tempo real, avaliação do paciente e SLA por fila" },
          ...(cfg.conectaConfirmadorConsultas
            ? [{ icon: CalendarCheck2, text: "Confirmador de Consultas integrado ao PIXEON já incluso" }]
            : []),
        ],
        accent: `Pacote contratado: ${formatNumber(conecta.mensagens)} msg/mês${
          cfg.conectaConfirmadorConsultas ? " · com Confirmador de Consultas" : ""
        }`,
        price: { label: "Investimento", value: formatBRL(conecta.valorMensal), note: "/mês" },
      },
      {
        kind: "solution",
        eyebrow: "02 · IA por texto",
        title: "Agente Inteligente — atende 24/7 e escala sem contratar mais gente",
        subtitle: "IA generativa que responde, orienta e executa ações simples no PIXEON.",
        icon: Bot,
        benefits: [
          { icon: Clock, text: "Cobertura 24/7 — resolve dúvidas fora do horário comercial" },
          { icon: TrendingUp, text: "Reduz fila do agente humano em até ~70% em rotinas repetitivas" },
          { icon: ShieldCheck, text: "Aprende com a base de conhecimento do próprio Incarmed" },
        ],
        accent: `Plano contratado: ${agente.plano} — ${agente.limites}`,
        price: { label: "Investimento", value: formatBRL(agente.valorMensal), note: "/mês" },
      },
      {
        kind: "solution",
        eyebrow: "03 · Telefonia",
        title: "Flux 3.0 — o PABX que conversa com o resto do ecossistema",
        subtitle: "Ramais IP, call center, gravação, softphone e IA de voz sob a mesma plataforma.",
        icon: PhoneCall,
        benefits: [
          { icon: Users, text: "150 ramais + 25 agentes de call center + 3 supervisores" },
          { icon: ShieldCheck, text: "Gravação 100%, avaliação de atendimento e dashboards" },
          { icon: Zap, text: cfg.fluxModalidade === "cloud"
              ? "Modalidade Cloud — hospedagem gerenciada pela Leucotron"
              : "Modalidade On-Premise — Incarmed mantém autonomia da infra" },
        ],
        accent: flux.nome,
        price: {
          label: cfg.fluxModalidade === "cloud" ? "Investimento" : "Equivalente mensal",
          value: formatBRL(fluxMensal),
          note: cfg.fluxModalidade === "cloud" ? "/mês" : " (licença anual)",
        },
      },
      {
        kind: "solution",
        eyebrow: "04 · IA por voz",
        title: "VoiceBOT — recebe, transfere e resolve chamadas com voz natural",
        subtitle: "IA de voz conectada por SIP ao Flux. Trabalha lado a lado com o call center.",
        icon: Mic,
        benefits: [
          { icon: Zap, text: `${formatNumber(voicebot.creditosIncluidos)} créditos/mês inclusos (parceria ElevenLabs)` },
          { icon: Clock, text: "Boas-vindas, direcionamento, confirmação e triagem sem operador" },
          { icon: HeartHandshake, text: "Reduz no-show com confirmação e reagendamento automáticos" },
        ],
        accent: cfg.voicebotModo === "off"
          ? "Fora desta configuração"
          : cfg.voicebotModo === "mensal"
          ? "3 agentes + 1 número · Contratação mensal"
          : "3 agentes + 1 número · Anual à vista (melhor custo)",
        price: cfg.voicebotModo === "off"
          ? { label: "Status", value: "Opcional", note: "" }
          : { label: "Investimento", value: formatBRL(voiceMensal), note: "/mês" },
      },
      {
        kind: "solution",
        eyebrow: "05 · Integração",
        title: "Sob Medida — o que amarra tudo ao PIXEON",
        subtitle: "Projeto de integração dedicado: agendamento, no-show, VoiceBOT, marketing e check-in financeiro.",
        icon: Wrench,
        benefits: [
          { icon: Check, text: `${cfg.sobMedidaFrentes.length} de ${sobMedidaFrentes.length} frentes contratadas nesta proposta` },
          { icon: ShieldCheck, text: "Middleware próprio da Leucotron consulta o PIXEON e evita disparos duplicados" },
          { icon: TrendingUp, text: "Recuperação automática de faltas e validação pré-chegada" },
        ],
        accent: "Projeto de desenvolvimento sob encomenda — não é produto de prateleira",
        price: { label: "Investimento", value: formatBRL(sobMedida.valorMensal), note: "/mês" },
      },
      {
        kind: "investment",
        eyebrow: "Consolidado",
        title: "O investimento total, sem surpresas",
        subtitle: "Somatório da configuração atual da proposta.",
        icon: TrendingUp,
      },
      {
        kind: "closing",
        eyebrow: "Próximo passo",
        title: "Assine e comece — a Leucotron cuida do resto",
        subtitle: "Kick-off com o time de TI do Incarmed em até 5 dias úteis após aprovação.",
        icon: FileSignature,
      },
    ];
    return items;
  }, [cfg]);

  const total = slides.length;

  const go = useCallback((n: number) => {
    setIdx((cur) => Math.max(0, Math.min(total - 1, cur + n)));
  }, [total]);

  const exit = useCallback(() => {
    void navigate({ to: "/" });
  }, [navigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
      else if (e.key === "Escape") { exit(); }
      else if (e.key === "Home") { setIdx(0); }
      else if (e.key === "End") { setIdx(total - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, exit, total]);

  const slide = slides[idx];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white text-slate-900 print:hidden">
      {/* Barra superior mínima */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-[var(--brand-cyan)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Leucotron × Incarmed
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="tabular-nums">{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          <button
            type="button"
            onClick={exit}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-slate-600 hover:border-slate-300 hover:text-slate-900"
          >
            <X className="h-3.5 w-3.5" /> Sair
          </button>
        </div>
      </div>

      {/* Slide */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-8">
        <SlideView key={idx} slide={slide} />

        {/* Setas laterais */}
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={idx === 0}
          aria-label="Slide anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-3 text-slate-500 shadow-sm transition hover:border-[var(--brand-cyan)] hover:text-[var(--brand-navy)] disabled:opacity-30"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={idx === total - 1}
          aria-label="Próximo slide"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-3 text-slate-500 shadow-sm transition hover:border-[var(--brand-cyan)] hover:text-[var(--brand-navy)] disabled:opacity-30"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots + rodapé */}
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir para slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? "w-8 bg-[var(--brand-cyan)]" : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] text-slate-400">
          ← → para navegar · Esc para sair
        </span>
      </div>
    </div>
  );
}

/** Renderiza um slide individual conforme seu tipo. */
function SlideView({ slide }: { slide: Slide }) {
  if (slide.kind === "investment") return <InvestmentSlide slide={slide} />;
  if (slide.kind === "closing") return <ClosingSlide slide={slide} />;
  return <StandardSlide slide={slide} />;
}

function StandardSlide({ slide }: { slide: Slide }) {
  const Icon = slide.icon ?? Sparkles;
  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[220px_1fr]">
      {/* Pictograma grande */}
      <div className="flex justify-center md:justify-start">
        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-[var(--brand-cyan)]/10 blur-2xl" aria-hidden />
          <div className="relative flex h-40 w-40 items-center justify-center rounded-[2rem] bg-gradient-to-br from-[var(--brand-navy)] to-[#12335C] text-[var(--brand-cyan)] shadow-xl md:h-48 md:w-48">
            <Icon className="h-20 w-20 md:h-24 md:w-24" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <div className="min-w-0">
        {slide.eyebrow && (
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--brand-cyan)]">
            {slide.eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-black leading-[1.1] tracking-tight text-[var(--brand-navy)] md:text-5xl">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
            {slide.subtitle}
          </p>
        )}

        {slide.benefits && slide.benefits.length > 0 && (
          <ul className="mt-8 space-y-3">
            {slide.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[var(--brand-cyan)]/15 text-[var(--brand-navy)]">
                  <b.icon className="h-4 w-4" />
                </span>
                <span className="text-base leading-relaxed text-slate-700 md:text-lg">{b.text}</span>
              </li>
            ))}
          </ul>
        )}

        {(slide.accent || slide.price) && (
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-slate-100 pt-5">
            {slide.accent && (
              <p className="text-xs uppercase tracking-wider text-slate-500">{slide.accent}</p>
            )}
            {slide.price && (
              <p className="text-right text-sm text-slate-500">
                <span className="mr-2 uppercase tracking-wider">{slide.price.label}</span>
                <span className="num-mono text-lg font-bold text-[var(--brand-navy)]">
                  {slide.price.value}
                </span>
                <span className="text-slate-400">{slide.price.note}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InvestmentSlide({ slide }: { slide: Slide }) {
  const cfg = useProposalConfig();
  const conecta = getConectaPacote(cfg);
  const agente = getAgentePlano(cfg);
  const fluxMensal = cfg.fluxModalidade === "cloud"
    ? fluxModalidadeCloud.totalMensal
    : fluxModalidadeOnPremise.equivalenteMensal;
  const voiceMensal = cfg.voicebotModo === "off"
    ? 0
    : cfg.voicebotModo === "mensal" ? voicebot.valorMensal : voicebot.equivalenteMensalNoAnual;

  const linhas = [
    { nome: "Conecta", hint: `${formatNumber(conecta.mensagens)} msg/mês`, valor: conecta.valorMensal, icon: MessageSquare },
    { nome: "Agente Inteligente", hint: `Plano ${agente.plano}`, valor: agente.valorMensal, icon: Bot },
    { nome: "Flux 3.0", hint: cfg.fluxModalidade === "cloud" ? "Cloud" : "On-Premise", valor: fluxMensal, icon: PhoneCall },
    { nome: "VoiceBOT", hint: cfg.voicebotModo === "off" ? "Não incluso" : cfg.voicebotModo === "mensal" ? "Mensal" : "Anual", valor: voiceMensal, icon: Mic },
    { nome: "Sob Medida", hint: `${cfg.sobMedidaFrentes.length}/${sobMedidaFrentes.length} frentes`, valor: sobMedida.valorMensal, icon: Wrench },
  ].filter((l) => l.valor > 0);

  const total = linhas.reduce((s, l) => s + l.valor, 0);

  return (
    <div className="mx-auto w-full max-w-5xl">
      {slide.eyebrow && (
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--brand-cyan)]">
          {slide.eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-black tracking-tight text-[var(--brand-navy)] md:text-5xl">
        {slide.title}
      </h1>
      {slide.subtitle && <p className="mt-3 text-lg text-slate-600">{slide.subtitle}</p>}

      <div className="mt-10 overflow-hidden rounded-2xl border border-slate-100">
        <ul className="divide-y divide-slate-100">
          {linhas.map((l) => (
            <li key={l.nome} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/60">
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[var(--brand-navy)] text-[var(--brand-cyan)]">
                  <l.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--brand-navy)]">{l.nome}</p>
                  <p className="truncate text-xs text-slate-500">{l.hint}</p>
                </div>
              </div>
              <p className="tabular-nums text-slate-700">{formatBRL(l.valor)}<span className="text-xs text-slate-400">/mês</span></p>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Investimento mensal recorrente
            </p>
            <p className="text-xs text-slate-500">Após a fase de ativação inicial</p>
          </div>
          <p className="text-3xl font-black tabular-nums text-[var(--brand-navy)] md:text-4xl">
            {formatBRL(total)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Valores extraídos das propostas comerciais reais — sem letras miúdas.
      </p>
    </div>
  );
}

function ClosingSlide({ slide }: { slide: Slide }) {
  const Icon = slide.icon ?? FileSignature;
  return (
    <div className="mx-auto w-full max-w-4xl text-center">
      <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--brand-navy)] to-[#12335C] text-[var(--brand-cyan)] shadow-xl">
        <Icon className="h-12 w-12" strokeWidth={1.5} />
      </div>
      {slide.eyebrow && (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--brand-cyan)]">
          {slide.eyebrow}
        </p>
      )}
      <h1 className="text-4xl font-black tracking-tight text-[var(--brand-navy)] md:text-5xl">
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">{slide.subtitle}</p>
      )}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/aprovacao"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-navy)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#12335C]"
        >
          <FileSignature className="h-4 w-4" /> Aprovar proposta agora
        </Link>
        <Link
          to="/financeiro"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3.5 text-sm font-semibold text-[var(--brand-navy)] transition hover:border-[var(--brand-cyan)]"
        >
          Ver detalhes financeiros
        </Link>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unused = { conectaPacotesMensagens, agenteInteligentePlanos };
