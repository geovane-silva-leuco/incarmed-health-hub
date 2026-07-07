import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Cabeçalho superior — sticky. A sidebar principal agora fica visível
 * em todos os tamanhos de tela, então não há mais botão hambúrguer.
 */
export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur lg:px-6 print:hidden">
      <div className="flex items-center gap-3">

        <span className="rounded-md bg-[var(--brand-navy)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand-cyan)]">
          Cliente
        </span>
        <span className="text-sm font-semibold text-[var(--brand-navy)]">Incarmed</span>
        <span className="hidden text-xs text-muted-foreground md:inline">
          · Hospital / Clínica · Bahia
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-muted-foreground md:inline">
          Válido em 11/06/2026
        </span>
        <Button
          variant="outline"
          size="sm"
          className="border-[var(--brand-navy)]/20 text-[var(--brand-navy)] hover:bg-[var(--brand-navy)] hover:text-white"
          onClick={() => window.print()}
        >
          <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Exportar PDF</span>
        </Button>
      </div>
    </header>
  );
}
