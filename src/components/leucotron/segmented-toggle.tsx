import type { ReactNode } from "react";

/**
 * Toggle segmentado acessível (usado em Flux 3.0 e Financeiro Consolidado).
 *
 * A11y: cada opção é um `<button>` com `aria-pressed` refletindo o estado —
 * leitores de tela anunciam "pressionado / não pressionado" ao invés de
 * depender só de cor.
 *
 * @template T Tipo (string literal) das chaves das opções.
 */
export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
}

interface SegmentedToggleProps<T extends string> {
  /** Rótulo acessível do grupo (ex.: "Modalidade do Flux 3.0"). */
  ariaLabel: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly SegmentedOption<T>[];
  /** Densidade do controle. `sm` combina com o painel de simulação do Financeiro. */
  size?: "sm" | "md";
}

export function SegmentedToggle<T extends string>({
  ariaLabel,
  value,
  onChange,
  options,
  size = "md",
}: SegmentedToggleProps<T>) {
  const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex rounded-lg border border-border bg-white p-1 shadow-sm"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={`rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)] ${pad} ${
              active
                ? "bg-[var(--brand-navy)] text-white"
                : "text-muted-foreground hover:text-[var(--brand-navy)]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
