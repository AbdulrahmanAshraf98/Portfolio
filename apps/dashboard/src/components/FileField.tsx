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
    url.includes("blob.vercel-storage.com") ||
    url.includes("thumbnail") ||
    url.includes("datacamp.com")
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
  const [over, setOver] = useState(false);

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
    <div className="mt-1.5 space-y-2">
      <input
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 outline-none ring-cyan-400/30 focus:border-cyan-500/40 focus:ring-2"
        placeholder="https://... or drop a file below"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center text-sm transition ${
          over ? "border-cyan-400 bg-cyan-950/40 text-cyan-200" : "border-white/15 bg-black/20 text-zinc-500"
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          const file = event.dataTransfer.files?.[0];
          if (file) void upload(file);
        }}
      >
        <input
          type="file"
          accept={accept}
          disabled={busy}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        {busy ? "Uploading..." : "Drop a file here, or click to upload"}
      </label>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {value && isImage(value) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="h-20 rounded-xl border border-white/10 object-cover" />
      ) : null}
      {value && isPdf(value) ? (
        <iframe title="Preview" src={value} className="h-40 w-full rounded-xl border border-white/10 bg-white" />
      ) : null}
      {value && !isImage(value) && !isPdf(value) ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 underline">
          Open file
        </a>
      ) : null}
    </div>
  );
}
