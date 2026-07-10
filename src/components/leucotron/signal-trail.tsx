import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { navSections } from "./nav-items";

/**
 * SignalTrail — elemento de assinatura + navegação lateral.
 *
 * Trilha vertical fina na lateral (desktop). Cada ponto é uma seção da
 * proposta; o ativo destaca em --signal. A linha "pulsa" como onda de
 * áudio nos gatilhos:
 *   1. troca de rota
 *   2. quando um elemento com [data-pulse-anchor] entra em ~50% da viewport
 *      (números-chave, R$ em destaque, células financeiras).
 *
 * Em mobile vira uma barra de progresso horizontal fina no topo — cada
 * segmento é clicável e navega para a rota correspondente.
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

  // Trigger único: incrementa a chave -> React remonta o <span> e a
  // animação signal-pulse reinicia. Reusado por route-change e IO.
  const firePulse = useCallback(() => {
    setPulseKey((k) => k + 1);
  }, []);

  // 1) Pulso na troca de rota.
  useEffect(() => {
    if (prevPath.current !== path) {
      prevPath.current = path;
      firePulse();
    }
  }, [path, firePulse]);

  // 2) Pulso quando âncoras entram em viewport (~50%).
  //    Re-escaneia a cada troca de rota (novos nós montados).
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    // Espera montagem dos nós da nova rota.
    const timeoutId = window.setTimeout(() => {
      const seen = new WeakSet<Element>();
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && !seen.has(e.target)) {
              seen.add(e.target);
              firePulse();
            }
          }
        },
        { threshold: 0.5 },
      );
      document.querySelectorAll<HTMLElement>("[data-pulse-anchor]").forEach((el) => {
        io.observe(el);
      });
      // guarda em ref para cleanup
      cleanupRef.current = () => io.disconnect();
    }, 60);

    const cleanupRef = { current: () => {} };
    return () => {
      window.clearTimeout(timeoutId);
      cleanupRef.current();
    };
  }, [path, firePulse]);

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
          {/* pulso — reinicia a cada troca de rota ou entrada de âncora */}
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

      {/* Mobile: barra de progresso segmentada e clicável ------------------ */}
      <nav
        aria-label="Navegação da proposta (mobile)"
        className="fixed inset-x-0 top-0 z-30 flex h-[6px] w-full gap-[2px] bg-transparent lg:hidden print:hidden"
      >
        {flat.map((item, i) => {
          const active = i === activeIdx;
          const passed = i < activeIdx;
          return (
            <Link
              key={item.url}
              to={item.url}
              aria-label={item.title}
              aria-current={active ? "page" : undefined}
              className="group relative h-full flex-1 py-[2px]"
            >
              <span
                className={`block h-full w-full transition-colors ${
                  active
                    ? "bg-[var(--signal)]"
                    : passed
                      ? "bg-[var(--signal)]/60"
                      : "bg-[var(--paper-ink)]/12 group-hover:bg-[var(--paper-ink)]/25"
                }`}
              />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
