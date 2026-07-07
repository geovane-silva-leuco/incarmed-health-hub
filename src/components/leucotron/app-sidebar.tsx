import { Link, useRouterState } from "@tanstack/react-router";
import { LeucotronWordmark } from "./brand";
import { useVisitedRoutes } from "@/hooks/use-visited-routes";
import { navSections, allNavItems } from "./nav-items";

/**
 * Sidebar fixa (sticky) do dashboard executivo.
 * Itens agrupados em seções (Contexto, Soluções, Consolidação, Fechamento)
 * com cabeçalhos visuais que reforçam a jornada da proposta.
 */
export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { isVisited, visited } = useVisitedRoutes();
  const totalVistas = allNavItems.filter((i) => visited.has(i.url)).length;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-none flex-col self-start bg-[var(--brand-navy)] text-white lg:flex print:hidden">
      <div className="border-b border-white/10 px-5 py-5">
        <LeucotronWordmark />
        <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
          Proposta comercial
        </p>
        <p className="text-sm font-semibold text-white">Incarmed</p>
      </div>

      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section) => (
          <div key={section.id} className="mb-4 last:mb-0">
            <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--brand-cyan)]/80">
              {section.label}
            </p>
            {section.items.map((it) => {
              const active = pathname === it.url;
              const seen = isVisited(it.url);
              return (
                <Link
                  key={it.url}
                  to={it.url}
                  aria-current={active ? "page" : undefined}
                  className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)] ${
                    active
                      ? "bg-[var(--brand-cyan)]/15 text-white shadow-[inset_3px_0_0_0_var(--brand-cyan)]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <it.icon
                    className={`h-4 w-4 ${active ? "text-[var(--brand-cyan)]" : ""}`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate">{it.title}</span>
                  <span
                    aria-hidden="true"
                    title={seen ? "Já visitado nesta sessão" : "Ainda não visitado"}
                    className={`text-[10px] leading-none ${
                      seen ? "text-[var(--brand-cyan)]" : "text-white/25"
                    }`}
                  >
                    {seen ? "●" : "○"}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-3 text-[11px] text-white/50">
        <p className="font-semibold text-white/80">
          {totalVistas} de {allNavItems.length} seções vistas
        </p>
        <p className="mt-0.5 text-white/40">Dashboard executivo · Uso interno</p>
      </div>
    </aside>
  );
}
