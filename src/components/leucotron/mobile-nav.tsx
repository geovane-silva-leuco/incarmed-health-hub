import { Link, useRouterState } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LeucotronWordmark } from "./brand";
import { useVisitedRoutes } from "@/hooks/use-visited-routes";
import { navSections } from "./nav-items";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { isVisited } = useVisitedRoutes();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menu de navegação"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-[var(--brand-navy)] hover:bg-[var(--brand-navy)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-cyan)] lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-0 bg-[var(--brand-navy)] p-0 text-white">
        <SheetHeader className="border-b border-white/10 px-5 py-5 text-left">
          <SheetTitle asChild>
            <div>
              <LeucotronWordmark />
              <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
                Proposta comercial
              </p>
              <p className="text-sm font-semibold text-white">Incarmed</p>
            </div>
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Navegação principal (mobile)" className="px-3 py-4">
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
                    onClick={() => setOpen(false)}
                    className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
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
      </SheetContent>
    </Sheet>
  );
}
