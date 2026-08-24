export type Profile = {
  id: string;
  fullName: string;
  logoText: string;
  headline: string;
  summary: string;
  about: string;
  location: string;
  email: string;
  phone: string;
  cvUrl: string;
  imageUrl: string;
  imageLazyUrl: string;
};

export type Experience = {
  id: string;
  jobTitle: string;
  company: string;
  dateRange: string;
  focus?: string;
  bullets: string[];
  mediaUrls?: string[];
  sortOrder?: number;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  dateRange: string;
  details: string[];
  sortOrder?: number;
};

export type Skill = {
  id: string;
  name: string;
  group?: string;
  iconUrl: string;
  shadowColor: string;
  shadowColorHover: string;
  sortOrder?: number;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  company?: string;
  bullets?: string[];
  imageUrl: string;
  lazyImageUrl: string;
  liveUrl: string;
  githubUrl: string;
  videoUrl: string;
  technologies: string[];
  categories: string[];
  featured: boolean;
  published?: boolean;
  sortOrder?: number;
};

export type SocialLink = { id: string; name: string; url: string; sortOrder?: number };
export type Contact = { id: string; title: string; info: string; sortOrder?: number };
export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl: string;
  imageUrl: string;
  fileUrl: string;
  sortOrder?: number;
};
export type Highlight = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  mediaUrl: string;
  fileUrl: string;
  linkUrl: string;
  sortOrder?: number;
};
export type Settings = { signatureText: string; linkedinUrl: string; xUrl: string; sectionOrder?: string[] };

export type Portfolio = {
  profile: Profile | null;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  projects: Project[];
  socialLinks: SocialLink[];
  contacts: Contact[];
  highlights: Highlight[];
  certificates: Certificate[];
  settings: Settings;
};
