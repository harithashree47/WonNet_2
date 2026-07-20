import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

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
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://won-net-2.vercel.app",
        "https://won-net-2-ol7l.vercel.app",
        "https://wonnet-2.onrender.com",
      ];
      
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        callback(null, true);
        return;
      }
      
      // Allow any Vercel deployment (for preview and production deployments)
      if (origin.endsWith('.vercel.app')) {
        callback(null, true);
        return;
      }
      
      // Allow any Render domain
      if (origin.endsWith('.onrender.com')) {
        callback(null, true);
        return;
      }
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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