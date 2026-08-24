"use client";

import { useState } from "react";

function isPdf(url: string) {
  return /\.pdf(\?|$)/i.test(url);
}

function isImage(url: string) {
  if (isPdf(url)) return false;
  return (
    /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url) ||
    url.includes("/uploads/") ||
    url.includes("blob.vercel-storage.com")
  );
}

export function FileField({
  value,
  accept,
  onChange,
}: {
  value: string;
  accept?: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const json = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !json.url) throw new Error(json.error ?? "Upload failed");
      onChange(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-1 space-y-2">
      <input
        className="w-full rounded-md bg-black border border-gray-800 px-3 py-2"
        placeholder="https://... or upload below"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept={accept}
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        {busy ? <span className="text-xs text-cyan-400">Uploading...</span> : null}
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {value && isImage(value) ? (
        <img src={value} alt="" className="h-20 rounded-md border border-gray-800 object-cover" />
      ) : null}
      {value && isPdf(value) ? (
        <iframe title="Preview" src={value} className="h-40 w-full rounded-md border border-gray-800 bg-white" />
      ) : null}
      {value && !isImage(value) && !isPdf(value) ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 underline">
          Open file
        </a>
      ) : null}
    </div>
  );
}
