async function request<T>(baseUrl: string, path: string, init: RequestInit = {}): Promise<T> {
  const url = `${baseUrl.replace(/\/$/, "")}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-internal-key": process.env.INTERNAL_API_SECRET ?? "",
      ...(init.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Request failed ${response.status}`);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}

const identityUrl = () =>
  process.env.IDENTITY_URL ?? (process.env.VERCEL ? "https://aa-identity.vercel.app" : "http://localhost:3001");
const queryUrl = () =>
  process.env.QUERY_URL ?? (process.env.VERCEL ? "https://aa-catalog-query.vercel.app" : "http://localhost:3002");
const commandUrl = () =>
  process.env.COMMAND_URL ?? (process.env.VERCEL ? "https://aa-catalog-command.vercel.app" : "http://localhost:3005");
const certificatesUrl = () =>
  process.env.CERTIFICATES_URL ?? (process.env.VERCEL ? "https://aa-certificates-abdulrahmanashraf98s-projects.vercel.app" : "http://localhost:3006");

export const identityClient = {
  login: (email: string, password: string) =>
    request<{ accessToken: string; user: { id: string; email: string; role: string } }>(
      identityUrl(),
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    ),
  me: (token: string) =>
    request(identityUrl(), "/auth/me", {
      headers: { authorization: `Bearer ${token}` },
    }),
  changePassword: (token: string, currentPassword: string, newPassword: string) =>
    request(identityUrl(), "/auth/password", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  listKeys: (token: string) =>
    request(identityUrl(), "/auth/keys", {
      headers: { authorization: `Bearer ${token}` },
    }),
  createKey: (token: string) =>
    request(identityUrl(), "/auth/keys", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    }),
  revokeKey: (token: string, id: string) =>
    request(identityUrl(), `/auth/keys/${id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    }),
};

export const queryClient = {
  portfolio: (category?: string) =>
    request(
      queryUrl(),
      `/v1/portfolio${category ? `?category=${encodeURIComponent(category)}` : ""}`,
    ),
  project: (slug: string) => request(queryUrl(), `/v1/projects/${slug}`),
  list: (resource: string, token: string) =>
    request(queryUrl(), `/v1/admin/${resource}`, {
      headers: { authorization: `Bearer ${token}` },
    }),
};

export const commandClient = {
  create: (resource: string, token: string, input: unknown) =>
    request(commandUrl(), `/v1/commands/${resource}`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    }),
  update: (resource: string, id: string, token: string, input: unknown) =>
    request(commandUrl(), `/v1/commands/${resource}/${id}`, {
      method: "PUT",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    }),
  remove: (resource: string, id: string, token: string) =>
    request(commandUrl(), `/v1/commands/${resource}/${id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    }),
};

export const certificatesClient = {
  list: () => request(certificatesUrl(), "/v1/certificates"),
  adminList: (token: string) =>
    request(certificatesUrl(), "/v1/certificates", {
      headers: { authorization: `Bearer ${token}` },
    }),
  create: (token: string, input: unknown) =>
    request(certificatesUrl(), "/v1/certificates", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    }),
  update: (id: string, token: string, input: unknown) =>
    request(certificatesUrl(), `/v1/certificates/${id}`, {
      method: "PUT",
      headers: { authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    }),
  remove: (id: string, token: string) =>
    request(certificatesUrl(), `/v1/certificates/${id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    }),
};
