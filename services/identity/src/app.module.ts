import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { HealthController } from "./health.controller";
import { JwtGuard } from "./jwt.guard";
import { InternalKeyGuard } from "./security";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env.local", "../../.env.local"] }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: "7d" },
      }),
    }),
  ],
  controllers: [AuthController, HealthController],
  providers: [AuthService, InternalKeyGuard, JwtGuard],
})
export class AppModule {}
