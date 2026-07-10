import { createFileRoute } from "@tanstack/react-router";
import { Mic, PhoneCall, Zap, Cpu, HeadphonesIcon } from "lucide-react";
import { ProductBanner, StatCard, FeatureCard } from "@/components/leucotron/brand";
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

      <div className="mb-6 rounded-xl border border-[var(--line-paper)] bg-[var(--card)] p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">Demonstração ao vivo</p>
            <p className="text-xs text-[var(--paper-ink)]/60">Fale agora com um agente de voz real, sem instalar nada.</p>
          </div>
          <a
            href="https://clicktocall.leucotron.com.br/clicktocall/vendas-leucotron/ligar?token=90aac52d33b38d9517193a63f2c73037"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
          >
            <PhoneCall className="h-4 w-4" />
            Ligue agora
          </a>
        </div>
        <ol className="mt-3 grid grid-cols-1 gap-2 text-xs text-[var(--paper-ink)]/80 sm:grid-cols-2">
          <li><strong>1.</strong> Ao ligar, escolha a <strong>opção 1</strong> no menu.</li>
          <li><strong>2.</strong> Quando o <strong>Thomaz</strong> atender, diga <em>"quero marcar uma consulta"</em>.</li>
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Mensal recorrente" value={formatBRL(voicebot.valorMensal)} hint="Plataforma, 1 agente e 1 número" accent />
        <StatCard label="Anual à vista" value={formatBRL(voicebot.anualAVista)} hint={`Equivalente mensal ${formatBRL(voicebot.equivalenteMensalNoAnual)}`} />
        <StatCard label="Créditos inclusos" value={formatNumber(voicebot.creditosIncluidos)} hint="≈ 1.500 minutos por mês (referência)" />
        <StatCard label="Excedente" value={formatBRL(voicebot.valorExcedentePor1000Creditos)} hint="a cada 1.000 créditos" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FeatureCard icon={<Cpu className="h-4 w-4" />} title="Configuração inclusa">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-[var(--line-paper)] pb-1.5">
              <dt className="text-[var(--paper-ink)]/60">Agentes e número de atendimento</dt>
              <dd className="font-semibold text-[var(--ink)]">{voicebot.agentesNumeroAtendimento}</dd>
            </div>
            <div className="flex justify-between border-b border-[var(--line-paper)] pb-1.5">
              <dt className="text-[var(--paper-ink)]/60">Suporte</dt>
              <dd className="font-semibold text-[var(--ink)]">{voicebot.suporte}</dd>
            </div>
            <div className="flex justify-between border-b border-[var(--line-paper)] pb-1.5">
              <dt className="text-[var(--paper-ink)]/60">Ativação plataforma + 1 agente</dt>
              <dd className="font-semibold text-[var(--ink)]">{voicebot.ativacaoPlataformaMais1Agente}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--paper-ink)]/60">Ativação de agente extra</dt>
              <dd className="font-semibold text-[var(--ink)]">{voicebot.ativacaoAgenteExtra}</dd>
            </div>
          </dl>
          <p className="mt-3 rounded-md bg-[var(--signal)]/5 p-2 text-[12px] italic">
            O VoiceBOT mede uso em <strong>créditos</strong>, não em minutos. Minutos são apenas referência.
          </p>
        </FeatureCard>

        <FeatureCard icon={<Zap className="h-4 w-4" />} title="Módulos e integrações">
          <ul className="space-y-1.5 text-sm">
            {voicebotModulos.map((m, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 flex-none rounded-full bg-[var(--signal)]" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </FeatureCard>
      </div>

      <div className="mt-6">
        <FeatureCard icon={<HeadphonesIcon className="h-4 w-4" />} title="Casos de uso aplicáveis ao Incarmed">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {voicebotCasosDeUso.map((c) => (
              <div key={c.area} className="rounded-md border border-[var(--line-paper)] bg-[var(--paper)] p-3">
                <p className="text-sm font-semibold text-[var(--ink)]">{c.area}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--paper-ink)]/70">{c.desc}</p>
              </div>
            ))}
          </div>
        </FeatureCard>
      </div>
    </div>
  );
}
