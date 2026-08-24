import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  CreateCertificateCommand,
  DeleteCertificateCommand,
  ListCertificatesQuery,
  UpdateCertificateCommand,
} from "./messages";
import { InternalKeyGuard, JwtGuard } from "./security";

@Controller()
@UseGuards(InternalKeyGuard)
export class CertificatesController {
  constructor(
    @Inject(QueryBus) private readonly queryBus: QueryBus,
    @Inject(CommandBus) private readonly commandBus: CommandBus,
  ) {}

  @Get("v1/certificates")
  list() {
    return this.queryBus.execute(new ListCertificatesQuery());
  }

  @Post("v1/certificates")
  @UseGuards(JwtGuard)
  create(@Body() body: Record<string, unknown>) {
    return this.commandBus.execute(new CreateCertificateCommand(body));
  }

  @Put("v1/certificates/:id")
  @UseGuards(JwtGuard)
  update(@Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.commandBus.execute(new UpdateCertificateCommand(id, body));
  }

  @Delete("v1/certificates/:id")
  @UseGuards(JwtGuard)
  remove(@Param("id") id: string) {
    return this.commandBus.execute(new DeleteCertificateCommand(id));
  }
}
