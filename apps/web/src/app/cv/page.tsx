import type { Metadata } from "next";
import { PrintCvButton } from "@/components/PrintCvButton";
import { fetchPortfolio } from "@/lib/graphql";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Abdulrhman Ashraf | Senior Backend Software Engineer CV",
  robots: { index: false, follow: false },
};

const SKILL_GROUPS = ["Languages", "Frameworks", "Databases", "Tools & Concepts"];

export default async function CvPage() {
  const data = await fetchPortfolio();
  const profile = data.profile;
  if (!profile) return <main className="p-16">Content is not available yet.</main>;

  const linkedin = (data.settings?.linkedinUrl || "https://www.linkedin.com/in/abdulrahmanashraf98/")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const skills = SKILL_GROUPS.map((group) => ({
    group,
    items: (data.skills ?? [])
      .filter((item) => (item.group || "Tools & Concepts") === group)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((item) => item.name),
  })).filter((entry) => entry.items.length);
  const experiences = [...(data.experiences ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const projects = [...(data.projects ?? [])]
    .filter((item) => item.featured)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const educations = [...(data.educations ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <main className="min-h-screen bg-white text-[#222] font-sans">
      <PrintCvButton />
      <article className="mx-auto max-w-[816px] px-10 py-10 text-[12.5px] leading-[1.45]">
        <header className="text-center border-b-2 border-[#1b3a5f] pb-3">
          <h1 className="text-[26px] font-bold tracking-[0.08em] uppercase text-[#1b3a5f]">{profile.fullName}</h1>
          <p className="mt-1 text-[14px] font-semibold text-[#333]">{profile.headline}</p>
          <p className="mt-2 text-[11.5px] text-[#444]">
            {profile.location} | {profile.phone} | {profile.email} | {linkedin}
          </p>
        </header>

        <section className="mt-5">
          <h2 className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#1b3a5f] border-b border-[#1b3a5f] pb-1">
            Professional Summary
          </h2>
          <p className="mt-2 text-justify">{profile.summary}</p>
        </section>

        <section className="mt-5">
          <h2 className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#1b3a5f] border-b border-[#1b3a5f] pb-1">
            Technical Skills
          </h2>
          <div className="mt-2 space-y-1">
            {skills.map((entry) => (
              <p key={entry.group}>
                <span className="font-semibold">{entry.group}: </span>
                {entry.items.join(", ")}
              </p>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#1b3a5f] border-b border-[#1b3a5f] pb-1">
            Professional Experience
          </h2>
          <div className="mt-3 space-y-4">
            {experiences.map((item) => (
              <div key={item.id}>
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-bold">
                    {item.jobTitle} | {item.company}
                  </p>
                  <p className="font-semibold whitespace-nowrap">{item.dateRange}</p>
                </div>
                {item.focus ? <p className="italic text-[#444] mt-1">Core Focus: {item.focus}</p> : null}
                <ul className="mt-1 list-disc pl-5 space-y-0.5">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#1b3a5f] border-b border-[#1b3a5f] pb-1">
            Key Projects & Achievements
          </h2>
          <div className="mt-3 space-y-3">
            {projects.map((item) => (
              <div key={item.id}>
                <p className="font-bold">
                  {item.name}
                  {item.company ? ` (${item.company})` : ""}
                </p>
                <ul className="mt-1 list-disc pl-5 space-y-0.5">
                  {(item.bullets?.length ? item.bullets : item.description ? [item.description] : []).map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                {item.technologies.length ? (
                  <p className="mt-1">
                    <span className="font-semibold">Technologies: </span>
                    {item.technologies.join(", ")}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-5">
          <h2 className="text-[13px] font-bold tracking-[0.12em] uppercase text-[#1b3a5f] border-b border-[#1b3a5f] pb-1">
            Education
          </h2>
          <div className="mt-2 space-y-2">
            {educations.map((item) => (
              <div key={item.id}>
                <p className="font-bold">{item.degree}</p>
                <p>
                  {item.school}
                  {item.details?.[0] ? ` | ${item.details[0]}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
