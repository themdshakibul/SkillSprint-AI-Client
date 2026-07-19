const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | undefined>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, string | undefined>): string {
    const base = this.baseUrl.startsWith('http') ? this.baseUrl : `${window.location.origin}${this.baseUrl}`;
    const url = new URL(`${base}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) url.searchParams.set(key, value);
      });
    }
    return url.toString();
  }

  async fetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOpts } = options;
    const url = this.buildUrl(path, params);

    const res = await fetch(url, {
      ...fetchOpts,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOpts.headers,
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  get<T>(path: string, options?: FetchOptions) {
    return this.fetch<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, body?: unknown, options?: FetchOptions) {
    return this.fetch<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  put<T>(path: string, body?: unknown, options?: FetchOptions) {
    return this.fetch<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) });
  }

  delete<T>(path: string, options?: FetchOptions) {
    return this.fetch<T>(path, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE);
