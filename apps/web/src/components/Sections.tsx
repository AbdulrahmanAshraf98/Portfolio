import type { ReactNode } from "react";
import type { Education, Experience, Profile, Skill } from "@/lib/types";
import { ExperienceMedia } from "./ExperienceMedia";
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
  children,
}: {
  date: string;
  title: string;
  subtitle: string;
  content: string[];
  children?: ReactNode;
}) {
  return (
    <article className="relative border-l border-gray-800 pb-10 pl-6 last:pb-0">
      <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-500/80" />
      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{date}</p>
      <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      <p className="mt-1 text-cyan-400/90">{subtitle}</p>
      <ul className="mt-4 space-y-2">
        {content.map((item) => (
          <li className="text-sm leading-relaxed text-gray-400" key={item}>
            {item}
          </li>
        ))}
      </ul>
      {children}
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
            >
              <ExperienceMedia company={item.company} urls={item.mediaUrls ?? []} />
            </Timeline>
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
