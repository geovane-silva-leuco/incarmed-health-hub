import { createFileRoute } from "@tanstack/react-router";
import { Mic, PhoneCall } from "lucide-react";
import { ProductBanner, StatCard, CheckList } from "@/components/leucotron/brand";
import { voicebot, voicebotModulos, voicebotCasosDeUso } from "@/data/pricing";
import { formatBRL, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/voicebot")({
  head: () => ({
    meta: [
      { title: "VoiceBOT — Atendimento por voz com IA" },
      { name: "description", content: "Créditos, módulos e casos de uso do VoiceBOT Leucotron." },
    ],
  }),
  component: VoiceBotPage,
});

function VoiceBotPage() {
  return (
    <div>
      <ProductBanner
        eyebrow="Solução 4 de 5"
        title="VoiceBOT"
        subtitle="Atendimento automatizado por voz com IA generativa. Opera junto ao PABX existente via SIP, com voz natural (ElevenLabs), RAG e integrações via API."
        icon={<Mic className="h-7 w-7" />}
      />

      <div className="mb-6 rounded-xl border border-[var(--brand-cyan)]/40 bg-[var(--brand-cyan)]/5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-md">
            <p className="text-sm font-semibold text-[var(--brand-navy)]">Demonstração ao vivo do VoiceBOT</p>
            <p className="text-xs text-muted-foreground">Fale agora com um agente de voz real — sem instalar nada.</p>
          </div>
          <a
            href="https://clicktocall.leucotron.com.br/clicktocall/vendas-leucotron/ligar?token=90aac52d33b38d9517193a63f2c73037"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-navy)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)]"
          >
            <PhoneCall className="h-5 w-5" aria-hidden="true" />
            Ligue agora
          </a>
        </div>

        <div className="mt-4 rounded-lg border border-[var(--brand-cyan)]/30 bg-white p-4">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--brand-navy)]">
            Como testar em 2 passos
          </p>
          <ol className="space-y-2.5 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[var(--brand-navy)] text-xs font-bold text-white">1</span>
              <span>Ao ligar, escolha a <strong>opção 1</strong> no menu.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[var(--brand-navy)] text-xs font-bold text-white">2</span>
              <span>Quando o <strong>Thomaz</strong> (nosso atendente de IA) atender, diga: <em>"quero marcar uma consulta"</em>.</span>
            </li>
          </ol>
        </div>
      </div>


      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Mensal recorrente" value={formatBRL(voicebot.valorMensal)} hint="Inclui plataforma + 1 agente + 1 número" accent />
        <StatCard label="Anual à vista" value={formatBRL(voicebot.anualAVista)} hint={`Equivalente mensal: ${formatBRL(voicebot.equivalenteMensalNoAnual)}`} />
        <StatCard label="Créditos incluídos" value={`${formatNumber(voicebot.creditosIncluidos)}`} hint="≈ 1.500 minutos/mês (referência)" />
        <StatCard label="Excedente" value={`${formatBRL(voicebot.valorExcedentePor1000Creditos)}`} hint="a cada 1.000 créditos" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Configuração inclusa</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">Agentes e número de atendimento</dt>
              <dd className="font-semibold text-[var(--brand-navy)]">{voicebot.agentesNumeroAtendimento}</dd>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">Suporte</dt>
              <dd className="font-semibold text-[var(--brand-navy)]">{voicebot.suporte}</dd>
            </div>
            <div className="flex justify-between border-b border-border/60 pb-2">
              <dt className="text-muted-foreground">Ativação plataforma + 1 agente</dt>
              <dd className="font-semibold text-[var(--brand-navy)]">{voicebot.ativacaoPlataformaMais1Agente}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Ativação de agente extra</dt>
              <dd className="font-semibold text-[var(--brand-navy)]">{voicebot.ativacaoAgenteExtra}</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-lg bg-[var(--brand-cyan)]/5 p-3 text-xs italic text-foreground">
            O VoiceBOT mede uso em <strong>créditos</strong>, não em minutos — minutos são apenas referência aproximada.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Módulos e integrações</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <div className="mt-4"><CheckList items={voicebotModulos} /></div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Casos de uso aplicáveis ao Incarmed</h2>
        <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {voicebotCasosDeUso.map((c) => (
            <div key={c.area} className="rounded-lg border border-border bg-[var(--brand-surface)] p-4">
              <p className="text-sm font-semibold text-[var(--brand-navy)]">{c.area}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
