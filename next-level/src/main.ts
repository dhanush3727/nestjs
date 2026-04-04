import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Create the NestJS application using the AppModule
  const app = await NestFactory.create(AppModule);

  // Retrieve the ConfigService from the application context
  const configService = app.get(ConfigService);

  // Get the port number from the configuration, or default to 3000 if not specified
  const port = configService.get<number>('PORT') || 3000;

  // Start the server and listen on the specified port
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
