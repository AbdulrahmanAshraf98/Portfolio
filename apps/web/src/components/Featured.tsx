"use client";

import { useMemo, useState } from "react";
import { MediaLightbox } from "@/components/MediaLightbox";
import { SmartImage } from "@/components/SmartImage";
import type { Highlight } from "@/lib/types";

function excerpt(text: string, max = 180) {
  const firstLine = text.split("\n").find((line) => line.trim())?.trim() ?? text.trim();
  if (firstLine.length <= max) return firstLine;
  return `${firstLine.slice(0, max).trimEnd()}…`;
}

export function Featured({
  highlights,
  linkedinUrl,
}: {
  highlights: Highlight[];
  linkedinUrl: string;
}) {
  const ordered = useMemo(
    () => [...highlights].filter((item) => item.mediaUrl).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [highlights],
  );
  const [index, setIndex] = useState<number | null>(null);

  return (
    <section id="Featured" className="relative w-full overflow-hidden bg-[#0a0a0b] py-14 text-white md:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.12),transparent)]" />
      <div className="container relative m-auto px-6 lg:px-16">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-400/80">LinkedIn highlights</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Featured</h2>
          </div>
          {linkedinUrl ? (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-cyan-400"
            >
              View on LinkedIn
              <span aria-hidden className="text-base">↗</span>
            </a>
          ) : null}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((item, itemIndex) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111318] text-left shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-[0_16px_40px_rgba(34,211,238,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1d2226]">
                <SmartImage
                  src={item.mediaUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                {item.date ? (
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-300 backdrop-blur-sm">
                    {item.date}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-4">
                {item.subtitle ? (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/90">{item.subtitle}</p>
                ) : null}
                <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-white">{item.title}</h3>
                {item.description ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-400">{excerpt(item.description)}</p>
                ) : null}
                <p className="mt-auto pt-3 text-xs font-medium text-cyan-400/80 group-hover:text-cyan-300">Read full post</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {index !== null ? (
        <MediaLightbox
          items={ordered.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            mediaUrl: item.mediaUrl,
          }))}
          index={index}
          onClose={() => setIndex(null)}
          onIndex={setIndex}
        />
      ) : null}
    </section>
  );
}
