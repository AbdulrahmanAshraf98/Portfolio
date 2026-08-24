import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { CommandHandlers } from "./application/handlers/command.handlers";
import { CommandController } from "./command.controller";
import { HealthController } from "./health.controller";
import { JwtGuard } from "./jwt.guard";
import { InternalKeyGuard } from "./security";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env.local", "../../.env.local"] }),
    CqrsModule.forRoot(),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "7d" },
      }),
    }),
  ],
  controllers: [CommandController, HealthController],
  providers: [...CommandHandlers, JwtGuard, InternalKeyGuard],
})
export class AppModule {}
