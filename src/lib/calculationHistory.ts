export interface HistoryEntry {
  id: string;
  calculator: string;
  inputs: Record<string, string | number>;
  result: string;
  timestamp: string;
}

const STORAGE_KEY = "calchub_history";
const MAX_ENTRIES = 50;

export function getHistory(calculator?: string): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: HistoryEntry[] = JSON.parse(raw);
    if (calculator) return all.filter((e) => e.calculator === calculator);
    return all;
  } catch {
    return [];
  }
}

export function addToHistory(entry: Omit<HistoryEntry, "id" | "timestamp">): void {
  try {
    const all = getHistory();
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
    };
    // Deduplicate — don't save if result is identical to the most recent entry for this calculator
    const lastForCalc = all.find((e) => e.calculator === entry.calculator);
    if (lastForCalc && lastForCalc.result === entry.result) return;

    const updated = [newEntry, ...all].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage full or blocked — silently fail
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function clearCalculatorHistory(calculator: string): void {
  try {
    const all = getHistory();
    const filtered = all.filter((e) => e.calculator !== calculator);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {}
}
