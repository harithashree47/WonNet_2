import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(3000);
}
bootstrap();