import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create a new NestJS application instance using the AppModule as the root module.
  await app.listen(process.env.PORT ?? 3000); // Start the application and listen for incoming HTTP requests on the specified port (default is 3000 if PORT environment variable is not set).
}

bootstrap();
