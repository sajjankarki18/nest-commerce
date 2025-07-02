import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CustomThrottlerExceptionFilter } from './global-exception/rate-limitter.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* swagger setup */
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Store-Backend')
    .setDescription('store -> Admin/Front API')
    .setVersion('1.0')
    .addTag('sotre-backend')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  /* api versioning */
  app.setGlobalPrefix('api/v1');

  /* rate-limiting setup */
  app.useGlobalFilters(new CustomThrottlerExceptionFilter());

  /* listen to the post 8000 */
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
