import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE = "aa_session";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = process.env.ALLOWED_ORIGINS?.split(",") ?? [];
  if (origin && allowed.length && !allowed.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { query, variables, token: bodyToken } = (await request.json()) as {
    query: string;
    variables?: Record<string, unknown>;
    token?: string;
  };
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value || bodyToken;
  const endpoint = process.env.GRAPHQL_URL;
  const secret = process.env.INTERNAL_API_SECRET;
  if (!endpoint || !secret) {
    return NextResponse.json({ error: "Server is not configured" }, { status: 500 });
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-key": secret,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  return NextResponse.json(json, { status: response.ok ? 200 : 400 });
}
