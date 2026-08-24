"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = (await response.json()) as { error?: string; hint?: string };
      if (!response.ok) {
        const message = json.error ?? "Login failed";
        throw new Error(json.hint ? `${message} — ${json.hint}` : message);
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-[0_0_80px_rgba(8,145,178,0.18)] backdrop-blur-xl"
      >
        <p className="font-serif text-5xl italic text-cyan-400">AS</p>
        <p className="mt-2 text-xs uppercase tracking-[0.28em] text-zinc-500">Studio</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-zinc-400">Sign in to edit the public portfolio.</p>
        <label className="mt-8 block text-sm text-zinc-300">Email</label>
        <input
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 outline-none ring-cyan-400/40 transition focus:border-cyan-500/50 focus:ring-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="username"
          required
        />
        <label className="mt-4 block text-sm text-zinc-300">Password</label>
        <input
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 outline-none ring-cyan-400/40 transition focus:border-cyan-500/50 focus:ring-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          required
        />
        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
