export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "list" | "boolean" | "number" | "file";
  accept?: string;
  hidden?: boolean;
};

export const RESOURCE_SCHEMA: Record<string, { label: string; singleton?: boolean; fields: Field[] }> = {
  profiles: {
    label: "Profile",
    singleton: true,
    fields: [
      { key: "fullName", label: "Full name", type: "text" },
      { key: "logoText", label: "Signature text", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "about", label: "About", type: "textarea" },
      { key: "location", label: "Location", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "cvUrl", label: "CV file", type: "file", accept: ".pdf,application/pdf" },
      { key: "imageUrl", label: "Photo", type: "file", accept: "image/*" },
      { key: "imageLazyUrl", label: "Lazy photo", type: "file", accept: "image/*" },
    ],
  },
  highlights: {
    label: "Featured / achievements",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle / company", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "date", label: "Date", type: "text" },
      { key: "mediaUrl", label: "Cover image", type: "file", accept: "image/*" },
      { key: "fileUrl", label: "Attached file", type: "file" },
      { key: "linkUrl", label: "External link", type: "url" },
      { key: "sortOrder", label: "Order", type: "number", hidden: true },
    ],
  },
  settings: {
    label: "Site settings",
    singleton: true,
    fields: [
      { key: "signatureText", label: "Signature", type: "text" },
      { key: "linkedinUrl", label: "LinkedIn URL", type: "url" },
      { key: "xUrl", label: "X URL", type: "url" },
      {
        key: "sectionOrder",
        label: "Page sections — drag to reorder",
        type: "list",
      },
    ],
  },
  experiences: {
    label: "Experience",
    fields: [
      { key: "jobTitle", label: "Title", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "dateRange", label: "Dates", type: "text" },
      { key: "focus", label: "Core focus (CV line)", type: "textarea" },
      { key: "bullets", label: "Bullets (one per line)", type: "list" },
      { key: "mediaUrls", label: "Media images (one URL per line)", type: "list" },
      { key: "sortOrder", label: "Order", type: "number", hidden: true },
    ],
  },
  educations: {
    label: "Education",
    fields: [
      { key: "degree", label: "Degree", type: "text" },
      { key: "school", label: "School", type: "text" },
      { key: "dateRange", label: "Dates", type: "text" },
      { key: "details", label: "Details (one per line)", type: "list" },
      { key: "sortOrder", label: "Order", type: "number", hidden: true },
    ],
  },
  skills: {
    label: "Skills",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "group", label: "Group (Languages, Frameworks, Databases, Tools & Concepts)", type: "text" },
      { key: "iconUrl", label: "Icon (optional)", type: "file", accept: "image/*" },
      { key: "shadowColor", label: "Shadow class", type: "text" },
      { key: "shadowColorHover", label: "Hover shadow class", type: "text" },
      { key: "sortOrder", label: "Order", type: "number", hidden: true },
    ],
  },
  projects: {
    label: "Projects",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "company", label: "Company (CV)", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "bullets", label: "CV bullets (one per line)", type: "list" },
      { key: "imageUrl", label: "Image", type: "file", accept: "image/*" },
      { key: "lazyImageUrl", label: "Lazy image", type: "file", accept: "image/*" },
      { key: "liveUrl", label: "Live URL", type: "url" },
      { key: "githubUrl", label: "GitHub URL", type: "url" },
      { key: "videoUrl", label: "Video URL", type: "url" },
      { key: "technologies", label: "Technologies (comma separated)", type: "list" },
      { key: "categories", label: "Categories (comma separated)", type: "list" },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "published", label: "Published", type: "boolean" },
      { key: "sortOrder", label: "Order", type: "number", hidden: true },
    ],
  },
  certificates: {
    label: "Certificates",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "issueDate", label: "Issue date", type: "text" },
      { key: "credentialUrl", label: "Credential / LinkedIn URL", type: "url" },
      { key: "imageUrl", label: "Certificate image", type: "file", accept: "image/*" },
      { key: "fileUrl", label: "Certificate file", type: "file" },
      { key: "sortOrder", label: "Order", type: "number", hidden: true },
    ],
  },
  socials: {
    label: "Social links",
    fields: [
      { key: "name", label: "Name (github, linkedin, x, gmail)", type: "text" },
      { key: "url", label: "URL", type: "url" },
      { key: "sortOrder", label: "Order", type: "number", hidden: true },
    ],
  },
  contacts: {
    label: "Contact",
    fields: [
      { key: "title", label: "Label", type: "text" },
      { key: "info", label: "Value", type: "text" },
      { key: "sortOrder", label: "Order", type: "number", hidden: true },
    ],
  },
};
