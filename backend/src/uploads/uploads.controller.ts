import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MinioService } from '../minio/minio.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly minioService: MinioService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;

    try {
      await this.minioService.uploadFile(file, uniqueName);
      const url = this.minioService.getPublicUrl(uniqueName);

      return {
        filename: uniqueName,
        url,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload file');
    }
  }

  @Get()
  async listFiles() {
    try {
      const files = await this.minioService.listFiles();
      return files.map((filename) => ({
        filename,
        url: this.minioService.getPublicUrl(filename),
      }));
    } catch (error) {
      return [];
    }
  }

  @Get(':filename')
  async getFile(@Param('filename') filename: string) {
    try {
      const url = await this.minioService.getFileUrl(filename);
      return { url };
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }

  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    try {
      await this.minioService.deleteFile(filename);
      return { success: true, deleted: filename };
    } catch (error) {
      throw new NotFoundException('File not found');
    }
  }
}
