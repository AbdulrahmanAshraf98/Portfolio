import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { FilesController } from "./files.controller";
import { InternalKeyGuard, JwtGuard } from "./security";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env.local", "../../.env.local"] }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: "7d" } }),
    }),
  ],
  controllers: [FilesController],
  providers: [InternalKeyGuard, JwtGuard],
})
export class AppModule {}
