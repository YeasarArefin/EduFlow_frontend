import { env } from '@/config/env';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

type ApiSuccess<T> = {
  data: T;
};

export type ApiListSuccess<T, TMeta> = ApiSuccess<T> & {
  meta: TMeta;
};

type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

export type ApiRequestOptions = {
  baseUrl?: 'api' | 'backend';
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
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

async function requestApi<T>(path: string, options: ApiRequestOptions): Promise<ApiSuccess<T>> {
  const { baseUrl = 'api', method = 'GET', body, headers, signal } = options;
  const requestBaseUrl = baseUrl === 'backend' ? env.backendBaseUrl : env.apiBaseUrl;
  const response = await fetch(`${requestBaseUrl}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'include',
    signal,
  });

  if (response.status === 204) {
    return { data: undefined as T };
  }

  const payload = (await response.json()) as ApiSuccess<T> | ApiErrorResponse;

  if (!response.ok) {
    if ('error' in payload) {
      throw new ApiError(payload.error.code, payload.error.message, response.status);
    }

    throw new ApiError('UNKNOWN_API_ERROR', 'The request could not be completed', response.status);
  }

  if (!('data' in payload)) {
    throw new ApiError(
      'INVALID_API_RESPONSE',
      'The server returned an invalid response',
      response.status
    );
  }

  return payload;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  return (await requestApi<T>(path, options)).data;
}

export async function apiListRequest<T, TMeta>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<ApiListSuccess<T, TMeta>> {
  const payload = await requestApi<T>(path, options);
  if (!('meta' in payload)) {
    throw new ApiError('INVALID_API_RESPONSE', 'The server returned an invalid list response', 200);
  }

  return payload as ApiListSuccess<T, TMeta>;
}
