import type { ReactNode } from "react";

export function LeucotronWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-baseline gap-2 ${className}`}>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight text-white">Leucotron</span>
        <span className="mt-1 h-[3px] w-8 bg-[var(--brand-cyan)]" />
      </div>
      <span className="ml-1 text-[10px] font-semibold tracking-[0.2em] text-[var(--brand-cyan)]">TECH</span>
    </div>
  );
}

export function DotGrid({
  rows = 4,
  cols = 5,
  className = "",
}: { rows?: number; cols?: number; className?: string }) {
  return (
    <div className={`grid gap-1.5 ${className}`} style={{ gridTemplateColumns: `repeat(${cols}, 4px)` }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <span key={i} className="h-1 w-1 rounded-full bg-[var(--brand-cyan)]/70" />
      ))}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-cyan)]">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-bold tracking-tight text-[var(--brand-navy)]">{title}</h1>
      <div className="mt-3 h-[3px] w-16 bg-[var(--brand-cyan)]" />
      {description && <p className="mt-4 max-w-3xl text-base text-muted-foreground">{description}</p>}
    </div>
  );
}

export function ProductBanner({
  eyebrow,
  title,
  subtitle,
  icon,
}: { eyebrow: string; title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--brand-navy)] via-[var(--brand-navy-2)] to-[#0b2a5e] px-8 py-10 text-white shadow-lg">
      <DotGrid rows={5} cols={6} className="absolute right-6 top-6 opacity-70" />
      <DotGrid rows={4} cols={4} className="absolute bottom-4 left-4 opacity-40" />
      <div className="relative flex items-start gap-5">
        {icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 text-[var(--brand-cyan)] backdrop-blur">
            {icon}
          </div>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-cyan)]">{eyebrow}</p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 max-w-2xl text-white/80">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
          <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--brand-cyan)]/15 text-[var(--brand-cyan)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${
        accent
          ? "border-transparent bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-navy-2)] text-white"
          : "border-border bg-card"
      }`}
    >
      <p className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-[var(--brand-cyan)]" : "text-muted-foreground"}`}>
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold tracking-tight ${accent ? "text-white" : "text-[var(--brand-navy)]"}`}>
        {value}
      </p>
      {hint && <p className={`mt-1 text-xs ${accent ? "text-white/70" : "text-muted-foreground"}`}>{hint}</p>}
    </div>
  );
}
