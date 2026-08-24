"use client";

import { FormEvent, useEffect, useState } from "react";
import { CHANGE_PASSWORD, gql, LIST_KEYS, REVOKE_KEY, ROTATE_KEY } from "@/lib/gql";

type KeyItem = { id: string; prefix: string; createdAt: string; revokedAt?: string | null };

export function SecurityPanel() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [freshKey, setFreshKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadKeys() {
    const data = await gql<{ listClientKeys: KeyItem[] }>(LIST_KEYS);
    setKeys(data.listClientKeys ?? []);
  }

  useEffect(() => {
    void loadKeys().catch((err) => setError(err instanceof Error ? err.message : "Failed to load keys"));
  }, []);

  async function onPassword(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await gql(CHANGE_PASSWORD, { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Password updated. Use the new password on next login.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setBusy(false);
    }
  }

  async function generateKey() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const data = await gql<{ rotateClientKey: { key: string } }>(ROTATE_KEY);
      setFreshKey(data.rotateClientKey.key);
      setMessage("Copy this client key now. It is stored hashed and works immediately. Do not add it to Vercel env.");
      await loadKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Key generation failed");
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: string) {
    await gql(REVOKE_KEY, { id });
    await loadKeys();
  }

  return (
    <section className="grid max-w-4xl gap-6 lg:grid-cols-2">
      {error ? <p className="lg:col-span-2 text-sm text-red-400">{error}</p> : null}
      {message ? <p className="lg:col-span-2 text-sm text-cyan-300">{message}</p> : null}

      <form onSubmit={onPassword} className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Password</h2>
        <p className="text-sm text-zinc-500">Stored as a bcrypt hash. Min 12 characters.</p>
        <label className="block text-sm">
          <span className="text-zinc-400">Current password</span>
          <input
            type="password"
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            minLength={12}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">New password</span>
          <input
            type="password"
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={12}
            required
          />
        </label>
        <button disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-2.5 font-semibold text-black">
          Update password
        </button>
      </form>

      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Client API keys</h2>
        <p className="text-sm text-zinc-500">
          GraphQL accepts a generated client key in x-internal-key. Keys are hashed. Copy once — do not put them in Vercel env.
        </p>
        <button
          disabled={busy}
          onClick={() => void generateKey()}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-cyan-200 hover:bg-white/5"
        >
          Generate client key
        </button>
        {freshKey ? (
          <textarea readOnly className="w-full rounded-xl border border-cyan-900 bg-black px-3 py-2 text-sm" rows={3} value={freshKey} />
        ) : null}
        <div className="divide-y divide-white/10">
          {keys.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-mono text-zinc-200">{item.prefix}…</p>
                <p className="text-xs text-zinc-500">{item.createdAt.slice(0, 10)}</p>
              </div>
              {item.revokedAt ? (
                <span className="text-zinc-600">revoked</span>
              ) : (
                <button className="text-red-400" onClick={() => void revoke(item.id)}>
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
