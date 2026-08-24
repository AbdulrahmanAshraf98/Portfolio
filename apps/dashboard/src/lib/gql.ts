const COOKIE = "aa_session";

export async function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const response = await fetch("/api/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables, token }),
  });
  const json = (await response.json()) as { data?: T; errors?: { message: string }[]; error?: string };
  if (!response.ok || json.error || json.errors?.length) {
    throw new Error(json.error ?? json.errors?.[0]?.message ?? "Request failed");
  }
  if (!json.data) throw new Error("Empty response");
  return json.data;
}

export { COOKIE };

export const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user { id email role }
    }
  }
`;

export const ADMIN_LIST = `
  query AdminList($resource: String!) {
    adminList(resource: $resource)
  }
`;

export const ADMIN_CREATE = `
  mutation AdminCreate($resource: String!, $input: JSONObject!) {
    adminCreate(resource: $resource, input: $input)
  }
`;

export const ADMIN_UPDATE = `
  mutation AdminUpdate($resource: String!, $id: String!, $input: JSONObject!) {
    adminUpdate(resource: $resource, id: $id, input: $input)
  }
`;

export const ADMIN_DELETE = `
  mutation AdminDelete($resource: String!, $id: String!) {
    adminDelete(resource: $resource, id: $id) { ok }
  }
`;

export const CHANGE_PASSWORD = `
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) { ok }
  }
`;

export const LIST_KEYS = `
  query ListClientKeys {
    listClientKeys { id prefix createdAt revokedAt }
  }
`;

export const ROTATE_KEY = `
  mutation RotateClientKey {
    rotateClientKey { id prefix createdAt key }
  }
`;

export const REVOKE_KEY = `
  mutation RevokeClientKey($id: String!) {
    revokeClientKey(id: $id) { ok }
  }
`;
