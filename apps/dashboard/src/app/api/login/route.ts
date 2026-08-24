import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE = "aa_session";
const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      user { id email role }
    }
  }
`;

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as { email?: string; password?: string };
  const endpoint = process.env.GRAPHQL_URL ?? (process.env.VERCEL ? "https://aa-graphql.vercel.app/graphql" : "");
  const secret = process.env.INTERNAL_API_SECRET;

  if (!endpoint) {
    return NextResponse.json({ error: "Dashboard is missing GRAPHQL_URL" }, { status: 500 });
  }
  if (!secret) {
    return NextResponse.json({ error: "Dashboard is missing INTERNAL_API_SECRET" }, { status: 500 });
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-internal-key": secret,
      },
      body: JSON.stringify({ query: LOGIN, variables: { email, password } }),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach GraphQL service" }, { status: 502 });
  }

  let json: { data?: { login: { accessToken: string } }; errors?: { message: string }[] };
  try {
    json = (await response.json()) as typeof json;
  } catch {
    return NextResponse.json({ error: "GraphQL returned an invalid response" }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: json.errors?.[0]?.message ?? `GraphQL error (${response.status})` },
      { status: response.status >= 500 ? 502 : response.status },
    );
  }

  if (!json.data?.login?.accessToken) {
    const message = json.errors?.[0]?.message ?? "Invalid credentials";
    const hint =
      message === "Request failed"
        ? "Check INTERNAL_API_SECRET and JWT_SECRET on GraphQL + Identity, and IDENTITY_URL on GraphQL."
        : undefined;
    return NextResponse.json({ error: message, ...(hint ? { hint } : {}) }, { status: 401 });
  }

  const jar = await cookies();
  jar.set(COOKIE, json.data.login.accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return NextResponse.json({ ok: true });
}
