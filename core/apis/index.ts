import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import type { Response } from '@interfaces/index';

export const api: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_APP_ENV === 'production'
      ? 'https://byseop.com/api'
      : 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'ko'
  },
  timeout: 10000
});

// interface
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

interface Request extends AxiosRequestConfig {
  url: string;
  body?: FormData;
  lang?: string;
}

export async function request<R>({
  method = 'GET',
  url,
  params,
  data,
  lang = 'ko'
}: Request) {
  if (method !== 'GET' && params) data = params;

  const { data: result } = await api.request<Response<R>>({
    method,
    url,
    headers: { 'Accept-Language': lang },
    ...(data && { data }),
    ...(params && method === 'GET' && { params })
  });
  return result;
}

export async function formRequest<R>({ url, data, lang = 'ko' }: Request) {
  const { data: result } = await api.request<Response<R>>({
    method: 'POST',
    url,
    headers: { 'Accept-Language': lang, 'Content-Type': 'multipart/form-data' },
    data
  });
  return result;
}
