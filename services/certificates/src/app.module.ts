import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { CertificatesController } from "./certificates.controller";
import { Handlers } from "./handlers";
import { HealthController } from "./health.controller";
import { InternalKeyGuard, JwtGuard } from "./security";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env.local", "../../.env.local"] }),
    CqrsModule.forRoot(),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: "7d" } }),
    }),
  ],
  controllers: [CertificatesController, HealthController],
  providers: [...Handlers, InternalKeyGuard, JwtGuard],
})
export class AppModule {}
