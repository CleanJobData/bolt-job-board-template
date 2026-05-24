import { getApiConfig } from "./env";
import { ApiErrorBody } from "./types";

export class ApiError extends Error {
  status: number;
  code?: string;
  url?: string;

  constructor(body: ApiErrorBody, url?: string) {
    super(body.message);
    this.name = "ApiError";
    this.status = body.status;
    this.code = body.code;
    this.url = url;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { baseUrl, apiKey } = getApiConfig();
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}?path=${encodeURIComponent(path)}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "apikey": apiKey,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorBody: any;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = {};
    }

    const finalError: ApiErrorBody = {
      status: errorBody.status || response.status,
      message: errorBody.message || errorBody.error || response.statusText || "Unknown API Error",
      code: errorBody.code,
    };

    throw new ApiError(finalError, url);
  }

  return response.json() as Promise<T>;
}
