import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters/exception.filter';

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
      exceptionFactory: (errors) => {
        // Format the validation errors to return a more user-friendly response
        const formattedErrors = errors.map((error) => ({
          field: error.property, // The name of the field that failed validation
          errors: Object.values(error.constraints || {}), // The validation error messages for the field
        }));
        // Return a BadRequestException with the formatted validation errors
        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter()); // Use the GlobalExceptionFilter to handle all exceptions in a consistent way

  // Enable versioning for the API (optional, but recommended for future-proofing)
  app.enableVersioning({
    type: VersioningType.URI, // Use URI versioning (e.g., /v1/endpoint)
  });

  // Start the server and listen on the specified port
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
