import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarCheck2 } from "lucide-react";

/**
 * CTA persistente (canto inferior direito).
 *
 * Growth Hacking / Fogg B=MAP: mantém o próximo passo comercial —
 * "Agendar kick-off com TI" — visível em todas as páginas exceto na
 * Home (onde a chamada primária já vive no dashboard). Reduz o atrito
 * de o apresentador precisar navegar até `/oportunidade` para lembrar
 * o próximo passo.
 *
 * A11y: link semântico (`<Link>`), rótulo textual visível + `aria-label`
 * explícito. Ocultado ao imprimir (PDF da proposta não deve ter CTA).
 */
export function FloatingCTA() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  // Não polui a home nem a própria página de oportunidade.
  if (pathname === "/" || pathname === "/oportunidade") return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-end px-4 print:hidden lg:px-6">
      <Link
        to="/oportunidade"
        aria-label="Ir para a página da oportunidade e agendar kick-off com o TI"
        onClick={() => (window as unknown as { __track?: (l: string, t?: string) => void }).__track?.("floating_cta_kickoff", "cta")}
        className="pointer-events-auto group inline-flex items-center gap-2 rounded-full bg-[var(--brand-cyan)] px-5 py-3 text-sm font-bold text-[var(--brand-navy)] shadow-lg shadow-[var(--brand-navy)]/25 ring-1 ring-[var(--brand-navy)]/10 transition-all hover:-translate-y-0.5 hover:bg-[var(--brand-cyan-hi)] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-navy)] focus-visible:ring-offset-2"
      >
        <CalendarCheck2 className="h-4 w-4" aria-hidden="true" />
        <span>Agendar kick-off com TI</span>
        <span aria-hidden="true" className="text-base leading-none transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}
