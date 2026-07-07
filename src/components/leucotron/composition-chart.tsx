import { lazy, Suspense, useMemo } from "react";
import { formatBRL } from "@/lib/format";

/**
 * Gráfico de composição financeira — carregado sob demanda para tirar
 * o Recharts (~90KB) do bundle inicial da Home. O `lazy()` só resolve
 * no browser, e o `Suspense` mostra um esqueleto navy enquanto carrega.
 */
const RechartsPie = lazy(() => import("./composition-pie-chart"));

export interface CompositionSlice {
  name: string;
  value: number;
}

export function CompositionChart({ data }: { data: CompositionSlice[] }) {
  // Memoização evita recriação de referência a cada render do pai.
  const memo = useMemo(() => data, [data]);
  return (
    <div className="h-[320px]">
      <Suspense
        fallback={
          <div
            role="status"
            aria-label="Carregando gráfico de composição"
            className="flex h-full items-center justify-center text-xs text-muted-foreground"
          >
            <span className="mr-2 inline-block h-3 w-3 animate-pulse rounded-full bg-[var(--brand-cyan)]" />
            Carregando gráfico…
          </div>
        }
      >
        <RechartsPie data={memo} formatBRL={formatBRL} />
      </Suspense>
    </div>
  );
}
