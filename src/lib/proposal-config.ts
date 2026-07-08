/**
 * Configuração da proposta selecionada — fonte única de verdade que faz o
 * "cruzamento" entre as páginas (Dashboard, Soluções, Financeiro, Aprovação).
 *
 * Persistido em localStorage para sobreviver a navegação/refresh e sincroniza
 * entre abas via evento `storage`. Não depende de Cloud.
 */
import { useSyncExternalStore } from "react";
import {
  conectaPacotesMensagens,
  agenteInteligentePlanos,
  type PlanoAgente,
} from "@/data/pricing";

export type FluxModalidade = "cloud" | "onpremise";
export type VoiceBotModo = "mensal" | "anual" | "off";

export type ProposalConfig = {
  /** Pacote Conecta contratado (mensagens/mês). */
  conectaPacoteMensagens: number;
  /** Se o cliente contratou o módulo Confirmador de Consultas (add-on Conecta). */
  conectaConfirmadorConsultas: boolean;
  /** Plano contratado do Agente Inteligente. */
  agentePlano: PlanoAgente;
  /** Modalidade do Flux 3.0 (PABX): Cloud ou On-Premise. */
  fluxModalidade: FluxModalidade;
  /** Modo de contratação do VoiceBOT — ou "off" quando não incluso. */
  voicebotModo: VoiceBotModo;
  /** IDs das frentes do Sob Medida contratadas. */
  sobMedidaFrentes: number[];
};

export const defaultProposalConfig: ProposalConfig = {
  conectaPacoteMensagens: 25000,
  conectaConfirmadorConsultas: true,
  agentePlano: "Tiny",
  fluxModalidade: "cloud",
  voicebotModo: "mensal",
  sobMedidaFrentes: [1, 2, 3, 4, 5],
};

const STORAGE_KEY = "leucotron:proposal-config:v1";

function readStorage(): ProposalConfig {
  if (typeof window === "undefined") return defaultProposalConfig;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProposalConfig;
    return { ...defaultProposalConfig, ...JSON.parse(raw) };
  } catch {
    return defaultProposalConfig;
  }
}

const listeners = new Set<() => void>();
let cache: ProposalConfig | null = null;

function getSnapshot(): ProposalConfig {
  if (cache === null) cache = readStorage();
  return cache;
}

function emit() {
  cache = readStorage();
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) emit();
  });
}

export function setProposalConfig(patch: Partial<ProposalConfig>) {
  const next = { ...getSnapshot(), ...patch };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  cache = next;
  listeners.forEach((l) => l());
}

export function useProposalConfig(): ProposalConfig {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    getSnapshot,
    () => defaultProposalConfig,
  );
}

/** Helpers derivados — para uso nos cards/hint labels. */
export function getConectaPacote(cfg: ProposalConfig) {
  return (
    conectaPacotesMensagens.find((p) => p.mensagens === cfg.conectaPacoteMensagens) ??
    conectaPacotesMensagens.find((p) => p.mensagens === 25000)!
  );
}

export function getAgentePlano(cfg: ProposalConfig) {
  return (
    agenteInteligentePlanos.find((p) => p.plano === cfg.agentePlano) ??
    agenteInteligentePlanos[0]
  );
}
