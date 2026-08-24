import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { InternalKeyGuard, JwtGuard } from "./security";
import { listFiles, saveFile } from "./storage";

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "application/pdf",
]);

@Controller()
export class FilesController {
  @Get("health")
  health() {
    return { ok: true, service: "files" };
  }

  @Get("v1/files")
  @UseGuards(InternalKeyGuard, JwtGuard)
  list() {
    return listFiles();
  }

  @Post("v1/files")
  @UseGuards(InternalKeyGuard, JwtGuard)
  @UseInterceptors(FileInterceptor("file", { storage: memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("file is required");
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException("Only images and PDF files are allowed");
    }
    return saveFile(file);
  }
}
