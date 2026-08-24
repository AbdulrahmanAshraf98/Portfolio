import { Controller, Get, UseGuards } from "@nestjs/common";
import { InternalKeyGuard } from "./security";

@Controller()
export class HealthController {
  @Get("health")
  health() {
    return { ok: true, service: "identity" };
  }

  @Get("ready")
  @UseGuards(InternalKeyGuard)
  ready() {
    return { ok: true, service: "identity" };
  }
}
