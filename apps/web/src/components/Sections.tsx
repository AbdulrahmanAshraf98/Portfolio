import type { Education, Experience, Highlight, Profile, Skill } from "@/lib/types";
import { SmartImage } from "./SmartImage";

const SKILL_GROUP_ORDER = ["Languages", "Frameworks", "Databases", "Tools & Concepts"];

export function Skills({ skills }: { skills: Skill[] }) {
  const grouped = SKILL_GROUP_ORDER.map((group) => ({
    group,
    items: skills
      .filter((item) => (item.group || "Tools & Concepts") === group)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
  })).filter((entry) => entry.items.length);
  const extra = skills.filter((item) => !SKILL_GROUP_ORDER.includes(item.group || "Tools & Concepts"));
  if (extra.length) grouped.push({ group: "Other", items: extra });

  return (
    <section id="Skills" className="py-12 md:py-16 w-full bg-black text-white">
      <div className="container m-auto px-8 lg:px-16">
        <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Technical skills</p>
        <h2 className="text-3xl md:text-4xl font-semibold mt-3 border-b border-gray-800 pb-4">Skills</h2>
        <div className="mt-10 space-y-8 max-w-4xl">
          {grouped.map((entry) => (
            <div key={entry.group}>
              <h3 className="text-sm font-medium text-cyan-400/90 mb-3">{entry.group}</h3>
              <p className="text-gray-300 leading-relaxed">{entry.items.map((item) => item.name).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline({
  date,
  title,
  subtitle,
  content,
}: {
  date: string;
  title: string;
  subtitle: string;
  content: string[];
}) {
  return (
    <article className="relative pl-6 border-l border-gray-800 pb-10 last:pb-0">
      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-500/80" />
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{date}</p>
      <h3 className="text-xl font-semibold mt-2">{title}</h3>
      <p className="text-cyan-400/90 mt-1">{subtitle}</p>
      <ul className="mt-4 space-y-2">
        {content.map((item) => (
          <li className="text-sm text-gray-400 leading-relaxed" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ExperienceList({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="Experience" className="py-12 md:py-16 w-full bg-gradient-to-b from-black to-gray-950 text-white">
      <div className="container m-auto px-8 lg:px-16">
        <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Career</p>
        <h2 className="text-3xl md:text-4xl font-semibold mt-3 border-b border-gray-800 pb-4">Experience</h2>
        <div className="mt-12 max-w-4xl">
          {experiences.map((item) => (
            <Timeline
              key={item.id}
              date={item.dateRange}
              title={item.jobTitle}
              subtitle={item.company}
              content={item.bullets}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function EducationList({ educations }: { educations: Education[] }) {
  return (
    <section id="Education" className="py-12 md:py-16 w-full bg-black text-white">
      <div className="container m-auto px-8 lg:px-16">
        <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Academic</p>
        <h2 className="text-3xl md:text-4xl font-semibold mt-3 border-b border-gray-800 pb-4">Education</h2>
        <div className="mt-12 max-w-4xl">
          {educations.map((item) => (
            <Timeline
              key={item.id}
              date={item.dateRange}
              title={item.degree}
              subtitle={item.school}
              content={item.details}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Featured({
  highlights,
  linkedinUrl,
}: {
  highlights: Highlight[];
  linkedinUrl: string;
}) {
  return (
    <section id="Featured" className="py-12 md:py-16 w-full bg-gray-950 text-white">
      <div className="container m-auto px-8 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-semibold mt-3 border-b border-gray-800 pb-4">Featured</h2>
        {highlights.length ? (
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {highlights.map((item) => (
              <article key={item.id} className="border border-gray-800 bg-black/40 overflow-hidden flex flex-col sm:flex-row">
                {item.mediaUrl ? (
                  <div className="relative sm:w-48 h-40 shrink-0 bg-gray-900">
                    <SmartImage src={item.mediaUrl} alt={item.title} fill className="object-cover" sizes="192px" />
                  </div>
                ) : null}
                <div className="p-5 flex flex-col">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  {item.subtitle ? <p className="text-cyan-400/90 mt-1 text-sm">{item.subtitle}</p> : null}
                  {item.date ? <p className="text-xs text-gray-500 mt-1">{item.date}</p> : null}
                  {item.description ? <p className="text-sm text-gray-400 mt-3 leading-relaxed">{item.description}</p> : null}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    {item.linkUrl ? (
                      <a href={item.linkUrl} target="_blank" rel="noreferrer" className="text-gray-200 underline underline-offset-4">
                        Open
                      </a>
                    ) : null}
                    {item.fileUrl ? (
                      <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-cyan-400 underline underline-offset-4">
                        File
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
        {linkedinUrl ? (
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-8 px-5 py-2.5 border border-gray-700 text-sm hover:border-cyan-500/60"
          >
            LinkedIn Featured
          </a>
        ) : null}
      </div>
    </section>
  );
}

export function Contact({
  profile,
}: {
  profile: Profile;
}) {
  return (
    <section id="Contact" className="py-12 w-full bg-gray-950 text-white border-t border-gray-900">
      <div className="container m-auto px-8 lg:px-16 text-sm text-gray-400">
        <p>
          {profile.location} · {profile.email} · {profile.phone}
        </p>
      </div>
    </section>
  );
}
