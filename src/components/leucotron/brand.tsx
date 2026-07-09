import type { ReactNode } from "react";

/**
 * Componentes de marca — versão redesenhada.
 *
 * O sistema visual agora é sustentado pela tipografia (Inter Tight display,
 * Public Sans corpo, IBM Plex Mono para números) e por um único acento
 * cromático (`--signal`, âmbar-cobre). Nada de gradientes, dot-grids ou
 * banners decorativos.
 */

export function LeucotronWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-display text-lg font-bold tracking-tight text-[var(--paper)]">
        Leucotron
      </span>
      <span className="h-1 w-1 rounded-full bg-[var(--signal)]" />
    </span>
  );
}

/** Mantido apenas por compatibilidade; renderiza nada. Não usar em novos layouts. */
export function DotGrid(_: { rows?: number; cols?: number; className?: string }) {
  return null;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: { eyebrow?: string; title: string; description?: string }) {
  return (
    <header className="mb-10 max-w-4xl">
      {eyebrow && (
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-4xl font-semibold text-[var(--ink)] md:text-5xl">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--paper-ink)]/70 md:text-[17px]">
          {description}
        </p>
      )}
    </header>
  );
}

/**
 * ProductBanner — versão redesenhada: sem gradiente, sem grade de pontos.
 * Apenas hierarquia tipográfica com um único acento de sinal.
 */
export function ProductBanner({
  eyebrow,
  title,
  subtitle,
  icon: _icon,
}: { eyebrow: string; title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <header className="mb-12 border-b border-[var(--line-paper)] pb-10">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">
        {eyebrow}
      </p>
      <h1 className="font-display text-4xl font-semibold text-[var(--ink)] md:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--paper-ink)]/70">
          {subtitle}
        </p>
      )}
    </header>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 border-l border-[var(--line-paper)] pl-5">
      {items.map((it, i) => (
        <li
          key={i}
          className="text-[15px] leading-relaxed text-[var(--paper-ink)]"
        >
          {it}
        </li>
      ))}
    </ul>
  );
}

/**
 * StatCard — cartão de dado.  Números em mono tabular; sem gradiente.
 * `accent` promove o número a --signal.
 */
export function StatCard({
  label,
  value,
  hint,
  accent,
}: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className="border border-[var(--line-paper)] bg-[var(--card)] p-6 rounded-lg">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--paper-ink)]/55">
        {label}
      </p>
      <p
        className={`mt-4 font-display font-semibold tabular-nums ${
          accent ? "text-3xl text-[var(--signal)]" : "text-2xl text-[var(--ink)]"
        }`}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </p>
      {hint && (
        <p className="mt-2 text-[12px] leading-snug text-[var(--paper-ink)]/60">
          {hint}
        </p>
      )}
    </div>
  );
}
