import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // ✅ Serve static files from assets directory (favicon, logos, etc.)
  app.useStaticAssets(join(process.cwd(), 'assets'), {
    prefix: '/assets/',
  });

  app.enableCors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174", 
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  // ✅ Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ✅ Swagger
  const config = new DocumentBuilder()
    .setTitle('WonNet API')
    .setDescription('JWT Auth API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Uploads available at http://localhost:${port}/uploads/`);
  console.log(`Assets available at http://localhost:${port}/assets/`);
}
bootstrap();