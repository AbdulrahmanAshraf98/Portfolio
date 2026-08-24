"use client";

import { useState } from "react";
import type { Certificate } from "@/lib/types";

function isImage(url?: string) {
  return Boolean(url && /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url));
}

function isPdf(url?: string) {
  return Boolean(url && /\.pdf(\?|$)/i.test(url));
}

function previewSrc(item: Certificate) {
  return item.imageUrl || item.fileUrl || "";
}

export function CertificatePreview({
  certificates,
  linkedinUrl,
}: {
  certificates: Certificate[];
  linkedinUrl: string;
}) {
  const ordered = [...certificates].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = ordered.find((item) => item.id === openId);
  const src = selected ? previewSrc(selected) : "";
  const certsUrl = "https://www.linkedin.com/in/abdulrahmanashraf98/details/certifications/";

  return (
    <section id="Certificates" className="py-12 md:py-16 w-full bg-black text-white">
      <div className="container m-auto px-8 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-semibold mt-3 border-b border-gray-800 pb-4">
          Licenses & certifications
        </h2>
        <div className="mt-10 space-y-4 max-w-4xl">
          {ordered.map((item) => {
            const canPreview = Boolean(item.imageUrl || item.fileUrl || item.credentialUrl);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => canPreview && setOpenId(item.id)}
                className="w-full text-left border-b border-gray-800 pb-5 hover:border-cyan-500/40"
              >
                {item.imageUrl ? (
                  <div className="mb-4 h-40 overflow-hidden bg-gray-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt="" className="h-full w-full object-cover object-top" />
                  </div>
                ) : null}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-cyan-400/90 mt-1 text-sm">{item.issuer}</p>
                {item.issueDate ? <p className="text-xs text-gray-500 mt-1">{item.issueDate}</p> : null}
                <p className="mt-3 text-sm text-gray-300 underline underline-offset-4">Preview</p>
              </button>
            );
          })}
        </div>
        <a
          href={linkedinUrl || certsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex mt-8 px-5 py-2.5 border border-gray-700 text-sm hover:border-cyan-500/60"
        >
          LinkedIn certifications
        </a>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setOpenId(null)}>
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-gray-950 border border-gray-800 p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{selected.issuer}</p>
            <h3 className="text-2xl font-semibold mt-2">{selected.title}</h3>
            {selected.issueDate ? <p className="text-sm text-gray-500 mt-1">{selected.issueDate}</p> : null}
            <div className="mt-5 bg-black min-h-64 flex items-center justify-center border border-gray-800">
              {isImage(src) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={src} alt={selected.title} className="max-h-[60vh] w-full object-contain" />
              ) : isPdf(src) ? (
                <iframe title={selected.title} src={src} className="w-full h-[60vh] bg-white" />
              ) : (
                <p className="text-sm text-gray-400 p-8 text-center">
                  Upload a certificate image or PDF in the dashboard for an on-site preview.
                </p>
              )}
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              {selected.credentialUrl ? (
                <a href={selected.credentialUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                  Open credential
                </a>
              ) : null}
              {selected.fileUrl ? (
                <a href={selected.fileUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline underline-offset-4">
                  Download file
                </a>
              ) : null}
              <button type="button" className="ml-auto text-gray-400" onClick={() => setOpenId(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
