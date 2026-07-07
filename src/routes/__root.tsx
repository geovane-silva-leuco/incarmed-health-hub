import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppSidebar } from "@/components/leucotron/app-sidebar";
import { TopHeader } from "@/components/leucotron/header";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IncarMed × Leucotron — Proposta Comercial Interativa" },
      { name: "description", content: "Dashboard executivo da proposta Leucotron para o Incarmed (BA): Conecta, Agente IA, Flux 3.0, VoiceBOT e integração PIXEON. Veja o investimento consolidado." },
      { name: "author", content: "Leucotron Telecom" },
      { name: "keywords", content: "telefonia hospitalar, omnichannel saúde, WhatsApp hospitalar, PABX em nuvem, IA para call center, integração PIXEON, Leucotron Bahia, central de relacionamento hospital" },
      { name: "geo.region", content: "BR-BA" },
      { name: "geo.placename", content: "Bahia, Brasil" },
      { name: "ICBM", content: "-12.9714,-38.5014" },
      { property: "og:site_name", content: "IncarMed × Leucotron" },
      { property: "og:title", content: "IncarMed × Leucotron — Proposta Comercial Interativa" },
      { property: "og:description", content: "Cinco soluções Leucotron consolidadas em um único dashboard executivo para o Incarmed." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "IncarMed × Leucotron — Proposta Interativa" },
      { name: "twitter:description", content: "Dashboard executivo da proposta comercial Leucotron para o Incarmed (BA)." },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Leucotron Telecom",
          url: "https://www.leucotron.com.br",
          areaServed: { "@type": "AdministrativeArea", name: "Bahia, Brasil" },
          makesOffer: {
            "@type": "Offer",
            name: "Proposta Comercial Incarmed",
            description: "Conecta, Agente Inteligente, Flux 3.0, VoiceBOT e integração PIXEON.",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen w-full bg-[var(--brand-surface)]">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader />
          <main className="min-w-0 flex-1 px-6 py-8 lg:px-10 print:px-0 print:py-0">
            <Outlet />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}
