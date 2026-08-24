import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtGuard } from "./jwt.guard";
import { InternalKeyGuard } from "./security";
import { jsonStore } from "./infrastructure/json.store";
import {
  CreateResourceCommand,
  DeleteResourceCommand,
  UpdateResourceCommand,
} from "./application/commands/commands";

@Controller()
@UseGuards(InternalKeyGuard)
export class CommandController {
  constructor(@Inject(CommandBus) private readonly commandBus: CommandBus) {}

  @Get("internal/snapshot")
  async snapshot() {
    await jsonStore.syncFromBlob();
    return jsonStore.snapshot();
  }

  @Post("v1/commands/:resource")
  @UseGuards(JwtGuard)
  create(@Param("resource") resource: string, @Body() body: Record<string, unknown>) {
    return this.commandBus.execute(new CreateResourceCommand(resource, body));
  }

  @Put("v1/commands/:resource/:id")
  @UseGuards(JwtGuard)
  update(
    @Param("resource") resource: string,
    @Param("id") id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.commandBus.execute(new UpdateResourceCommand(resource, id, body));
  }

  @Delete("v1/commands/:resource/:id")
  @UseGuards(JwtGuard)
  remove(@Param("resource") resource: string, @Param("id") id: string) {
    return this.commandBus.execute(new DeleteResourceCommand(resource, id));
  }
}
