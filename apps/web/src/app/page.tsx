import type { Metadata } from "next";
import { Contact, EducationList, ExperienceList, Featured, Skills } from "@/components/Sections";
import { CertificatePreview } from "@/components/CertificatePreview";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { fetchPortfolio } from "@/lib/graphql";
import type { Portfolio } from "@/lib/types";

export const dynamic = "force-dynamic";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aa-web-abdulrahmanashraf98s-projects.vercel.app";
const DEFAULT_SECTIONS = ["skills", "experience", "projects", "education", "featured", "certificates", "earlier"];

const NAV: Record<string, string> = {
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  featured: "Featured",
  certificates: "Certificates",
  earlier: "Earlier",
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchPortfolio();
    const title = `${data.profile?.fullName ?? "Abdulrhman Ashraf"} | Senior Backend Software Engineer`;
    const description = data.profile?.summary;
    const image = data.profile?.imageUrl
      ? data.profile.imageUrl.startsWith("http")
        ? data.profile.imageUrl
        : `${SITE}${data.profile.imageUrl}`
      : undefined;
    return {
      title,
      description,
      alternates: { canonical: SITE },
      openGraph: {
        type: "profile",
        title,
        description,
        url: SITE,
        images: image ? [{ url: image }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: "Abdulrhman Ashraf | Senior Backend Software Engineer", alternates: { canonical: SITE } };
  }
}

function byOrder<T extends { sortOrder?: number }>(items: T[]) {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

function renderSection(key: string, data: Portfolio) {
  const keyProjects = byOrder((data.projects ?? []).filter((item) => item.featured));
  const earlier = byOrder((data.projects ?? []).filter((item) => !item.featured));
  switch (key) {
    case "skills":
      return <Skills key={key} skills={byOrder(data.skills ?? [])} />;
    case "experience":
      return <ExperienceList key={key} experiences={byOrder(data.experiences ?? [])} />;
    case "projects":
      return (
        <PortfolioGrid
          key={key}
          id="Projects"
          title="Key projects"
          projects={keyProjects}
        />
      );
    case "education":
      return <EducationList key={key} educations={byOrder(data.educations ?? [])} />;
    case "featured":
      return (
        <Featured
          key={key}
          highlights={byOrder(data.highlights ?? [])}
          linkedinUrl="https://www.linkedin.com/in/abdulrahmanashraf98/details/featured/"
        />
      );
    case "certificates":
      return (
        <CertificatePreview
          key={key}
          certificates={byOrder(data.certificates ?? [])}
          linkedinUrl={data.settings?.linkedinUrl ?? ""}
        />
      );
    case "earlier":
      return (
        <PortfolioGrid
          key={key}
          id="Earlier"
          title="Earlier work"
          projects={earlier}
        />
      );
    default:
      return null;
  }
}

export default async function HomePage() {
  const data = await fetchPortfolio();
  if (!data.profile) {
    return <main className="p-16">Content is not available yet.</main>;
  }
  const signature = data.settings?.signatureText || data.profile.logoText || "AS";
  const sectionOrder = (data.settings?.sectionOrder?.length ? data.settings.sectionOrder : DEFAULT_SECTIONS).map(
    (item) => item.trim().toLowerCase(),
  );
  const navLinks = ["Home", ...sectionOrder.map((key) => NAV[key]).filter(Boolean)];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.profile.fullName,
    jobTitle: data.profile.headline,
    email: data.profile.email,
    telephone: data.profile.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cairo",
      addressCountry: "EG",
    },
    url: SITE,
    image: data.profile.imageUrl?.startsWith("http") ? data.profile.imageUrl : `${SITE}${data.profile.imageUrl}`,
    sameAs: (data.socialLinks ?? []).map((item) => item.url).filter((url) => url && !url.startsWith("mailto:")),
    description: data.profile.summary,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar signature={signature} socialLinks={data.socialLinks} links={navLinks} />
      <Hero profile={data.profile} signature={signature} />
      {sectionOrder.map((key) => renderSection(key, data))}
      <Contact profile={data.profile} />
      <footer className="py-10 text-center text-gray-600 bg-black border-t border-gray-900">
        <p className="font-signature text-4xl text-cyan-400">{signature}</p>
        <p className="mt-2 text-sm">{data.profile.fullName} · Senior Backend Software Engineer</p>
      </footer>
    </main>
  );
}
