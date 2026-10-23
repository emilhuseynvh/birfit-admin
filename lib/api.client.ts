"use client";

import { ADMIN_COOKIE, TOKEN_COOKIE, type AdminUser } from "./auth-cookies";
import { API_URL } from "./config";
import { toApiError } from "./api-error";

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export function readAdminUser(): AdminUser | null {
  const raw = readCookie(ADMIN_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = readCookie(TOKEN_COOKIE);
  const isForm = init?.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (response.status === 401) {
    window.location.href = "/login?expired=1";
  }
  if (!response.ok) {
    throw await toApiError(response);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function clearSession() {
  for (const name of [TOKEN_COOKIE, ADMIN_COOKIE]) {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  }
}
