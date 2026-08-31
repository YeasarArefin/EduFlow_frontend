import { env } from "@/config/env";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type ApiSuccess<T> = {
  data: T;
};

type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export type ApiRequestOptions = {
  baseUrl?: "api" | "backend";
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { baseUrl = "api", method = "GET", body, headers, signal } = options;
  const requestBaseUrl = baseUrl === "backend" ? env.backendBaseUrl : env.apiBaseUrl;
  const response = await fetch(`${requestBaseUrl}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "include",
    signal,
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiErrorResponse;

  if (!response.ok) {
    if ("error" in payload) {
      throw new ApiError(
        payload.error.code,
        payload.error.message,
        response.status,
      );
    }

    throw new ApiError(
      "UNKNOWN_API_ERROR",
      "The request could not be completed",
      response.status,
    );
  }

  if (!("data" in payload)) {
    throw new ApiError(
      "INVALID_API_RESPONSE",
      "The server returned an invalid response",
      response.status,
    );
  }

  return payload.data;
}
