import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { PortfolioData, ResourceKey } from "../../entities";
import { jsonStore } from "../../infrastructure/json.store";
import { GetPortfolioQuery, GetProjectQuery, ListResourceQuery } from "../queries/queries";

@QueryHandler(GetPortfolioQuery)
export class GetPortfolioHandler implements IQueryHandler<GetPortfolioQuery> {
  async execute(query: GetPortfolioQuery) {
    await pullWriteModel();
    return jsonStore.portfolio(query.category);
  }
}

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery> {
  async execute(query: GetProjectQuery) {
    await pullWriteModel();
    return jsonStore.portfolio().projects.find((item) => item.slug === query.slug) ?? null;
  }
}

@QueryHandler(ListResourceQuery)
export class ListResourceHandler implements IQueryHandler<ListResourceQuery> {
  async execute(query: ListResourceQuery) {
    await pullWriteModel();
    return jsonStore.list(query.resource as ResourceKey);
  }
}

async function pullWriteModel() {
  const commandUrl = process.env.COMMAND_URL ?? (process.env.VERCEL ? "https://aa-catalog-command.vercel.app" : "");
  const secret = process.env.INTERNAL_API_SECRET ?? "";
  if (!commandUrl) return;
  try {
    const response = await fetch(`${commandUrl.replace(/\/$/, "")}/internal/snapshot`, {
      headers: { "x-internal-key": secret },
    });
    if (!response.ok) return;
    const snapshot = (await response.json()) as PortfolioData;
    if (!snapshot?.profile) return;
    jsonStore.replace({ ...snapshot, highlights: snapshot.highlights ?? [] });
  } catch {
    return;
  }
}

export const QueryHandlers = [GetPortfolioHandler, GetProjectHandler, ListResourceHandler];
