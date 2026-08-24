import Image from "next/image";

export function SmartImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}) {
  if (!src) return null;
  const local = src.startsWith("/");
  if (local && fill) {
    return <Image src={src} alt={alt} fill className={className} sizes={sizes} priority={priority} />;
  }
  if (local && width && height) {
    return (
      <Image src={src} alt={alt} width={width} height={height} className={className} priority={priority} />
    );
  }
  return (
    // User-uploaded Blob / files-service URLs are not always known at build time.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className}
    />
  );
}
