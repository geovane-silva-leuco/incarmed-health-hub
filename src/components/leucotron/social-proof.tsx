import { ShieldCheck } from "lucide-react";
import { oportunidade } from "@/data/oportunidade";

/**
 * Faixa de prova social — Padrão F de leitura (topo, primeiro elemento
 * abaixo do H1). Renderiza as referências de mercado citadas na proposta
 * para disparar viés de autoridade **antes** de o decisor ver o preço.
 *
 * Fonte de dados: `src/data/oportunidade.ts → referencias`.
 * Não recebe props — se as referências mudarem, atualize o data source.
 */
export function SocialProofStrip() {
  const refs = oportunidade.referencias;
  return (
    <section
      aria-label="Referências de mercado que já operam com Leucotron"
      className="mb-8 overflow-hidden rounded-xl border border-[var(--brand-navy)]/10 bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-navy-2)] px-6 py-4 text-white shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--brand-cyan)]/15 text-[var(--brand-cyan)]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brand-cyan)]">
              Já operam com Leucotron
            </p>
            <p className="text-sm font-semibold">
              Referências citadas na reunião de descoberta
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap items-center gap-2">
          {refs.map((r) => (
            <li
              key={r}
              className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur"
            >
              {r}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
