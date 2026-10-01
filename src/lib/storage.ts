import type { HistoryEntry, HistoryKind, ThemeMode } from "@/types";

const KEYS = {
  history: "mk:history",
  lastEmail: "mk:last-email",
  recentEmails: "mk:recent-emails",
  theme: "mk:theme",
} as const;

const MAX_RECENT_EMAILS = 3;

const MAX_HISTORY = 12;

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

export function getHistory(): HistoryEntry[] {
  return read<HistoryEntry[]>(KEYS.history) ?? [];
}

export function addHistory(entry: Omit<HistoryEntry, "id" | "at">): HistoryEntry[] {
  const item: HistoryEntry = { ...entry, id: crypto.randomUUID(), at: Date.now() };
  const next = [item, ...getHistory()].slice(0, MAX_HISTORY);
  write(KEYS.history, next);
  return next;
}

export function removeHistory(id: string): HistoryEntry[] {
  const next = getHistory().filter((h) => h.id !== id);
  write(KEYS.history, next);
  return next;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEYS.history);
  } catch {
    /* noop */
  }
}

export function getLastEmail(): string {
  return read<string>(KEYS.lastEmail) ?? "";
}

export function setLastEmail(email: string): void {
  write(KEYS.lastEmail, email);
  const next = [email, ...getRecentEmails().filter((e) => e !== email)].slice(0, MAX_RECENT_EMAILS);
  write(KEYS.recentEmails, next);
}

export function getRecentEmails(): string[] {
  return read<string[]>(KEYS.recentEmails) ?? [];
}

export function getStoredTheme(): ThemeMode | null {
  try {
    const v = localStorage.getItem(KEYS.theme);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

export function setStoredTheme(mode: ThemeMode): void {
  try {
    localStorage.setItem(KEYS.theme, mode);
  } catch {
    /* noop */
  }
}

export type { HistoryKind };
