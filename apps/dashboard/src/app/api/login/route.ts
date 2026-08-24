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
    return NextResponse.json({ error: "Server is not configured" }, { status: 500 });
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { "x-internal-key": secret } : {}),
    },
    body: JSON.stringify({ query: LOGIN, variables: { email, password } }),
  });
  const json = (await response.json()) as {
    data?: { login: { accessToken: string } };
    errors?: { message: string }[];
  };
  if (!json.data?.login?.accessToken) {
    return NextResponse.json({ error: json.errors?.[0]?.message ?? "Invalid credentials" }, { status: 401 });
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
