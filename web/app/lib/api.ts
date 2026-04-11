import type {
  LifeStats,
  UploadResponse,
  WrappedResult,
  SaveWrappedResponse,
  GlobalStats,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7291";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function uploadFiles(
  files: Record<string, File | File[]>
): Promise<UploadResponse> {
  const form = new FormData();

  for (const [key, value] of Object.entries(files)) {
    if (Array.isArray(value)) {
      value.forEach((f) => form.append(key, f));
    } else {
      form.append(key, value);
    }
  }

  return apiFetch<UploadResponse>("/api/upload", {
    method: "POST",
    body: form,
  });
}

export async function lookupSteam(steamId: string): Promise<LifeStats> {
  return apiFetch<LifeStats>(`/api/steam/${encodeURIComponent(steamId)}`);
}

export async function saveWrapped(
  stats: LifeStats,
  phrases: string[],
  sources: string[]
): Promise<SaveWrappedResponse> {
  return apiFetch<SaveWrappedResponse>("/api/wrapped/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stats, phrases, sources }),
  });
}

export async function getWrapped(token: string): Promise<WrappedResult> {
  return apiFetch<WrappedResult>(`/api/wrapped/${token}`);
}

export async function getGlobalStats(): Promise<GlobalStats> {
  return apiFetch<GlobalStats>("/api/stats/global");
}