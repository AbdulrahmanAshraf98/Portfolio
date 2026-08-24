import type { Project } from "@/lib/types";
import { SmartImage } from "./SmartImage";

export function PortfolioGrid({
  projects,
  id,
  title,
  intro,
}: {
  projects: Project[];
  id: string;
  title: string;
  intro?: string;
}) {
  if (!projects.length) return null;

  return (
    <section id={id} className="py-12 md:py-16 bg-black text-white">
      <div className="container m-auto px-8 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-semibold mt-3 border-b border-gray-800 pb-4">{title}</h2>
        {intro ? <p className="text-gray-400 mt-6 max-w-3xl text-sm leading-relaxed">{intro}</p> : null}
        <div className={`grid gap-8 mt-10 ${id === "Projects" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
          {projects.map((project) => (
            <article key={project.id} className="border border-gray-800 bg-black/40 flex flex-col">
              {project.imageUrl ? (
                <div className="h-56 w-full relative overflow-hidden bg-gray-900">
                  <SmartImage
                    src={project.imageUrl}
                    alt={project.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              <div className="p-5 flex flex-col grow">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                {project.description ? (
                  <p className="text-sm text-gray-400 mt-3 leading-relaxed">{project.description}</p>
                ) : null}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-xs text-gray-400 border border-gray-800 px-2 py-1">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex gap-4 text-sm text-gray-300">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                      Live
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                      Code
                    </a>
                  ) : null}
                  {project.videoUrl ? (
                    <a href={project.videoUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                      Video
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
