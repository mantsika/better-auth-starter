const API_BASE = import.meta.env.VITE_API_URL || "";

export function apiUrl(path: string): string {
  return API_BASE + path;
}

export async function apiFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  return fetch(apiUrl(path), {
    ...options,
    credentials: "include",
  });
}
