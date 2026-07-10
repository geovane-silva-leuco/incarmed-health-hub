import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Componentes de marca — versão redesenhada.
 *
 * O sistema visual agora é sustentado pela tipografia (Inter Tight display,
 * Public Sans corpo, IBM Plex Mono para números) e por um único acento
 * cromático (`--signal`, azul Leucotron). Nada de gradientes, dot-grids ou
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

/**
 * Barra compacta fixa que aparece quando o H1 da seção sai da viewport.
 * Renderizada via portal para escapar do container do conteúdo e ficar
 * ancorada logo abaixo do TopHeader global (h-14).
 */
function StickyTitleBar({ visible, title, theme }: { visible: boolean; title: string; theme: "ink" | "paper" }) {
  const dark = theme === "ink";
  return (
    <div
      aria-hidden={!visible}
      className={`fixed left-0 right-0 top-14 z-10 border-b transition-opacity duration-200 print:hidden ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      } ${
        dark
          ? "border-[var(--surface)] bg-[var(--ink)]/95 text-[var(--paper)]"
          : "border-[var(--line-paper)] bg-[var(--paper)]/95 text-[var(--ink)]"
      } backdrop-blur`}
      style={{ paddingLeft: "var(--main-pl, 0px)", paddingRight: "var(--main-pr, 0px)" }}
    >
      <div className="flex h-10 items-center px-6">
        <span className="font-display text-sm font-semibold tracking-tight">
          {title}
        </span>
      </div>
    </div>
  );
}

function useHeadingVisibility<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export function SectionTitle({
  eyebrow,
  title,
  description,
}: { eyebrow?: string; title: string; description?: string }) {
  const { ref, visible } = useHeadingVisibility<HTMLHeadingElement>();
  return (
    <>
      <StickyTitleBar visible={!visible} title={title} theme="paper" />
      <header className="mb-6 max-w-4xl">
        {eyebrow && (
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">
            {eyebrow}
          </p>
        )}
        <h1 ref={ref} className="font-display text-3xl font-semibold text-[var(--ink)] md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--paper-ink)]/70">
            {description}
          </p>
        )}
      </header>
    </>
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
  const { ref, visible } = useHeadingVisibility<HTMLHeadingElement>();
  return (
    <>
      <StickyTitleBar visible={!visible} title={title} theme="paper" />
      <header className="mb-6 border-b border-[var(--line-paper)] pb-5">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--signal)]">
          {eyebrow}
        </p>
        <h1 ref={ref} className="font-display text-3xl font-semibold text-[var(--ink)] md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--paper-ink)]/70">
            {subtitle}
          </p>
        )}
      </header>
    </>
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
        data-pulse-anchor
        className={`num-mono mt-4 font-semibold ${
          accent ? "text-3xl text-[var(--signal)]" : "text-2xl text-[var(--ink)]"
        }`}
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

/**
 * FeatureCard — padrão único de quadrante para todas as páginas de
 * seção. Barra lateral --signal + ícone + sombra sutil de elevação.
 */
export function FeatureCard({
  icon,
  title,
  children,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-[var(--line-paper)] bg-[var(--card)] p-5 shadow-[0_1px_2px_rgba(14,17,23,0.04),0_8px_20px_-12px_rgba(14,17,23,0.15)] transition-shadow hover:shadow-[0_1px_2px_rgba(14,17,23,0.05),0_14px_28px_-14px_rgba(14,17,23,0.25)] ${className}`}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--signal)]" />
      <div className="flex items-start gap-3">
        {icon && (
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-[var(--signal)]/10 text-[var(--signal)]">
            {icon}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--ink)]">{title}</h3>
          <div className="mt-2 text-sm leading-relaxed text-[var(--paper-ink)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
