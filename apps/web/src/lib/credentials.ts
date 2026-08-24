export function driveId(url?: string) {
  if (!url) return "";
  return url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] ?? "";
}

export function driveThumb(url?: string) {
  const id = driveId(url);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1600` : "";
}

export function driveEmbed(url?: string) {
  const id = driveId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : "";
}

export function issuerLogo(issuer?: string) {
  const key = (issuer ?? "").toLowerCase();
  const domain =
    key.includes("udemy") ? "udemy.com"
    : key.includes("google") ? "google.com"
    : key.includes("datacamp") ? "datacamp.com"
    : key.includes("udacity") ? "udacity.com"
    : key.includes("cognitive") || key.includes("ibm") ? "ibm.com"
    : key.includes("orange") ? "orange.com"
    : key.includes("coursera") ? "coursera.org"
    : "";
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : "";
}

export function isImageUrl(url?: string) {
  return Boolean(url && /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(url));
}

export function isPdfUrl(url?: string) {
  return Boolean(url && /\.pdf(\?|$)/i.test(url));
}
