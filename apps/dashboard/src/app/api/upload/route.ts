import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE = "aa_session";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = process.env.ALLOWED_ORIGINS?.split(",") ?? [];
  if (origin && allowed.length && !allowed.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const incoming = await request.formData();
  const file = incoming.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const base = (process.env.FILES_URL ?? "http://localhost:3007").replace(/\/$/, "");
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return NextResponse.json({ error: "Server is not configured" }, { status: 500 });

  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${base}/v1/files`, {
    method: "POST",
    headers: {
      "x-internal-key": secret,
      authorization: `Bearer ${token}`,
    },
    body,
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json(
      { error: (json as { message?: string; error?: string }).message ?? (json as { error?: string }).error ?? "Upload failed" },
      { status: response.status },
    );
  }
  return NextResponse.json(json);
}
