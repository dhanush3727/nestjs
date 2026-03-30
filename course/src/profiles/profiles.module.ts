import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

// This is the ProfilesModule, which is responsible for handling all profile-related functionality in the application. It imports the ProfilesController, which contains the logic for handling HTTP requests related to profiles.
@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService], // The controllers array specifies that the ProfilesController should be included in this module, allowing it to handle incoming requests to the /profiles route and its sub-routes.
})
export class ProfilesModule {}
