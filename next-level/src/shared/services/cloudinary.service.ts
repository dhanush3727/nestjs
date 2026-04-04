import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable() // `@Injectable` decorator marks this class as a provider that can be injected into other classes.
// This service is responsible for configuring and providing access to the Cloudinary API using credentials from the environment variables.
export class CloudinaryService {
  // The constructor initializes the Cloudinary configuration using the `ConfigService` to retrieve the necessary credentials from environment variables.
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  // The `getCloudinary` method provides access to the configured Cloudinary instance, allowing other parts of the application to use it for uploading and managing media.
  getCloudinary() {
    return cloudinary;
  }
}
