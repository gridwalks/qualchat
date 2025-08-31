import type { ChatRequest, ChatResponse, Settings, LogEntry } from "../types";

declare global {
  interface Window { netlifyIdentity: any; }
}

export function getIdentityUser(): any | null {
  // Netlify Identity widget injected in index.html
  return window.netlifyIdentity?.currentUser() ?? null;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  const user = getIdentityUser();
  if (!user) return {};
  const token = await user.jwt();
  return { Authorization: `Bearer ${token}` };
}

export function isAdmin(user: any | null): boolean {
  if (!user) return false;
  const emails = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined)?.split(",").map((s) => s.trim().toLowerCase()) ?? [];
  const allowed = emails.includes((user.email || "").toLowerCase());
  const roles: string[] = user?.app_metadata?.roles ?? [];
  return allowed || roles.includes("admin");
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeader();
  const res = await fetch(path, { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const headers = await getAuthHeader();
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDelete<T>(path: string): Promise<T> {
  const headers = await getAuthHeader();
  const res = await fetch(path, { method: "DELETE", headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function chat(req: ChatRequest): Promise<ChatResponse> {
  return apiPost<ChatResponse>("/api/chat", req);
}

export async function getSettings(): Promise<Settings> {
  return apiGet<Settings>("/api/settings-get");
}

export async function setSettings(s: Partial<Settings>): Promise<{ ok: true }> {
  return apiPost<{ ok: true }>("/api/settings-set", s);
}

export async function ragList(): Promise<any[]> {
  return apiGet<any[]>("/api/rag-list");
}

export async function ragUpsert(doc: any): Promise<{ ok: true; id: string }> {
  return apiPost<{ ok: true; id: string }>("/api/rag-upsert", doc);
}

export async function ragDelete(id: string): Promise<{ ok: true }> {
  return apiDelete<{ ok: true }>(`/api/rag-delete?id=${encodeURIComponent(id)}`);
}

export async function logsUser(): Promise<LogEntry[]> {
  return apiGet<LogEntry[]>("/api/logs-user");
}

export async function logsAdmin(): Promise<LogEntry[]> {
  return apiGet<LogEntry[]>("/api/logs-admin");
}

export async function exportLogsUser(): Promise<Blob> {
  const headers = await getAuthHeader();
  const res = await fetch("/api/logs-export", { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}

export async function exportLogsAdmin(): Promise<Blob> {
  const headers = await getAuthHeader();
  const res = await fetch("/api/logs-export-admin", { headers });
  if (!res.ok) throw new Error(await res.text());
  return res.blob();
}
