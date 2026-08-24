import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { certificatesClient, commandClient, identityClient, queryClient } from "../clients/http";
import { InternalKeyGuard } from "../security";
import {
  AuthPayload,
  CertificateType,
  ClientKeyType,
  ContactType,
  DeleteResult,
  EducationType,
  ExperienceType,
  HighlightType,
  PortfolioType,
  ProfileType,
  ProjectType,
  SettingsType,
  SkillType,
  SocialLinkType,
  UserType,
} from "./types";

type GqlContext = { token?: string };

function requireToken(ctx: GqlContext) {
  if (!ctx.token) throw new Error("Unauthorized");
  return ctx.token;
}

@Resolver()
@UseGuards(InternalKeyGuard)
export class PortfolioResolver {
  @Query(() => String)
  health() {
    return "graphql-gateway";
  }

  @Query(() => PortfolioType)
  async portfolio(
    @Args("category", { type: () => String, nullable: true }) category?: string,
  ) {
    const data = (await queryClient.portfolio(category)) as Record<string, unknown>;
    let certificates: unknown[] = [];
    try {
      certificates = (await certificatesClient.list()) as unknown[];
    } catch {
      certificates = [];
    }
    return { highlights: [], ...data, certificates };
  }

  @Query(() => ProfileType, { nullable: true })
  async profile() {
    const data = (await this.portfolio()) as unknown as { profile?: ProfileType };
    return data.profile ?? null;
  }

  @Query(() => [ExperienceType])
  async experiences() {
    const data = (await this.portfolio()) as unknown as { experiences: ExperienceType[] };
    return data.experiences ?? [];
  }

  @Query(() => [EducationType])
  async educations() {
    const data = (await this.portfolio()) as unknown as { educations: EducationType[] };
    return data.educations ?? [];
  }

  @Query(() => [SkillType])
  async skills() {
    const data = (await this.portfolio()) as unknown as { skills: SkillType[] };
    return data.skills ?? [];
  }

  @Query(() => [ProjectType])
  async projects() {
    const data = (await this.portfolio()) as unknown as { projects: ProjectType[] };
    return data.projects ?? [];
  }

  @Query(() => [SocialLinkType])
  async socialLinks() {
    const data = (await this.portfolio()) as unknown as { socialLinks: SocialLinkType[] };
    return data.socialLinks ?? [];
  }

  @Query(() => [ContactType])
  async contacts() {
    const data = (await this.portfolio()) as unknown as { contacts: ContactType[] };
    return data.contacts ?? [];
  }

  @Query(() => [HighlightType])
  async highlights() {
    const data = (await this.portfolio()) as unknown as { highlights: HighlightType[] };
    return data.highlights ?? [];
  }

  @Query(() => [CertificateType])
  async certificates() {
    try {
      return (await certificatesClient.list()) as CertificateType[];
    } catch {
      return [];
    }
  }

  @Query(() => SettingsType)
  async settings() {
    const data = (await this.portfolio()) as unknown as { settings: SettingsType };
    return data.settings;
  }

  @Query(() => ProjectType, { nullable: true })
  project(@Args("slug", { type: () => String }) slug: string) {
    return queryClient.project(slug);
  }

  @Mutation(() => AuthPayload)
  login(
    @Args("email", { type: () => String }) email: string,
    @Args("password", { type: () => String }) password: string,
  ) {
    return identityClient.login(email, password);
  }

  @Query(() => UserType)
  me(@Context() ctx: GqlContext) {
    return identityClient.me(requireToken(ctx));
  }

  @Mutation(() => DeleteResult)
  changePassword(
    @Args("currentPassword", { type: () => String }) currentPassword: string,
    @Args("newPassword", { type: () => String }) newPassword: string,
    @Context() ctx: GqlContext,
  ) {
    return identityClient.changePassword(requireToken(ctx), currentPassword, newPassword);
  }

  @Query(() => [ClientKeyType])
  listClientKeys(@Context() ctx: GqlContext) {
    return identityClient.listKeys(requireToken(ctx));
  }

  @Mutation(() => ClientKeyType)
  rotateClientKey(@Context() ctx: GqlContext) {
    return identityClient.createKey(requireToken(ctx));
  }

  @Mutation(() => DeleteResult)
  revokeClientKey(@Args("id", { type: () => String }) id: string, @Context() ctx: GqlContext) {
    return identityClient.revokeKey(requireToken(ctx), id);
  }

  @Query(() => [GraphQLJSONObject])
  adminList(@Args("resource", { type: () => String }) resource: string, @Context() ctx: GqlContext) {
    const token = requireToken(ctx);
    if (resource === "certificates") return certificatesClient.adminList(token);
    return queryClient.list(resource, token);
  }

  @Mutation(() => GraphQLJSONObject)
  adminCreate(
    @Args("resource", { type: () => String }) resource: string,
    @Args("input", { type: () => GraphQLJSONObject }) input: Record<string, unknown>,
    @Context() ctx: GqlContext,
  ) {
    const token = requireToken(ctx);
    if (resource === "certificates") return certificatesClient.create(token, input);
    return commandClient.create(resource, token, input);
  }

  @Mutation(() => GraphQLJSONObject)
  adminUpdate(
    @Args("resource", { type: () => String }) resource: string,
    @Args("id", { type: () => String }) id: string,
    @Args("input", { type: () => GraphQLJSONObject }) input: Record<string, unknown>,
    @Context() ctx: GqlContext,
  ) {
    const token = requireToken(ctx);
    if (resource === "certificates") return certificatesClient.update(id, token, input);
    return commandClient.update(resource, id, token, input);
  }

  @Mutation(() => DeleteResult)
  adminDelete(
    @Args("resource", { type: () => String }) resource: string,
    @Args("id", { type: () => String }) id: string,
    @Context() ctx: GqlContext,
  ) {
    const token = requireToken(ctx);
    if (resource === "certificates") return certificatesClient.remove(id, token);
    return commandClient.remove(resource, id, token);
  }
}
