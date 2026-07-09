import { Link } from "@tanstack/react-router";
import { PlayCircle } from "lucide-react";

/**
 * TopBar — barra superior mínima. Substitui o topbar de admin.
 * Wordmark discreto + 1 único CTA persistente ("Apresentar ao cliente").
 * Fica sólido sobre --paper; sem sombra, sem gradiente.
 */
export function TopHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--line-paper)] bg-[var(--paper)]/85 px-6 backdrop-blur print:hidden">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--paper-ink)]/55">
          Proposta · Incarmed × Leucotron
        </span>
      </div>
      <Link
        to="/apresentar"
        className="signal-ring-hover relative inline-flex items-center gap-2 rounded-md bg-[var(--ink)] px-3.5 py-1.5 text-[12px] font-semibold text-[var(--paper)] transition hover:bg-[var(--surface)]"
      >
        <PlayCircle className="h-3.5 w-3.5 text-[var(--signal)]" />
        Apresentar ao cliente
      </Link>
    </header>
  );
}
