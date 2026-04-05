/**
 * API utility for communicating with the Symfony/FrankenPHP backend.
 *
 * In the browser, requests are sent to the same origin (e.g. /api/hello)
 * and Next.js rewrites them to the backend via next.config.ts — this
 * eliminates CORS issues entirely.
 *
 * On the server side (SSR / Route Handlers), the full internal URL is used
 * so the Next.js runtime can reach the backend directly over the Railway
 * private network.
 */

const IS_SERVER = typeof window === "undefined";

const BASE_URL = IS_SERVER
  ? (process.env.NEXT_PUBLIC_API_URL ?? "http://backend.railway.internal:3000")
  : "";

// ---------------------------------------------------------------------------
// Core helper
// ---------------------------------------------------------------------------

/**
 * Thin wrapper around fetch that:
 *  - Prepends BASE_URL to every path
 *  - Sets Content-Type: application/json for requests with a body
 *  - Parses the JSON response
 *  - Throws a descriptive Error on non-2xx responses
 */
export async function apiCall<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (networkError) {
    console.error(`[api] Network error calling ${url}:`, networkError);
    throw new Error(
      "Server nicht erreichbar. Bitte überprüfe deine Verbindung."
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    // Response body is not JSON — surface the HTTP status instead
    throw new Error(`Unerwartete Antwort vom Server (HTTP ${response.status})`);
  }

  if (!response.ok) {
    const errorMessage =
      (data as Record<string, string>)?.error ??
      (data as Record<string, string>)?.message ??
      `HTTP ${response.status}`;
    console.error(`[api] Error response from ${url}:`, data);
    throw new Error(errorMessage);
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// Endpoint helpers
// ---------------------------------------------------------------------------

/** GET /api/hello — smoke-test endpoint */
export async function getHello(): Promise<{ message: string }> {
  return apiCall<{ message: string }>("/api/hello");
}

/** POST /api/login — authenticate a user and receive a JWT token */
export async function login(
  email: string,
  password: string
): Promise<{ token: string }> {
  return apiCall<{ token: string }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
