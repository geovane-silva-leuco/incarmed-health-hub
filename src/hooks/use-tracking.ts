import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  appendLog,
  detectUA,
  fetchGeo,
  getSessionId,
  getVisitorId,
} from "@/lib/tracking/store";

/**
 * Hook global de tracking.
 *
 * Registra automaticamente:
 *  - pageview a cada mudança de rota (com IP/geo/UA/referrer)
 *  - time_on_page ao sair da página (evento anterior)
 *  - eventos manuais via `window.__track(label, type)` (usado nos CTAs)
 *
 * Montar UMA vez, na raiz da árvore (`__root.tsx`).
 * Não bloqueia a UI — fetch de geo é lazy, com cache de sessão.
 */
export function useTracking() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const prevPathRef = useRef<string | null>(null);
  const enteredAtRef = useRef<number>(Date.now());
  const geoRef = useRef<Awaited<ReturnType<typeof fetchGeo>> | null>(null);
  const uaRef = useRef<ReturnType<typeof detectUA> | null>(null);

  // Boot: busca geo + detecta UA (uma vez por sessão).
  useEffect(() => {
    uaRef.current = detectUA(navigator.userAgent);
    fetchGeo().then((g) => {
      geoRef.current = g;
    });

    // API global para tracking manual de cliques/CTAs.
    (window as unknown as { __track?: (label: string, type?: "click" | "download" | "cta") => void }).__track = (
      label,
      type = "click",
    ) => {
      appendLog({
        sessionId: getSessionId(),
        visitorId: getVisitorId(),
        eventType: type,
        pathname: window.location.pathname,
        label,
        ...(geoRef.current ?? {}),
        uaBrowser: uaRef.current?.browser,
        uaOs: uaRef.current?.os,
        uaDevice: uaRef.current?.device,
        referrer: document.referrer || undefined,
      });
    };

    // Ao sair da aba, grava o tempo final da página corrente.
    const onUnload = () => {
      if (prevPathRef.current) {
        appendLog({
          sessionId: getSessionId(),
          visitorId: getVisitorId(),
          eventType: "time_on_page",
          pathname: prevPathRef.current,
          durationMs: Date.now() - enteredAtRef.current,
          ...(geoRef.current ?? {}),
          uaBrowser: uaRef.current?.browser,
          uaOs: uaRef.current?.os,
          uaDevice: uaRef.current?.device,
        });
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, []);

  // A cada mudança de rota: fecha time_on_page anterior + abre pageview novo.
  useEffect(() => {
    const now = Date.now();
    if (prevPathRef.current && prevPathRef.current !== pathname) {
      appendLog({
        sessionId: getSessionId(),
        visitorId: getVisitorId(),
        eventType: "time_on_page",
        pathname: prevPathRef.current,
        durationMs: now - enteredAtRef.current,
        ...(geoRef.current ?? {}),
        uaBrowser: uaRef.current?.browser,
        uaOs: uaRef.current?.os,
        uaDevice: uaRef.current?.device,
      });
    }
    appendLog({
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      eventType: "pageview",
      pathname,
      ...(geoRef.current ?? {}),
      uaBrowser: uaRef.current?.browser,
      uaOs: uaRef.current?.os,
      uaDevice: uaRef.current?.device,
      referrer: document.referrer || undefined,
    });
    prevPathRef.current = pathname;
    enteredAtRef.current = now;
  }, [pathname]);
}
