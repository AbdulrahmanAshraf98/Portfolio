import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { QueryHandlers } from "./application/handlers/query.handlers";
import { HealthController } from "./health.controller";
import { JwtGuard } from "./jwt.guard";
import { QueryController } from "./query.controller";
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
  controllers: [QueryController, HealthController],
  providers: [...QueryHandlers, JwtGuard, InternalKeyGuard],
})
export class AppModule {}
