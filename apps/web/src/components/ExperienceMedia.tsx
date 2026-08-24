"use client";

import { useState } from "react";
import { MediaLightbox } from "@/components/MediaLightbox";
import { SmartImage } from "@/components/SmartImage";

export function ExperienceMedia({
  company,
  urls,
}: {
  company: string;
  urls: string[];
}) {
  const media = urls.filter(Boolean);
  const [index, setIndex] = useState<number | null>(null);
  if (!media.length) return null;

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2">
        {media.map((url, itemIndex) => (
          <button
            key={`${url}-${itemIndex}`}
            type="button"
            onClick={() => setIndex(itemIndex)}
            className="relative h-20 w-28 overflow-hidden rounded-lg border border-gray-800 bg-[#1d2226] hover:border-gray-600"
            aria-label={`${company} document ${itemIndex + 1}`}
          >
            <SmartImage src={url} alt="" fill className="object-contain p-1" sizes="112px" />
          </button>
        ))}
      </div>
      {index !== null ? (
        <MediaLightbox
          items={media.map((url, itemIndex) => ({
            id: `${company}-${itemIndex}`,
            title: company,
            mediaUrl: url,
          }))}
          index={index}
          onClose={() => setIndex(null)}
          onIndex={setIndex}
        />
      ) : null}
    </>
  );
}
