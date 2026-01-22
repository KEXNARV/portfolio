import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private minioClient: Minio.Client;
  private readonly bucketName = 'portfolio';

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      const exists = await this.minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        console.log(`Bucket "${this.bucketName}" created successfully`);

        // Set bucket policy to allow public read
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: { AWS: ['*'] },
              Action: ['s3:GetObject'],
              Resource: [`arn:aws:s3:::${this.bucketName}/*`],
            },
          ],
        };
        await this.minioClient.setBucketPolicy(
          this.bucketName,
          JSON.stringify(policy),
        );
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    filename: string,
  ): Promise<string> {
    try {
      await this.minioClient.putObject(
        this.bucketName,
        filename,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
        },
      );

      return filename;
    } catch (error) {
      console.error('Error uploading file to MinIO:', error);
      throw error;
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, filename);
    } catch (error) {
      console.error('Error deleting file from MinIO:', error);
      throw error;
    }
  }

  async getFileUrl(filename: string): Promise<string> {
    try {
      // Generate presigned URL (valid for 7 days)
      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        filename,
        24 * 60 * 60 * 7,
      );
      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  getPublicUrl(filename: string): string {
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || '9000';
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    return `${protocol}://${endpoint}:${port}/${this.bucketName}/${filename}`;
  }

  async listFiles(): Promise<string[]> {
    try {
      const files: string[] = [];
      const stream = this.minioClient.listObjects(this.bucketName, '', true);

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          if (obj.name) {
            files.push(obj.name);
          }
        });
        stream.on('end', () => resolve(files));
        stream.on('error', (err) => reject(err));
      });
    } catch (error) {
      console.error('Error listing files from MinIO:', error);
      throw error;
    }
  }
}
