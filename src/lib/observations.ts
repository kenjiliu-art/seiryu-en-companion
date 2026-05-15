// localStorage-backed visitor confirmations of plant phenology.
// Zero-infra: no auth, no server. Each browser keeps its own field notebook.

export type ObservationState = "blooming" | "budding" | "dormant";

export type Observation = {
  state: ObservationState;
  /** ISO date YYYY-MM-DD */
  date: string;
};

const KEY = "jaccc:plant-observations:v1";
const FRESH_DAYS = 14;

function read(): Record<string, Observation> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, Observation>) : {};
  } catch {
    return {};
  }
}

function write(all: Record<string, Observation>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* ignore quota */
  }
  window.dispatchEvent(new Event("jaccc:obs-changed"));
}

export function getObservation(plantId: string): Observation | null {
  return read()[plantId] ?? null;
}

export function setObservation(plantId: string, state: ObservationState) {
  const all = read();
  all[plantId] = { state, date: new Date().toISOString().slice(0, 10) };
  write(all);
}

export function clearObservation(plantId: string) {
  const all = read();
  delete all[plantId];
  write(all);
}

export function isFresh(obs: Observation | null): boolean {
  if (!obs) return false;
  const ageMs = Date.now() - new Date(obs.date).getTime();
  return ageMs < FRESH_DAYS * 24 * 3600 * 1000;
}

export const STATE_META: Record<ObservationState, { emoji: string; label: string; color: string }> = {
  blooming: { emoji: "🌸", label: "In bloom / fruit", color: "#d05a6e" },
  budding:  { emoji: "🟡", label: "Budding / partial", color: "#e8b84a" },
  dormant:  { emoji: "⚫", label: "Not yet / past",    color: "#888e7e" },
};
