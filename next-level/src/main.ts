import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Create the NestJS application using the AppModule
  const app = await NestFactory.create(AppModule);

  // Retrieve the ConfigService from the application context
  const configService = app.get(ConfigService);

  // Get the port number from the configuration, or default to 3000 if not specified
  const port = configService.get<number>('PORT') || 3000;

  app.use(cookieParser()); // Use cookie-parser middleware to parse cookies in incoming requests

  // Enable CORS for all origins (you can customize this for production)
  app.enableCors({
    origin: '*', // Allow all origins (you can specify specific origins in production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests
  });

  // Use global validation pipes to validate incoming requests based on DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Start the server and listen on the specified port
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
