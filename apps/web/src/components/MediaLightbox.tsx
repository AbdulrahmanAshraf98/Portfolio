"use client";

import { useEffect } from "react";

export type MediaItem = {
  id: string;
  title: string;
  description?: string;
  mediaUrl: string;
};

export function MediaLightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onIndex: (next: number) => void;
}) {
  const item = items[index];
  const hasPrev = index > 0;
  const hasNext = index < items.length - 1;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasPrev) onIndex(index - 1);
      if (event.key === "ArrowRight" && hasNext) onIndex(index + 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasNext, hasPrev, index, onClose, onIndex]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 md:p-8" onClick={onClose}>
      <div
        className="flex h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 px-4">
            <p className="text-sm font-semibold text-gray-900">Media</p>
            <button type="button" className="px-2 text-xl leading-none text-gray-500 hover:text-black" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center bg-[#1d2226] p-4 md:p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.mediaUrl} alt={item.title} className="max-h-full max-w-full bg-white object-contain shadow-lg" />
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-500 md:hidden">
            <button type="button" disabled={!hasPrev} className="disabled:opacity-30" onClick={() => onIndex(index - 1)}>
              Previous
            </button>
            <p className="mx-3 truncate text-center text-gray-800">{item.title}</p>
            <button type="button" disabled={!hasNext} className="disabled:opacity-30" onClick={() => onIndex(index + 1)}>
              Next
            </button>
          </div>
        </div>
        <aside className="hidden w-80 shrink-0 flex-col border-l border-gray-200 bg-white md:flex">
          <div className="flex-1 overflow-auto p-5">
            <h3 className="text-base font-semibold leading-snug text-gray-900">{item.title}</h3>
            {item.description ? <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">{item.description}</p> : null}
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3 text-sm text-gray-500">
            <button type="button" disabled={!hasPrev} className="disabled:opacity-30 hover:text-gray-900" onClick={() => onIndex(index - 1)}>
              Previous
            </button>
            <button type="button" disabled={!hasNext} className="disabled:opacity-30 hover:text-gray-900" onClick={() => onIndex(index + 1)}>
              Next
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
