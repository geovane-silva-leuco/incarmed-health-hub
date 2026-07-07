/**
 * Camada de tracking — tipos + storage plugável.
 *
 * Hoje persiste em `localStorage` (protótipo cliente-only).
 * Quando Lovable Cloud for ativado, substituir SOMENTE as
 * funções `readLogs` / `appendLog` por chamadas Supabase — o
 * restante do app (hook, dashboard) não precisa mudar.
 *
 * Schema equivalente da tabela `user_activity_logs`:
 *   id             uuid pk default gen_random_uuid()
 *   session_id     text not null            -- gerado no client, agrupa eventos de 1 visita
 *   visitor_id     text not null            -- persistente entre sessões (localStorage uuid)
 *   event_type     text not null            -- 'pageview' | 'time_on_page' | 'click' | 'download' | 'cta'
 *   pathname       text not null
 *   label          text                     -- rótulo do click/cta/download
 *   duration_ms    integer                  -- para 'time_on_page'
 *   ip             text
 *   country        text
 *   region         text
 *   city           text
 *   isp            text
 *   ua_browser     text
 *   ua_os          text
 *   ua_device      text                     -- 'mobile' | 'tablet' | 'desktop'
 *   referrer       text
 *   created_at     timestamptz not null default now()
 */

export type EventType = "pageview" | "time_on_page" | "click" | "download" | "cta";

export interface ActivityLog {
  id: string;
  sessionId: string;
  visitorId: string;
  eventType: EventType;
  pathname: string;
  label?: string;
  durationMs?: number;
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  uaBrowser?: string;
  uaOs?: string;
  uaDevice?: "mobile" | "tablet" | "desktop";
  referrer?: string;
  createdAt: string;
}

const STORAGE_KEY = "incarmed:activity_logs";
const VISITOR_KEY = "incarmed:visitor_id";
const SESSION_KEY = "incarmed:session_id";
const GEO_CACHE_KEY = "incarmed:geo_cache";
const MAX_LOGS = 2000; // trava para não estourar localStorage

/** UUID v4 leve, sem dependência. */
function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = uuid();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uuid();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/** Detecta browser/OS/device a partir do UA. Leve, sem lib. */
export function detectUA(ua: string) {
  const uaLower = ua.toLowerCase();
  let device: "mobile" | "tablet" | "desktop" = "desktop";
  if (/ipad|tablet/.test(uaLower)) device = "tablet";
  else if (/mobi|android|iphone/.test(uaLower)) device = "mobile";
  let os = "Desconhecido";
  if (/windows/.test(uaLower)) os = "Windows";
  else if (/mac os|macintosh/.test(uaLower)) os = "macOS";
  else if (/android/.test(uaLower)) os = "Android";
  else if (/iphone|ipad|ios/.test(uaLower)) os = "iOS";
  else if (/linux/.test(uaLower)) os = "Linux";
  let browser = "Desconhecido";
  if (/edg\//.test(uaLower)) browser = "Edge";
  else if (/chrome/.test(uaLower)) browser = "Chrome";
  else if (/firefox/.test(uaLower)) browser = "Firefox";
  else if (/safari/.test(uaLower)) browser = "Safari";
  return { browser, os, device };
}

interface GeoData {
  ip?: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
}

/**
 * Busca IP + geolocalização via ipapi.co (grátis, ~1k req/dia sem key).
 * Cacheia em sessionStorage para não estourar a cota.
 */
export async function fetchGeo(): Promise<GeoData> {
  if (typeof window === "undefined") return {};
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) return JSON.parse(cached) as GeoData;
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return {};
    const j = await res.json();
    const geo: GeoData = {
      ip: j.ip,
      country: j.country_name,
      region: j.region,
      city: j.city,
      isp: j.org,
    };
    sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geo));
    return geo;
  } catch {
    return {};
  }
}

// ─── Storage (troque estas duas funções por chamadas Supabase quando Cloud ativar) ───

export function readLogs(): ActivityLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ActivityLog[]) : [];
  } catch {
    return [];
  }
}

export function appendLog(log: Omit<ActivityLog, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  try {
    const logs = readLogs();
    logs.push({ ...log, id: uuid(), createdAt: new Date().toISOString() });
    if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    /* quota exceeded — silencia */
  }
}

export function clearLogs() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
