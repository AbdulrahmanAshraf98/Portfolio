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
    <section className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-semibold">Security</h1>
      <p className="text-sm text-gray-500">
        Password is stored as a bcrypt hash in identity JSON. Client keys are hashed. The plaintext key is shown once.
      </p>
      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
      {message ? <p className="text-cyan-400 text-sm">{message}</p> : null}

      <form onSubmit={onPassword} className="rounded-xl border border-gray-800 p-5 space-y-4">
        <h2 className="font-semibold">Change password</h2>
        <label className="block text-sm">
          <span className="text-gray-400">Current password</span>
          <input
            type="password"
            className="mt-1 w-full rounded-md bg-black border border-gray-800 px-3 py-2"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            minLength={12}
            required
          />
        </label>
        <label className="block text-sm">
          <span className="text-gray-400">New password (min 12)</span>
          <input
            type="password"
            className="mt-1 w-full rounded-md bg-black border border-gray-800 px-3 py-2"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={12}
            required
          />
        </label>
        <button disabled={busy} className="px-5 py-2 rounded-md bg-cyan-700">
          Update password
        </button>
      </form>

      <div className="rounded-xl border border-gray-800 p-5 space-y-4">
        <h2 className="font-semibold">Client API keys</h2>
        <p className="text-sm text-gray-500">
          GraphQL accepts INTERNAL_API_SECRET or any valid generated client key in x-internal-key. Keys are stored
          hashed in identity JSON and take effect immediately — do not put client keys in Vercel env or redeploy.
        </p>
        <button disabled={busy} onClick={() => void generateKey()} className="px-5 py-2 rounded-md bg-cyan-700">
          Generate client key
        </button>
        {freshKey ? (
          <textarea readOnly className="w-full rounded-md bg-black border border-cyan-900 px-3 py-2 text-sm" rows={3} value={freshKey} />
        ) : null}
        <table className="w-full text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="text-left py-2">Prefix</th>
              <th className="text-left py-2">Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((item) => (
              <tr key={item.id} className="border-t border-gray-800">
                <td className="py-2 font-mono">{item.prefix}…</td>
                <td className="py-2 text-gray-500">{item.createdAt.slice(0, 10)}</td>
                <td className="py-2 text-right">
                  {item.revokedAt ? (
                    <span className="text-gray-600">revoked</span>
                  ) : (
                    <button className="text-red-400" onClick={() => void revoke(item.id)}>
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
