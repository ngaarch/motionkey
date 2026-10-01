export interface SendLinkResponse {
  status: boolean;
  creator?: string;
  message?: string;
  email?: string;
  oobCode?: string | null;
  result?: {
    kind?: string;
    email?: string;
  };
}

export interface UnlockResponse {
  status: boolean;
  creator?: string;
  message?: string;
  email?: string;
}

export interface ApiCallMeta {
  durationMs: number;
  source: "browser";
  attempted: number;
}

export type ApiResult<T> =
  | { ok: true; data: T; meta: ApiCallMeta }
  | { ok: false; error: ApiError; meta: ApiCallMeta };

export class ApiError extends Error {
  code: string;
  hint?: string;
  constructor(message: string, code = "UNKNOWN", hint?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.hint = hint;
  }
}

export type HistoryKind = "send-link" | "unlock";

export interface HistoryEntry {
  id: string;
  kind: HistoryKind;
  email: string;
  link?: string;
  detail: string;
  status: "success" | "failed";
  responseTime: string;
  at: number;
}

export type ThemeMode = "dark" | "light";
