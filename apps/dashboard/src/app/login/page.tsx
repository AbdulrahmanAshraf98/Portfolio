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
      const json = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(json.error ?? "Login failed");
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-8">
        <p className="font-serif text-4xl italic text-cyan-400 mb-2">AS</p>
        <h1 className="text-2xl font-bold mb-6">Private dashboard</h1>
        <label className="block text-sm mb-2">Email</label>
        <input
          className="w-full mb-4 rounded-md bg-black border border-gray-800 px-3 py-2"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="username"
          required
        />
        <label className="block text-sm mb-2">Password</label>
        <input
          className="w-full mb-6 rounded-md bg-black border border-gray-800 px-3 py-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          required
        />
        {error ? <p className="text-red-400 mb-4 text-sm">{error}</p> : null}
        <button disabled={loading} className="w-full rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 py-3 font-semibold">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
