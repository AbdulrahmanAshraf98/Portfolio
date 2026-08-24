import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserType {
  @Field()
  id: string;
  @Field()
  email: string;
  @Field()
  role: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;
  @Field(() => UserType)
  user: UserType;
}

@ObjectType()
export class ProfileType {
  @Field()
  id: string;
  @Field()
  fullName: string;
  @Field()
  logoText: string;
  @Field()
  headline: string;
  @Field()
  summary: string;
  @Field()
  about: string;
  @Field()
  location: string;
  @Field()
  email: string;
  @Field()
  phone: string;
  @Field()
  cvUrl: string;
  @Field()
  imageUrl: string;
  @Field()
  imageLazyUrl: string;
}

@ObjectType()
export class ExperienceType {
  @Field()
  id: string;
  @Field()
  jobTitle: string;
  @Field()
  company: string;
  @Field()
  dateRange: string;
  @Field({ nullable: true })
  focus?: string;
  @Field(() => [String])
  bullets: string[];
  @Field()
  sortOrder: number;
}

@ObjectType()
export class EducationType {
  @Field()
  id: string;
  @Field()
  degree: string;
  @Field()
  school: string;
  @Field()
  dateRange: string;
  @Field(() => [String])
  details: string[];
  @Field()
  sortOrder: number;
}

@ObjectType()
export class SkillType {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field(() => String)
  group: string;
  @Field()
  iconUrl: string;
  @Field()
  shadowColor: string;
  @Field()
  shadowColorHover: string;
  @Field()
  sortOrder: number;
}

@ObjectType()
export class ProjectType {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  slug: string;
  @Field()
  description: string;
  @Field({ nullable: true })
  company?: string;
  @Field(() => [String], { nullable: true })
  bullets?: string[];
  @Field()
  imageUrl: string;
  @Field()
  lazyImageUrl: string;
  @Field()
  liveUrl: string;
  @Field()
  githubUrl: string;
  @Field()
  videoUrl: string;
  @Field(() => [String])
  technologies: string[];
  @Field(() => [String])
  categories: string[];
  @Field()
  featured: boolean;
  @Field()
  published: boolean;
  @Field()
  sortOrder: number;
}

@ObjectType()
export class SocialLinkType {
  @Field()
  id: string;
  @Field()
  name: string;
  @Field()
  url: string;
  @Field()
  sortOrder: number;
}

@ObjectType()
export class ContactType {
  @Field()
  id: string;
  @Field()
  title: string;
  @Field()
  info: string;
  @Field()
  sortOrder: number;
}

@ObjectType()
export class CertificateType {
  @Field()
  id: string;
  @Field()
  title: string;
  @Field()
  issuer: string;
  @Field()
  issueDate: string;
  @Field({ nullable: true })
  credentialUrl?: string;
  @Field({ nullable: true })
  imageUrl?: string;
  @Field({ nullable: true })
  fileUrl?: string;
  @Field()
  sortOrder: number;
}

@ObjectType()
export class HighlightType {
  @Field()
  id: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  subtitle?: string;
  @Field({ nullable: true })
  description?: string;
  @Field({ nullable: true })
  date?: string;
  @Field({ nullable: true })
  mediaUrl?: string;
  @Field({ nullable: true })
  fileUrl?: string;
  @Field({ nullable: true })
  linkUrl?: string;
  @Field()
  sortOrder: number;
}

@ObjectType()
export class SettingsType {
  @Field()
  signatureText: string;
  @Field()
  linkedinUrl: string;
  @Field()
  xUrl: string;
  @Field(() => [String])
  sectionOrder: string[];
}

@ObjectType()
export class PortfolioType {
  @Field(() => ProfileType, { nullable: true })
  profile?: ProfileType;
  @Field(() => [ExperienceType])
  experiences: ExperienceType[];
  @Field(() => [EducationType])
  educations: EducationType[];
  @Field(() => [SkillType])
  skills: SkillType[];
  @Field(() => [ProjectType])
  projects: ProjectType[];
  @Field(() => [SocialLinkType])
  socialLinks: SocialLinkType[];
  @Field(() => [ContactType])
  contacts: ContactType[];
  @Field(() => [HighlightType])
  highlights: HighlightType[];
  @Field(() => [CertificateType])
  certificates: CertificateType[];
  @Field(() => SettingsType)
  settings: SettingsType;
}

@ObjectType()
export class DeleteResult {
  @Field()
  ok: boolean;
}

@ObjectType()
export class ClientKeyType {
  @Field()
  id: string;
  @Field()
  prefix: string;
  @Field()
  createdAt: string;
  @Field({ nullable: true })
  revokedAt?: string | null;
  @Field({ nullable: true })
  key?: string;
}
