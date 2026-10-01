import { ApiError, type ApiCallMeta, type ApiResult, type SendLinkResponse, type UnlockResponse } from "@/types";

const ZELORA = "https://zelora-api.vercel.app";
const TIMEOUT_MS = 20000;

interface FetchOk<T> {
  data: T;
  durationMs: number;
}

async function fetchJson<T>(url: string, timeoutMs = TIMEOUT_MS): Promise<FetchOk<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = performance.now();
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: "application/json" },
      referrerPolicy: "no-referrer",
    });
    const durationMs = performance.now() - started;
    if (!res.ok) throw new ApiError(`Server merespons dengan status ${res.status}.`, `HTTP_${res.status}`, "API sedang bermasalah — coba beberapa saat lagi.");
    const json: unknown = await res.json();
    return { data: json as T, durationMs };
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Waktu tunggu habis (timeout).", "TIMEOUT", "Koneksi ke API lambat. Coba lagi.");
    }
    throw new ApiError("Tidak bisa terhubung ke server API.", "NETWORK", "Periksa koneksi internet kamu, lalu coba lagi.");
  } finally {
    clearTimeout(timer);
  }
}

function parseInnerCode(raw: string): string {
  const m = raw.match(/"message"\s*:\s*"([A-Z_]+)"/);
  return m?.[1] ?? "";
}

interface Friendly {
  message: string;
  code: string;
  hint?: string;
}

function friendlyApiMessage(rawMessage: string | undefined, fallback: string): Friendly {
  const raw = (rawMessage ?? "").trim();
  const code = parseInnerCode(raw);
  switch (code) {
    case "INVALID_OOB_CODE":
      return {
        message: "Link verifikasi tidak valid atau sudah kedaluwarsa.",
        code,
        hint: "Kirim ulang link verifikasi ke email, lalu salin link terbaru dari inbox sebelum dipakai.",
      };
    case "INVALID_IDENTIFIER":
      return {
        message: "Email tidak valid atau tidak dikenali.",
        code,
        hint: "Pastikan format email benar dan email tersebut pernah dipakai menerima link verifikasi.",
      };
    case "EMAIL_NOT_FOUND":
      return { message: "Email tidak ditemukan.", code,        hint: "Pastikan email tersebut sudah pernah menerima link verifikasi." };
    case "INVALID_EMAIL":
      return { message: "Format email tidak valid.", code, hint: "Periksa kembali penulisan email kamu." };
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return { message: "Terlalu banyak percobaan. Coba lagi nanti.", code, hint: "Tunggu beberapa menit sebelum mencoba lagi." };
    case "OPERATION_NOT_ALLOWED":
      return { message: "Metode ini sedang dinonaktifkan oleh penyedia layanan.", code };
  }
  if (/parameter link/i.test(raw)) return { message: "Link verifikasi wajib diisi.", code: "MISSING_LINK", hint: "Salin link verifikasi lengkap dari inbox email kamu." };
  if (/parameter email/i.test(raw)) return { message: "Email wajib diisi.", code: "MISSING_EMAIL" };
  if (raw.length > 0) return { message: raw.length > 180 ? fallback : raw, code: "API_ERROR" };
  return { message: fallback, code: "API_ERROR" };
}

function fail<T>(err: unknown, attempted: number): ApiResult<T> {
  const error = err instanceof ApiError ? err : new ApiError(err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.");
  const meta: ApiCallMeta = { durationMs: 0, source: "browser", attempted };
  return { ok: false, error, meta };
}

export async function sendVerificationLink(email: string): Promise<ApiResult<SendLinkResponse>> {
  const url = `${ZELORA}/amprem/send-link?${new URLSearchParams({ email })}`;
  try {
    const { data, durationMs } = await fetchJson<SendLinkResponse>(url);
    if (!data.status) {
      const f = friendlyApiMessage(data.message, "Gagal mengirim link verifikasi.");
      return { ok: false, error: new ApiError(f.message, f.code, f.hint), meta: { durationMs, source: "browser", attempted: 1 } };
    }
    return { ok: true, data, meta: { durationMs, source: "browser", attempted: 1 } };
  } catch (err) {
    return fail<SendLinkResponse>(err, 1);
  }
}

export async function unlockPremium(email: string, link: string): Promise<ApiResult<UnlockResponse>> {
  const url = `${ZELORA}/amprem/unlock?${new URLSearchParams({ email, link })}`;
  try {
    const { data, durationMs } = await fetchJson<UnlockResponse>(url);
    if (!data.status) {
      const f = friendlyApiMessage(data.message, "Unlock gagal. Periksa kembali data kamu.");
      return { ok: false, error: new ApiError(f.message, f.code, f.hint), meta: { durationMs, source: "browser", attempted: 1 } };
    }
    return { ok: true, data, meta: { durationMs, source: "browser", attempted: 1 } };
  } catch (err) {
    return fail<UnlockResponse>(err, 1);
  }
}
