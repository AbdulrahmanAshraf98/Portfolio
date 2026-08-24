import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { randomBytes, randomUUID } from "crypto";
import { secretsEqual } from "../security";
import { identityStore, type ApiKeyRecord } from "../store";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX = 5;
const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD = 12;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(ip?: string) {
  return (ip ?? "unknown").split(",")[0].trim() || "unknown";
}

@Injectable()
export class AuthService {
  constructor(@Inject(JwtService) private readonly jwt: JwtService) {}

  async bootstrap() {
    await identityStore.hydrate();
    const admin = identityStore.readAdmin();
    const password = process.env.ADMIN_PASSWORD ?? "";
    const email = (process.env.ADMIN_EMAIL ?? admin.email).toLowerCase().trim();
    if (!password || password.length < MIN_PASSWORD) return;

    const passwordOk = admin.passwordHash ? await bcrypt.compare(password, admin.passwordHash) : false;
    if (passwordOk && secretsEqual(email, admin.email.toLowerCase().trim())) return;

    identityStore.writeAdmin({
      email,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
    });
  }

  private assertLoginWindow(ip?: string) {
    const key = clientIp(ip);
    const now = Date.now();
    const rec = loginAttempts.get(key);
    if (!rec || rec.resetAt < now) return;
    if (rec.count >= LOGIN_MAX) {
      throw new HttpException("Too many attempts. Try again later.", HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private recordFailure(ip: string) {
    const key = clientIp(ip);
    const now = Date.now();
    const rec = loginAttempts.get(key);
    if (!rec || rec.resetAt < now) {
      loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
      return;
    }
    rec.count += 1;
  }

  private clearFailures(ip: string) {
    loginAttempts.delete(clientIp(ip));
  }

  async login(email: string, password: string, ip?: string) {
    this.assertLoginWindow(ip);
    const admin = identityStore.readAdmin();
    const normalized = email.toLowerCase().trim();
    const emailOk = secretsEqual(normalized, admin.email.toLowerCase().trim());
    const passwordOk = admin.passwordHash ? await bcrypt.compare(password, admin.passwordHash) : false;
    if (!emailOk || !passwordOk) {
      this.recordFailure(ip ?? "unknown");
      throw new UnauthorizedException("Invalid credentials");
    }
    this.clearFailures(ip ?? "unknown");
    const accessToken = await this.jwt.signAsync({
      sub: "admin",
      email: admin.email,
      role: "admin",
    });
    return {
      accessToken,
      user: { id: "admin", email: admin.email, role: "admin" },
    };
  }

  me(payload: { sub: string; email: string; role: string }) {
    return { id: payload.sub, email: payload.email, role: payload.role };
  }

  async changePassword(currentPassword: string, nextPassword: string) {
    if (!nextPassword || nextPassword.length < MIN_PASSWORD) {
      throw new HttpException(`Password must be at least ${MIN_PASSWORD} characters`, HttpStatus.BAD_REQUEST);
    }
    const admin = identityStore.readAdmin();
    const ok = admin.passwordHash ? await bcrypt.compare(currentPassword, admin.passwordHash) : false;
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    identityStore.writeAdmin({
      email: admin.email,
      passwordHash: await bcrypt.hash(nextPassword, BCRYPT_ROUNDS),
    });
    return { ok: true };
  }

  listKeys() {
    return identityStore.readKeys().map((item) => ({
      id: item.id,
      prefix: item.prefix,
      createdAt: item.createdAt,
      revokedAt: item.revokedAt,
    }));
  }

  async createKey() {
    const plaintext = randomBytes(32).toString("base64url");
    const record: ApiKeyRecord = {
      id: randomUUID(),
      prefix: plaintext.slice(0, 8),
      hash: await bcrypt.hash(plaintext, BCRYPT_ROUNDS),
      createdAt: new Date().toISOString(),
      revokedAt: null,
    };
    const keys = identityStore.readKeys();
    keys.unshift(record);
    identityStore.writeKeys(keys);
    return {
      id: record.id,
      prefix: record.prefix,
      createdAt: record.createdAt,
      key: plaintext,
    };
  }

  revokeKey(id: string) {
    const keys = identityStore.readKeys();
    const index = keys.findIndex((item) => item.id === id);
    if (index < 0) throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    keys[index] = { ...keys[index], revokedAt: new Date().toISOString() };
    identityStore.writeKeys(keys);
    return { ok: true };
  }

  async verifyClientKey(key?: string) {
    if (!key) return { ok: false };
    const active = identityStore.readKeys().filter((item) => !item.revokedAt);
    for (const item of active) {
      if (await bcrypt.compare(key, item.hash)) return { ok: true };
    }
    return { ok: false };
  }
}
