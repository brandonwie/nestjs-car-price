import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out any fields that do not have a corresponding property in the DTO
      forbidNonWhitelisted: true, // throw error if whitelist is true and a non-whitelisted field is present
    }),
  );
  await app.listen(3000);
}
bootstrap();
