import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration
  const allowedOrigins = [
    'http://localhost:6000',
    'http://localhost:3000',
    'http://localhost:3002',
  ];

  // Add production origin if set
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 Backend running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
