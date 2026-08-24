import { Controller, Get, Inject, Param, Query, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { JwtGuard } from "./jwt.guard";
import { InternalKeyGuard } from "./security";
import { GetPortfolioQuery, GetProjectQuery, ListResourceQuery } from "./application/queries/queries";

@Controller()
@UseGuards(InternalKeyGuard)
export class QueryController {
  constructor(@Inject(QueryBus) private readonly queryBus: QueryBus) {}

  @Get("v1/portfolio")
  portfolio(@Query("category") category?: string) {
    return this.queryBus.execute(new GetPortfolioQuery(category));
  }

  @Get("v1/projects/:slug")
  project(@Param("slug") slug: string) {
    return this.queryBus.execute(new GetProjectQuery(slug));
  }

  @Get("v1/admin/:resource")
  @UseGuards(JwtGuard)
  list(@Param("resource") resource: string) {
    return this.queryBus.execute(new ListResourceQuery(resource));
  }
}
