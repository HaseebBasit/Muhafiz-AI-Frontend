const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getTokens() {
  const accessToken = localStorage.getItem("muhafiz_access_token");
  const refreshToken = localStorage.getItem("muhafiz_refresh_token");
  return { accessToken, refreshToken };
}

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("muhafiz_access_token", accessToken);
  localStorage.setItem("muhafiz_refresh_token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("muhafiz_access_token");
  localStorage.removeItem("muhafiz_refresh_token");
}

let refreshingPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const { refreshToken } = getTokens();
  if (!refreshToken) return false;

  if (!refreshingPromise) {
    refreshingPromise = fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (r) => {
        if (!r.ok) return false;
        const data = await r.json();
        setTokens(data.accessToken, data.refreshToken);
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshingPromise = null;
      });
  }
  return refreshingPromise;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  skipAuth?: boolean;
}

export async function apiRequest<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, skipAuth = false } = options;

  const doFetch = async (): Promise<Response> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (!skipAuth) {
      const { accessToken } = getTokens();
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let response = await doFetch();

  if (response.status === 401 && !skipAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      response = await doFetch();
    }
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message = (data && (data.error || data.message)) || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export const authApi = {
  signup: (payload: { fullName: string; email: string; password: string; role: string }) =>
    apiRequest<{ user: any; accessToken: string; refreshToken: string }>("/auth/signup", {
      method: "POST",
      body: payload,
      skipAuth: true,
    }).then((data) => {
      setTokens(data.accessToken, data.refreshToken);
      return data;
    }),
  login: (payload: { email: string; password: string }) =>
    apiRequest<{ user: any; accessToken: string; refreshToken: string }>("/auth/login", {
      method: "POST",
      body: payload,
      skipAuth: true,
    }).then((data) => {
      setTokens(data.accessToken, data.refreshToken);
      return data;
    }),
  me: () => apiRequest<{ user: any }>("/auth/me"),
};

export const scansApi = {
  list: () => apiRequest<{ scans: any[] }>("/scans"),
  get: (id: string) => apiRequest<{ scan: any; issues: any[] }>(`/scans/${id}`),
};

export const issuesApi = {
  list: (params?: { severity?: string; status?: string; scanId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.severity) qs.set("severity", params.severity);
    if (params?.status) qs.set("status", params.status);
    if (params?.scanId) qs.set("scanId", params.scanId);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return apiRequest<{ issues: any[] }>(`/issues${suffix}`);
  },
  get: (id: string) => apiRequest<{ issue: any }>(`/issues/${id}`),
  update: (id: string, payload: { status?: string; fixedCode?: string; fixExplanation?: string }) =>
    apiRequest<{ issue: any }>(`/issues/${id}`, { method: "PUT", body: payload }),
};

export const projectsApi = {
  list: () => apiRequest<{ projects: any[] }>("/projects"),
  create: (payload: { name: string; description?: string; language?: string }) =>
    apiRequest<{ project: any }>("/projects", { method: "POST", body: payload }),
  update: (id: string, payload: Record<string, unknown>) =>
    apiRequest<{ project: any }>(`/projects/${id}`, { method: "PUT", body: payload }),
  remove: (id: string) => apiRequest<{ success: boolean }>(`/projects/${id}`, { method: "DELETE" }),
};

export const securityScoreApi = {
  get: () => apiRequest<{ securityScore: any }>("/security-score"),
};

export const scanCodeApi = {
  run: (payload: { code: string; language: string; fileName?: string; projectId?: string }) =>
    apiRequest<{ scan: any; issues: any[]; securityScore: any }>("/scan/code", {
      method: "POST",
      body: payload,
    }),
};

export const integrationsApi = {
  list: () => apiRequest<{ integrations: any[] }>("/integrations"),
  toggle: (key: string, enabled: boolean) =>
    apiRequest<{ key: string; enabled: boolean }>(`/integrations/${key}`, {
      method: "PUT",
      body: { enabled },
    }),
};
