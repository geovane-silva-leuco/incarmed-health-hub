import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { ProductBanner, CheckList } from "@/components/leucotron/brand";
import {
  conectaPacotesMensagens, conectaTaxaMidia, conectaBIC,
  conectaArmazenamentoAdicional, conectaAtivacaoPremium,
  conectaRecursosIlimitados, conectaDestaques,
} from "@/data/pricing";
import { formatBRL, formatBRLLong, formatNumber } from "@/lib/format";

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
  return (
    <div>
      <ProductBanner
        eyebrow="Solução 1 de 5"
        title="Conecta"
        subtitle="Plataforma de atendimento omnichannel: WhatsApp, redes sociais, webchat, e-mail, voz — tudo em uma única tela, com automação, dashboard em tempo real e integrações via API."
        icon={<MessageSquare className="h-7 w-7" />}
      />

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

      <div className="mt-6 rounded-xl border border-border bg-card shadow-sm">
        <div className="p-6 pb-3">
          <h2 className="text-lg font-semibold text-[var(--brand-navy)]">Pacotes de mensagens (WhatsApp)</h2>
          <div className="mt-1 h-[3px] w-10 bg-[var(--brand-cyan)]" />
          <p className="mt-2 text-sm text-muted-foreground">
            Volume atual do Incarmed (~15-16k msg/mês) → pacote sugerido: <strong className="text-[var(--brand-navy)]">25.000 mensagens</strong>. Excedente cobrado no mês seguinte.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--brand-navy)] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Pacote (msg/mês)</th>
                <th className="px-4 py-3 text-right font-semibold">Valor mensal</th>
                <th className="px-4 py-3 text-right font-semibold">Excedente (por msg)</th>
              </tr>
            </thead>
            <tbody>
              {conectaPacotesMensagens.map((p, i) => (
                <tr key={p.mensagens} className={i % 2 ? "bg-[var(--brand-surface)]" : "bg-white"}>
                  <td className="px-4 py-2.5">{formatNumber(p.mensagens)}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">{formatBRL(p.valorMensal)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-xs">{formatBRLLong(p.valorExcedente)}</td>
                </tr>
              ))}
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
