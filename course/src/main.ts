import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Create a new NestJS application instance using the AppModule as the root module.
  app.useGlobalPipes(new ValidationPipe()); // Apply the ValidationPipe globally to all incoming requests. This will automatically validate the incoming data based on the DTOs defined in the application and return a 400 Bad Request response if the validation fails.
  app.useGlobalInterceptors(new LoggingInterceptor()); // Apply the LoggingInterceptor globally to all incoming requests. This will log the HTTP method, URL, and duration of each request to the console.
  await app.listen(process.env.PORT ?? 3000); // Start the application and listen for incoming HTTP requests on the specified port (default is 3000 if PORT environment variable is not set).
}

bootstrap();
