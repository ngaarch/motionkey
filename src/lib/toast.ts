export interface ToastOptions {
  title: string;
  description?: string;
  variant?: "success" | "error" | "info";
  duration?: number;
}

export interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: "success" | "error" | "info";
  duration: number;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
let seq = 0;

function emit() {
  for (const fn of listeners) fn([...toasts]);
}

export function subscribeToasts(fn: Listener): () => void {
  listeners.add(fn);
  fn([...toasts]);
  return () => listeners.delete(fn);
}

export function toast(opts: ToastOptions): number {
  const id = ++seq;
  const item: ToastItem = {
    id,
    title: opts.title,
    description: opts.description,
    variant: opts.variant ?? "info",
    duration: opts.duration ?? 4200,
  };
  toasts = [...toasts, item].slice(-4);
  emit();
  window.setTimeout(() => dismissToast(id), item.duration);
  return id;
}

export function dismissToast(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}
