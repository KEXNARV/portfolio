import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as express from 'express';
import { existsSync, unlinkSync, readdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

const uploadsPath = join(__dirname, '..', '..', 'uploads');

@Controller('uploads')
export class UploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadsPath,
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp|svg\+xml)$/)) {
          return callback(new Error('Only image files are allowed'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  @Get()
  listFiles() {
    if (!existsSync(uploadsPath)) {
      return [];
    }
    const files = readdirSync(uploadsPath);
    return files
      .filter((f) => !f.startsWith('.'))
      .map((filename) => ({
        filename,
        url: `/uploads/${filename}`,
      }));
  }

  @Get(':filename')
  getFile(@Param('filename') filename: string, @Res() res: express.Response) {
    const filePath = join(uploadsPath, filename);
    if (!existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    return res.sendFile(filePath);
  }

  @Delete(':filename')
  deleteFile(@Param('filename') filename: string) {
    const filePath = join(uploadsPath, filename);
    if (!existsSync(filePath)) {
      return { error: 'File not found' };
    }
    unlinkSync(filePath);
    return { success: true, deleted: filename };
  }
}
