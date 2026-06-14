import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor() {
    if (!existsSync('uploads')) {
      mkdirSync('uploads', { recursive: true });
    }
  }

  @Post('image')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const baseUrl = (process.env.UPLOAD_URL || 'http://localhost:3000')
      .toString()
      .trim()
      .replace(/^['"]|['"]$/g, '');

    return {
      success: true,
      url: `${baseUrl}/uploads/${file.filename}`,
      filename: file.filename,
      sizeMB: Number((file.size / (1024 * 1024)).toFixed(2)),
    };
  }
}