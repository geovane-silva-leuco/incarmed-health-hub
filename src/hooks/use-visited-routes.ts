import { useEffect, useState, useCallback } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Zeigarnik tracker: registra as rotas já visitadas na sessão atual.
 *
 * A cada mudança de rota, o pathname corrente é gravado em `sessionStorage`
 * (chave `incarmed:visited`). O hook expõe:
 *   - `visited`: Set<string> com todas as rotas já vistas
 *   - `isVisited(path)`: helper para consulta rápida
 *
 * Usado pelo `AppSidebar` para exibir um indicador ● / ○ ao lado de cada
 * item do menu — cria uma "tarefa incompleta" visual que estimula o
 * apresentador (e o cliente) a percorrer todas as seções na reunião.
 *
 * Client-only por natureza (usa `sessionStorage`); durante SSR o Set
 * inicial é vazio e é hidratado em `useEffect`.
 */
const STORAGE_KEY = "incarmed:visited";

export function useVisitedRoutes() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [visited, setVisited] = useState<Set<string>>(() => new Set());

  // Hidrata do sessionStorage após montar (evita mismatch SSR).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setVisited(new Set(JSON.parse(raw) as string[]));
    } catch {
      // sessionStorage indisponível (SSR / modo privado): ignora.
    }
  }, []);

  // Registra o pathname atual toda vez que muda.
  useEffect(() => {
    setVisited((prev) => {
      if (prev.has(pathname)) return prev;
      const next = new Set(prev);
      next.add(pathname);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* noop */
      }
      return next;
    });
  }, [pathname]);

  const isVisited = useCallback((path: string) => visited.has(path), [visited]);

  return { visited, isVisited };
}
