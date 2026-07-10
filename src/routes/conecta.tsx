import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, CalendarCheck2, Check } from "lucide-react";
import { ProductBanner, CheckList } from "@/components/leucotron/brand";
import {
  conectaPacotesMensagens, conectaTaxaMidia, conectaBIC,
  conectaArmazenamentoAdicional, conectaAtivacaoPremium,
  conectaRecursosIlimitados, conectaDestaques,
} from "@/data/pricing";
import { formatBRL, formatBRLLong, formatNumber } from "@/lib/format";
import { useProposalConfig } from "@/lib/proposal-config";

export const Route = createFileRoute("/conecta")({
  head: () => ({
    meta: [
      { title: "Conecta — Plataforma omnichannel" },
      { name: "description", content: "Pacotes de mensagens, taxa de mídia, BIC e recursos da plataforma Conecta." },
    ],
  }),
  component: ConectaPage,
});

function ConectaPage() {
  const cfg = useProposalConfig();
  const pacoteContratado = cfg.conectaPacoteMensagens;

  return (
    <div>
      <ProductBanner
        eyebrow="Solução 1 de 5"
        title="Conecta · WhatsApp"
        subtitle="Plataforma de atendimento omnichannel centrada em WhatsApp, com redes sociais, webchat, e-mail e voz na mesma tela. Automação, dashboard em tempo real e integrações via API."
        icon={<MessageSquare className="h-7 w-7" />}
      />

      {/* Resumo do que foi selecionado nesta proposta */}
      <div className="mb-5 rounded-xl border border-[var(--signal)]/30 bg-[var(--signal)]/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">Selecionado nesta proposta</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-xs font-semibold text-white">
            <Check className="h-3 w-3" /> Pacote {formatNumber(pacoteContratado)} msg/mês
          </span>
          {cfg.conectaConfirmadorConsultas && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-3 py-1 text-xs font-semibold text-white">
              <CalendarCheck2 className="h-3 w-3" /> Confirmador de Consultas
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Recursos ilimitados incluídos</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <div className="mt-4"><CheckList items={conectaRecursosIlimitados} /></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Destaques funcionais</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <div className="mt-4"><CheckList items={conectaDestaques} /></div>
        </div>
      </div>

      {/* Módulo Confirmador de Consultas — add-on do Conecta. */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-navy)] text-[var(--brand-cyan)]">
            <CalendarCheck2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Confirmador de Consultas</h2>
              {cfg.conectaConfirmadorConsultas ? (
                <span className="rounded-full bg-[var(--signal)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--signal)]">Selecionado nesta proposta</span>
              ) : (
                <span className="rounded-full bg-[var(--paper-ink)]/5 px-2 py-0.5 text-[11px] font-semibold text-[var(--paper-ink)]/60">Opcional, não selecionado</span>
              )}
            </div>
            <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
            <p className="mt-3 text-sm text-muted-foreground">
              Módulo do Conecta que envia HSM automatizado de confirmação de consulta via WhatsApp, coleta a resposta do paciente
              (confirma, remarca ou cancela) e devolve o status ao PIXEON, reduzindo no-show sem operação manual.
            </p>
            <CheckList
              items={[
                "Disparo automatizado de HSM aprovado pela Meta (24h/48h antes da consulta)",
                "Fluxo de resposta: Confirmar · Remarcar · Cancelar",
                "Integração com a agenda do PIXEON via API",
                "Relatório de taxa de confirmação / no-show por período",
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="p-5 pb-2">
          <h2 className="text-base font-semibold text-[var(--brand-navy)]">Pacotes de mensagens (WhatsApp)</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <p className="mt-1 text-xs text-muted-foreground">
            Volume atual do Incarmed cerca de 15 a 16 mil mensagens por mês. Pacote selecionado destacado abaixo.
          </p>
        </div>
        <div className="max-h-[260px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[var(--brand-navy)] text-white">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">Pacote (msg/mês)</th>
                <th className="px-3 py-2 text-right font-semibold">Valor mensal</th>
                <th className="px-3 py-2 text-right font-semibold">Excedente / msg</th>
              </tr>
            </thead>
            <tbody>
              {conectaPacotesMensagens.map((p, i) => {
                const selecionado = p.mensagens === pacoteContratado;
                return (
                  <tr
                    key={p.mensagens}
                    className={
                      selecionado
                        ? "bg-[var(--signal)]/10 font-semibold text-[var(--brand-navy)]"
                        : i % 2 ? "bg-[var(--brand-surface)]" : "bg-white"
                    }
                  >
                    <td className="px-3 py-1.5">
                      {selecionado && <Check className="mr-1 inline h-3 w-3 text-[var(--signal)]" />}
                      {formatNumber(p.mensagens)}
                    </td>
                    <td className="px-3 py-1.5 text-right font-semibold">{formatBRL(p.valorMensal)}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-[11px]">{formatBRLLong(p.valorExcedente)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-6 pb-3">
            <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Taxa adicional de mídia WhatsApp</h2>
            <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
            <p className="mt-2 text-xs text-muted-foreground">
              Cobrada apenas para mídias acima de 5MB, por mensagem, no mês seguinte. Acima de 100MB: não permitido.
            </p>
          </div>
          <div className="max-h-[280px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[var(--brand-navy)] text-white">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Faixa (MB)</th>
                  <th className="px-4 py-2 text-right font-semibold">Valor por msg</th>
                </tr>
              </thead>
              <tbody>
                {conectaTaxaMidia.map((t, i) => (
                  <tr key={t.de} className={i % 2 ? "bg-[var(--brand-surface)]" : "bg-white"}>
                    <td className="px-4 py-2">{t.de}MB → {t.ate}MB</td>
                    <td className="px-4 py-2 text-right font-mono text-xs">{formatBRLLong(t.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="p-6 pb-3">
              <h2 className="text-lg font-semibold text-[var(--brand-navy)]">BIC — Business Initiated Conversation</h2>
              <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
              <p className="mt-2 text-xs text-muted-foreground">Custo por conversa iniciada pela empresa (HSM).</p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-[var(--brand-navy)] text-white">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Tipo</th>
                  <th className="px-4 py-2 text-left font-semibold">Descrição</th>
                  <th className="px-4 py-2 text-right font-semibold">Valor</th>
                </tr>
              </thead>
              <tbody>
                {conectaBIC.map((b, i) => (
                  <tr key={b.tipo} className={i % 2 ? "bg-[var(--brand-surface)]" : "bg-white"}>
                    <td className="px-4 py-2 font-semibold text-[var(--brand-navy)]">{b.tipo}</td>
                    <td className="px-4 py-2 text-muted-foreground">{b.descricao}</td>
                    <td className="px-4 py-2 text-right font-semibold">{formatBRL(b.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Armazenamento adicional</p>
              <p className="mt-2 text-2xl font-bold text-[var(--brand-navy)]">{formatBRL(conectaArmazenamentoAdicional)}<span className="ml-1 text-xs font-normal text-muted-foreground">/GB/mês</span></p>
              <p className="mt-1 text-xs text-muted-foreground">Acima do 1GB incluso</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] p-5 text-white shadow-sm">
              <p className="text-xs uppercase tracking-wider text-[var(--brand-cyan)]">Ativação Premium</p>
              <p className="mt-2 text-2xl font-bold">{formatBRL(conectaAtivacaoPremium)}</p>
              <p className="mt-1 text-xs text-white/70">Taxa única · inclui até 3h de treinamento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
