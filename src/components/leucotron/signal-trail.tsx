import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { navSections } from "./nav-items";

/**
 * SignalTrail — elemento de assinatura + navegação lateral.
 *
 * Substitui a sidebar padrão de admin por uma trilha fina vertical na
 * lateral esquerda (desktop). Cada ponto representa uma seção da proposta;
 * o ponto ativo é destacado em --signal. A linha pulsa como uma onda de
 * áudio ao trocar de seção, referenciando "chamada conectada" — metáfora
 * literal do produto vendido (comunicação unificada).
 *
 * Em mobile vira uma barra de progresso horizontal fina no topo.
 */

type FlatItem = { title: string; url: string; sectionLabel: string };

const flat: FlatItem[] = navSections.flatMap((s) =>
  s.items.map((it) => ({ title: it.title, url: it.url, sectionLabel: s.label })),
);

export function SignalTrail() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [pulseKey, setPulseKey] = useState(0);
  const prevPath = useRef(path);
  const activeIdx = Math.max(0, flat.findIndex((i) => i.url === path));

  useEffect(() => {
    if (prevPath.current !== path) {
      prevPath.current = path;
      setPulseKey((k) => k + 1);
    }
  }, [path]);

  return (
    <>
      {/* Desktop: trilha vertical fixa ------------------------------------ */}
      <nav
        aria-label="Navegação da proposta"
        className="fixed top-0 z-30 hidden h-dvh w-[220px] flex-col justify-between border-r border-[var(--line-paper)] bg-[var(--paper)] px-6 py-8 lg:flex print:hidden"
        style={{ left: "var(--shell-offset, 0px)" }}
      >

        <Link to="/" className="group inline-flex items-baseline gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-[var(--ink)]">
            Leucotron
          </span>
          <span className="h-1 w-1 rounded-full bg-[var(--signal)]" />
        </Link>

        <ol className="relative my-8 flex-1 pl-6">
          {/* linha vertical de "sinal" */}
          <span
            aria-hidden
            className="absolute left-[7px] top-2 bottom-2 w-px origin-center bg-[var(--paper-ink)]/15"
          />
          {/* pulso — reinicia a cada troca de rota */}
          <span
            key={pulseKey}
            aria-hidden
            className="signal-pulse absolute left-[6px] top-2 bottom-2 w-[3px] origin-center bg-[var(--signal)]"
            style={{ opacity: 0.35 }}
          />
          {flat.map((item, i) => {
            const active = i === activeIdx;
            return (
              <li key={item.url} className="relative mb-3.5 last:mb-0">
                <span
                  aria-hidden
                  className={`absolute -left-6 top-1.5 h-2 w-2 rounded-full border transition-all ${
                    active
                      ? "border-[var(--signal)] bg-[var(--signal)] shadow-[0_0_0_4px_rgba(201,128,62,0.14)]"
                      : "border-[var(--paper-ink)]/25 bg-[var(--paper)]"
                  }`}
                />
                <Link
                  to={item.url}
                  className={`block truncate text-[13px] leading-snug transition-colors ${
                    active
                      ? "font-semibold text-[var(--ink)]"
                      : "text-[var(--paper-ink)]/55 hover:text-[var(--ink)]"
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ol>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--paper-ink)]/45">
          Proposta · 2026
        </p>
      </nav>

      {/* Mobile: barra de progresso horizontal fina no topo ---------------- */}
      <div className="fixed inset-x-0 top-0 z-30 h-[3px] bg-[var(--paper-ink)]/10 lg:hidden print:hidden">
        <div
          className="h-full bg-[var(--signal)] transition-all duration-500 ease-out"
          style={{ width: `${((activeIdx + 1) / flat.length) * 100}%` }}
        />
      </div>
    </>
  );
}
