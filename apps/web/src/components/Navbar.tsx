"use client";

import { useCallback, useState, type ReactNode } from "react";
import { FaBars, FaGithub, FaLinkedin, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import type { SocialLink } from "@/lib/types";

const ICONS: Record<string, ReactNode> = {
  github: <FaGithub size={20} />,
  linkedin: <FaLinkedin size={20} />,
  x: <FaXTwitter size={20} />,
  gmail: <SiGmail size={20} />,
};

export function Navbar({
  signature,
  socialLinks,
  links = ["Home", "Skills", "Experience", "Projects", "Education", "Featured", "Certificates"],
}: {
  signature: string;
  socialLinks: SocialLink[];
  links?: string[];
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  const visibleSocials = socialLinks.filter((item) => item.url);

  return (
    <nav className="w-full h-20 sticky top-0 bg-black/90 backdrop-blur text-white z-30">
      <div className="container m-auto h-full px-8 lg:px-16">
        <div className="flex justify-between items-center h-full">
          <a href="#Home" className="text-4xl font-signature tracking-wide">
            {signature}
          </a>
          <ul className="hidden md:flex ml-auto">
            {links.map((link) => (
              <li key={link} className="p-3 capitalize font-medium text-sm text-gray-300 hover:text-white duration-200">
                <a href={`#${link}`}>{link}</a>
              </li>
            ))}
          </ul>
          <div className="hidden md:flex gap-3 items-center">
            {visibleSocials.map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noreferrer" aria-label={item.name}>
                {ICONS[item.name] ?? item.name}
              </a>
            ))}
          </div>
          <button className="md:hidden text-gray-100 z-30" onClick={toggle} aria-label="Menu">
            {open ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
          {open ? (
            <ul className="flex flex-col justify-center items-center absolute w-full h-screen top-0 left-0 bg-gradient-to-b from-black to-gray-800">
              {links.map((link) => (
                <li key={link} className="p-5 text-3xl text-gray-300">
                  <a href={`#${link}`} onClick={toggle}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
