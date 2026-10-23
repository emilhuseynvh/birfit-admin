export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3100/api";
export const MEDIA_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${MEDIA_ORIGIN}${path}`;
}
