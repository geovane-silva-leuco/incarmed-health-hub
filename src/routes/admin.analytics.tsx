import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users, MousePointerClick, Clock, TrendingUp, Trash2, Download,
  Activity, MapPin, Monitor, Filter, Database,
} from "lucide-react";
import { readLogs, clearLogs, type ActivityLog } from "@/lib/tracking/store";
import { SectionTitle } from "@/components/leucotron/brand";

/**
 * Dashboard administrativo de analytics.
 *
 * Lê logs do storage local (prototipo cliente-only enquanto o
 * Lovable Cloud não está ativo). Assim que Cloud for ativado,
 * basta substituir `readLogs()` por uma query Supabase — a UI
 * consome logs no mesmo formato.
 *
 * Filtros: período (24h/7d/30d/all), país e nível de engajamento.
 * Funil: Apenas visualizou (1 rota) × Engajamento alto (2+ rotas).
 */
export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics Hub — Admin" },
      { name: "description", content: "Painel administrativo de rastreamento e auditoria de acessos." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AnalyticsPage,
});

type Periodo = "24h" | "7d" | "30d" | "all";
type Engajamento = "todos" | "visualizou" | "alto";

function AnalyticsPage() {
  const [tick, setTick] = useState(0); // força re-render após limpar
  const [periodo, setPeriodo] = useState<Periodo>("7d");
  const [engajamento, setEngajamento] = useState<Engajamento>("todos");
  const [filtroLocal, setFiltroLocal] = useState("");

  const logs = useMemo(() => readLogs(), [tick]);

  // Aplica filtro de período
  const logsPeriodo = useMemo(() => {
    if (periodo === "all") return logs;
    const cortes: Record<Periodo, number> = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };
    const cutoff = Date.now() - cortes[periodo];
    return logs.filter((l) => new Date(l.createdAt).getTime() >= cutoff);
  }, [logs, periodo]);

  // Agrupamento por visitante (para funil e tabela)
  const porVisitor = useMemo(() => {
    const map = new Map<string, ActivityLog[]>();
    for (const l of logsPeriodo) {
      if (!map.has(l.visitorId)) map.set(l.visitorId, []);
      map.get(l.visitorId)!.push(l);
    }
    return map;
  }, [logsPeriodo]);

  // KPIs
  const kpis = useMemo(() => {
    const visitantes = porVisitor.size;
    const pageviews = logsPeriodo.filter((l) => l.eventType === "pageview").length;
    const cliquesCTA = logsPeriodo.filter((l) => l.eventType === "cta" || l.eventType === "click").length;
    const conversao = visitantes ? ((cliquesCTA / visitantes) * 100).toFixed(1) : "0";

    const tempoTotalMs = logsPeriodo
      .filter((l) => l.eventType === "time_on_page")
      .reduce((s, l) => s + (l.durationMs ?? 0), 0);
    const tempoMedioMs = visitantes ? tempoTotalMs / visitantes : 0;

    return { visitantes, pageviews, cliquesCTA, conversao, tempoMedioMs };
  }, [logsPeriodo, porVisitor]);

  // Funil de engajamento
  const funil = useMemo(() => {
    let baixo = 0, alto = 0;
    porVisitor.forEach((evts) => {
      const rotas = new Set(evts.filter((e) => e.eventType === "pageview").map((e) => e.pathname));
      if (rotas.size >= 2) alto++;
      else baixo++;
    });
    return { baixo, alto };
  }, [porVisitor]);

  // Linhas da tabela de auditoria (uma linha por visitante)
  const linhasTabela = useMemo(() => {
    const arr = Array.from(porVisitor.entries()).map(([visitorId, evts]) => {
      const first = evts[0];
      const rotas = new Set(evts.filter((e) => e.eventType === "pageview").map((e) => e.pathname));
      const tempo = evts
        .filter((e) => e.eventType === "time_on_page")
        .reduce((s, e) => s + (e.durationMs ?? 0), 0);
      const ultimo = evts[evts.length - 1];
      const ativo = Date.now() - new Date(ultimo.createdAt).getTime() < 5 * 60 * 1000;
      return {
        visitorId,
        ip: first.ip ?? "—",
        city: first.city ?? "—",
        region: first.region ?? "—",
        country: first.country ?? "—",
        rotas: rotas.size,
        rotasList: [...rotas],
        tempoMs: tempo,
        device: first.uaDevice ?? "—",
        browser: first.uaBrowser ?? "—",
        os: first.uaOs ?? "—",
        ativo,
        engajamento: rotas.size >= 2 ? "alto" : "visualizou",
        createdAt: first.createdAt,
      };
    });
    // filtros extras
    return arr.filter((l) => {
      if (engajamento === "alto" && l.engajamento !== "alto") return false;
      if (engajamento === "visualizou" && l.engajamento !== "visualizou") return false;
      if (filtroLocal) {
        const q = filtroLocal.toLowerCase();
        return (
          l.city.toLowerCase().includes(q) ||
          l.region.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q) ||
          l.ip.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [porVisitor, engajamento, filtroLocal]);

  function exportarCSV() {
    const header = ["visitor_id", "ip", "cidade", "estado", "pais", "rotas_visitadas", "tempo_ms", "device", "browser", "os", "engajamento", "ativo", "primeiro_acesso"];
    const rows = linhasTabela.map((l) => [
      l.visitorId, l.ip, l.city, l.region, l.country, l.rotas, l.tempoMs, l.device, l.browser, l.os, l.engajamento, l.ativo ? "sim" : "não", l.createdAt,
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Admin · Auditoria"
        title="Analytics Hub"
        description="Rastreamento em tempo real de acessos às propostas. Métricas, funil de engajamento e log detalhado por visitante."
      />

      {/* Aviso de storage */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Database className="mt-0.5 h-4 w-4 flex-none text-amber-700" />
        <div className="text-xs text-amber-900">
          <p className="font-semibold">Modo protótipo (cliente-only).</p>
          <p className="mt-0.5">
            Os logs são armazenados no <code>localStorage</code> deste navegador — ative o Lovable Cloud para persistir centralizado e ver acessos de outros visitantes reais. A camada de storage já está isolada em <code>src/lib/tracking/store.ts</code>.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Kpi icon={<Users className="h-4 w-4" />} label="Visitantes únicos" value={String(kpis.visitantes)} />
        <Kpi icon={<Activity className="h-4 w-4" />} label="Pageviews" value={String(kpis.pageviews)} />
        <Kpi icon={<MousePointerClick className="h-4 w-4" />} label="Cliques em CTA" value={String(kpis.cliquesCTA)} />
        <Kpi icon={<TrendingUp className="h-4 w-4" />} label="Conversão" value={`${kpis.conversao}%`} hint="cliques ÷ visitantes" />
      </div>

      {/* Funil + Tempo médio */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm md:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-navy)]">Funil de engajamento</h3>
          <div className="mt-1 h-[2px] w-8 bg-[var(--brand-cyan)]" />
          <div className="mt-4 space-y-3">
            <FunilBar label="Engajamento alto (2+ telas)" valor={funil.alto} total={kpis.visitantes} cor="var(--brand-cyan)" />
            <FunilBar label="Apenas visualizou (1 tela)" valor={funil.baixo} total={kpis.visitantes} cor="#94a3b8" />
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-navy)]">Tempo médio por sessão</h3>
          <div className="mt-1 h-[2px] w-8 bg-[var(--brand-cyan)]" />
          <div className="mt-4 flex items-baseline gap-2">
            <Clock className="h-5 w-5 text-[var(--brand-cyan)]" />
            <span className="text-3xl font-bold text-[var(--brand-navy)]">{formatDuracao(kpis.tempoMedioMs)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">soma de time_on_page ÷ visitantes</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)} className="rounded-md border border-border bg-white px-3 py-1.5 text-sm">
          <option value="24h">Últimas 24h</option>
          <option value="7d">Últimos 7 dias</option>
          <option value="30d">Últimos 30 dias</option>
          <option value="all">Todo o histórico</option>
        </select>
        <select value={engajamento} onChange={(e) => setEngajamento(e.target.value as Engajamento)} className="rounded-md border border-border bg-white px-3 py-1.5 text-sm">
          <option value="todos">Todos os níveis</option>
          <option value="alto">Só engajamento alto</option>
          <option value="visualizou">Só visualizaram</option>
        </select>
        <input
          value={filtroLocal}
          onChange={(e) => setFiltroLocal(e.target.value)}
          placeholder="Filtrar por cidade, estado, país ou IP…"
          className="min-w-[240px] flex-1 rounded-md border border-border bg-white px-3 py-1.5 text-sm"
        />
        <div className="ml-auto flex gap-2">
          <button onClick={exportarCSV} className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-1.5 text-sm font-medium text-[var(--brand-navy)] hover:bg-[var(--brand-surface)]">
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
          <button
            onClick={() => { if (confirm("Apagar todos os logs deste navegador?")) { clearLogs(); setTick((t) => t + 1); } }}
            className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Limpar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--brand-navy)] text-white">
              <tr>
                <Th>Visitante</Th>
                <Th>IP</Th>
                <Th><MapPin className="mr-1 inline h-3 w-3" />Localização</Th>
                <Th>Rotas visitadas</Th>
                <Th>Tempo total</Th>
                <Th><Monitor className="mr-1 inline h-3 w-3" />Dispositivo</Th>
                <Th>Engajamento</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {linhasTabela.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Nenhum log encontrado com os filtros atuais.</td></tr>
              )}
              {linhasTabela.map((l) => (
                <tr key={l.visitorId} className="hover:bg-[var(--brand-surface)]/50">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.visitorId.slice(0, 8)}…</td>
                  <td className="px-4 py-3 font-mono text-xs">{l.ip}</td>
                  <td className="px-4 py-3 text-xs">
                    <div className="font-medium text-[var(--brand-navy)]">{l.city}, {l.region}</div>
                    <div className="text-muted-foreground">{l.country}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[var(--brand-navy)]">{l.rotas}</div>
                    <div className="max-w-[220px] truncate text-[11px] text-muted-foreground">{l.rotasList.join(", ")}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{formatDuracao(l.tempoMs)}</td>
                  <td className="px-4 py-3 text-xs">
                    <div className="font-medium text-[var(--brand-navy)]">{l.device}</div>
                    <div className="text-muted-foreground">{l.browser} · {l.os}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${l.engajamento === "alto" ? "bg-[var(--brand-cyan)]/15 text-[var(--brand-navy)]" : "bg-slate-100 text-slate-600"}`}>
                      {l.engajamento === "alto" ? "Alto" : "Só visualizou"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${l.ativo ? "text-emerald-600" : "text-slate-500"}`}>
                      <span className={`h-2 w-2 rounded-full ${l.ativo ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                      {l.ativo ? "Ativo" : "Saiu"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link to="/" className="underline hover:text-[var(--brand-navy)]">← Voltar ao dashboard</Link>
      </p>
    </div>
  );
}

function Kpi({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-[var(--brand-cyan)]">{icon}<span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span></div>
      <p className="mt-2 text-2xl font-bold text-[var(--brand-navy)]">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function FunilBar({ label, valor, total, cor }: { label: string; valor: number; total: number; cor: string }) {
  const pct = total ? Math.round((valor / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="font-medium text-[var(--brand-navy)]">{label}</span>
        <span className="font-mono text-muted-foreground">{valor} · {pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cor }} />
      </div>
    </div>
  );
}

function formatDuracao(ms: number): string {
  if (!ms || ms < 1000) return "0s";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return `${m}m ${rs}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider">{children}</th>;
}
