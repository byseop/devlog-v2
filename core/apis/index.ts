import type { Response } from '@interfaces/index';

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_ENV === 'production'
    ? 'https://byseop.com/api'
    : 'http://localhost:3000/api';

const DEFAULT_TIMEOUT = 10000;

interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  params?: Record<string, any>;
  data?: any;
  body?: FormData;
  lang?: string;
  signal?: AbortSignal;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = DEFAULT_TIMEOUT
): Promise<globalThis.Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function request<R>({
  method = 'GET',
  url,
  params,
  data,
  lang = 'ko',
  signal
}: RequestConfig): Promise<Response<R>> {
  const fullUrl = new URL(url, BASE_URL);

  if (method === 'GET' && params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fullUrl.searchParams.append(key, String(value));
      }
    });
  }

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': lang
    },
    signal
  };

  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetchWithTimeout(fullUrl.toString(), options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function formRequest<R>({
  url,
  data,
  lang = 'ko',
  signal
}: RequestConfig): Promise<Response<R>> {
  const fullUrl = new URL(url, BASE_URL);

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Accept-Language': lang
    },
    body: data,
    signal
  };

  const response = await fetchWithTimeout(fullUrl.toString(), options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
