import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';

// This is the main application module, which serves as the root module for the NestJS application. It imports the AppController, AppService, and ProfilesModule to set up the application's structure and functionality.
@Module({
  controllers: [AppController], // The controllers array specifies that the AppController should be included in this module, allowing it to handle incoming requests to the root route ("/").
  providers: [AppService], // The providers array specifies that the AppService should be included in this module, making it available for dependency injection throughout the application.
  imports: [ProfilesModule], // The imports array specifies that the ProfilesModule should be included in this module, allowing it to handle profile-related functionality and routes.
})
export class AppModule {}
