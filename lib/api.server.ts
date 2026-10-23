import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE } from "./auth-cookies";
import { API_URL } from "./config";
import { toApiError } from "./api-error";

export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  if (response.status === 401 || response.status === 403) {
    redirect("/login?expired=1");
  }
  if (!response.ok) {
    throw await toApiError(response);
  }
  return (await response.json()) as T;
}
