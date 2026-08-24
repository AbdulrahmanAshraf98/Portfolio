import { MdKeyboardArrowRight } from "react-icons/md";
import type { Profile } from "@/lib/types";
import { SmartImage } from "./SmartImage";

export function Hero({ profile, signature }: { profile: Profile; signature: string }) {
  return (
    <section id="Home" className="w-full bg-black py-12 md:py-20">
      <div className="container m-auto px-8 lg:px-16">
        <div className="flex flex-wrap justify-between items-center gap-12">
          <div className="w-full md:w-6/12 text-gray-200 order-2 md:order-1">
            <p className="font-signature text-5xl text-cyan-400 mb-6">{signature}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">{profile.fullName}</h1>
            <h2 className="text-lg sm:text-xl text-gray-300 mt-3">{profile.headline}</h2>
            <p className="text-sm text-gray-500 mt-4">
              {profile.location} · {profile.email} · {profile.phone}
            </p>
            <p className="text-base text-gray-400 py-8 max-w-2xl leading-relaxed">{profile.summary}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#Experience"
                className="group text-sm text-white px-5 py-2.5 flex items-center rounded-sm bg-cyan-700 hover:bg-cyan-600"
              >
                Experience
                <span className="group-hover:translate-x-0.5 duration-200">
                  <MdKeyboardArrowRight size={20} />
                </span>
              </a>
              <a
                href="/cv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white px-5 py-2.5 rounded-sm border border-gray-700 hover:border-cyan-500/60"
              >
                Download CV
              </a>
            </div>
          </div>
          <div className="w-full md:w-5/12 order-1 md:order-2">
            <div className="overflow-hidden border border-gray-800 bg-gray-950">
              <SmartImage
                src={profile.imageUrl}
                alt={profile.fullName}
                width={720}
                height={720}
                priority
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
