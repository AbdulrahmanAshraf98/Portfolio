import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IsEmail, IsString, MinLength } from "class-validator";
import type { Request } from "express";
import { InternalKeyGuard } from "../security";
import { JwtGuard } from "../jwt.guard";
import { AuthService } from "./auth.service";

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(12)
  password: string;
}

class PasswordDto {
  @IsString()
  @MinLength(12)
  currentPassword: string;

  @IsString()
  @MinLength(12)
  newPassword: string;
}

class VerifyKeyDto {
  @IsString()
  key: string;
}

@Controller()
@UseGuards(InternalKeyGuard)
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly auth: AuthService,
    @Inject(JwtService) private readonly jwt: JwtService,
  ) {}

  @Post("auth/login")
  login(@Body() body: LoginDto, @Req() req: Request) {
    const ip = (req.headers["x-forwarded-for"] as string) || req.ip;
    return this.auth.login(body.email, body.password, ip);
  }

  @Get("auth/me")
  async me(@Headers("authorization") authorization?: string) {
    const token = authorization?.replace(/^Bearer\s+/i, "");
    if (!token) throw new UnauthorizedException("Missing token");
    const payload = await this.jwt.verifyAsync<{ sub: string; email: string; role: string }>(token);
    return this.auth.me(payload);
  }

  @Post("auth/password")
  @UseGuards(JwtGuard)
  changePassword(@Body() body: PasswordDto) {
    return this.auth.changePassword(body.currentPassword, body.newPassword);
  }

  @Get("auth/keys")
  @UseGuards(JwtGuard)
  listKeys() {
    return this.auth.listKeys();
  }

  @Post("auth/keys")
  @UseGuards(JwtGuard)
  createKey() {
    return this.auth.createKey();
  }

  @Delete("auth/keys/:id")
  @UseGuards(JwtGuard)
  revokeKey(@Param("id") id: string) {
    return this.auth.revokeKey(id);
  }

  @Post("internal/keys/verify")
  verifyKey(@Body() body: VerifyKeyDto) {
    return this.auth.verifyClientKey(body.key);
  }
}
