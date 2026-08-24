"use client";

import { useMemo, useState } from "react";
import { MediaLightbox } from "@/components/MediaLightbox";
import type { Certificate } from "@/lib/types";
import { driveThumb, issuerLogo } from "@/lib/credentials";

function mediaUrl(item: Certificate) {
  if (item.imageUrl) return item.imageUrl;
  return driveThumb(item.fileUrl) || driveThumb(item.credentialUrl);
}

function Logo({ issuer }: { issuer: string }) {
  const [failed, setFailed] = useState(false);
  const logo = failed ? "" : issuerLogo(issuer);
  const initial = issuer.trim().charAt(0).toUpperCase() || "C";
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-800 bg-white">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain p-1"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-700">{initial}</span>
      )}
    </div>
  );
}

export function CertificatePreview({
  certificates,
  linkedinUrl,
}: {
  certificates: Certificate[];
  linkedinUrl: string;
}) {
  const ordered = useMemo(
    () => [...certificates].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [certificates],
  );
  const media = useMemo(
    () =>
      ordered
        .map((item) => ({
          id: item.id,
          title: `${item.title}.jpg`,
          description: item.title,
          mediaUrl: mediaUrl(item),
        }))
        .filter((item) => item.mediaUrl),
    [ordered],
  );
  const [index, setIndex] = useState<number | null>(null);
  const certsUrl = "https://www.linkedin.com/in/abdulrahmanashraf98/details/certifications/";

  function open(item: Certificate) {
    const next = media.findIndex((entry) => entry.id === item.id);
    if (next >= 0) {
      setIndex(next);
      return;
    }
    if (item.credentialUrl) window.open(item.credentialUrl, "_blank", "noreferrer");
  }

  return (
    <section id="Certificates" className="py-12 md:py-16 w-full bg-black text-white">
      <div className="container m-auto px-8 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-semibold mt-3 border-b border-gray-800 pb-4">
          Licenses & certifications
        </h2>
        <div className="mt-8 max-w-3xl divide-y divide-gray-800">
          {ordered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => open(item)}
              className="flex w-full gap-4 py-5 text-left hover:bg-white/[0.03]"
            >
              <Logo issuer={item.issuer} />
              <div className="min-w-0 flex-1">
                <h3 className="text-[17px] font-semibold leading-snug">{item.title}</h3>
                <p className="mt-0.5 text-[15px] text-gray-300">{item.issuer}</p>
                {item.issueDate ? <p className="mt-0.5 text-sm text-gray-500">Issued {item.issueDate}</p> : null}
                <span className="mt-3 inline-flex rounded-full border border-gray-600 px-3 py-1 text-sm text-gray-200">
                  Show credential
                </span>
              </div>
            </button>
          ))}
        </div>
        <a
          href={linkedinUrl || certsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex text-sm text-cyan-400 hover:underline"
        >
          View on LinkedIn
        </a>
      </div>
      {index !== null ? (
        <MediaLightbox items={media} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
      ) : null}
    </section>
  );
}
