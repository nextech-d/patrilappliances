const TOKEN_KEY = "patril_admin_token";

const base =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "/api" : "http://localhost:4000");

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

type ApiOptions = RequestInit & { auth?: boolean };

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.auth !== false) {
    const token = getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${base}${path}`, { ...options, headers });
  const data = (await res.json()) as T & { success?: boolean; message?: string };

  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `Request failed (${res.status})`);
  }

  return data;
}

export async function login(password: string) {
  const data = await api<{ success: boolean; token?: string; message?: string }>(
    "/auth/admin/login",
    {
      method: "POST",
      body: JSON.stringify({ password }),
      auth: false,
    }
  );
  if (data.token) setToken(data.token);
  return data;
}

export function formatKes(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getApiBase(): string {
  return base;
}

export async function exportOrdersCsv(): Promise<void> {
  const token = getToken();
  const res = await fetch(`${base}/admin/orders/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Export failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `patril-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function uploadProductImage(file: File): Promise<string> {
  return uploadImage(file, "/admin/uploads");
}

export async function uploadBrandLogo(file: File): Promise<string> {
  return uploadImage(file, "/admin/uploads/brand");
}

async function uploadImage(file: File, path: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const token = getToken();
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });

  const data = (await res.json()) as { success?: boolean; url?: string; message?: string };

  if (!res.ok || !data.url) {
    throw new Error(data.message ?? `Upload failed (${res.status})`);
  }

  return data.url;
}

export const STORE_URL =
  import.meta.env.VITE_STORE_URL?.replace(/\/$/, "") || "https://patrilappliances.vercel.app";
