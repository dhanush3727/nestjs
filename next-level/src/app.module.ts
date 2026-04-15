import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { AppConfigModule } from './config/config.module';
import { RedisModule } from './redis/redis.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    RedisModule, // Import the RedisModule to make the Redis client available for dependency injection
    // Configure the ThrottlerModule to limit the number of requests from a single IP address within a specified time frame
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // time to live for each request in seconds
          limit: 10, // maximum number of requests allowed within the ttl
        },
      ],
    }),

    // Configure the ConfigModule to load environment variables and validate them using Joi
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Specify the path to your .env file
      validationSchema: Joi.object({
        PORT: Joi.number().default(5000),
        MONGODB_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        CLOUDINARY_API_KEY: Joi.string().required(),
        CLOUDINARY_API_SECRET: Joi.string().required(),
        CLOUDINARY_NAME: Joi.string().required(),
        EMAIL_ID: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),
        CLIENT_DEV_URL: Joi.string().required(),
      }),
    }),

    // Configure the MongooseModule to connect to MongoDB using the connection string from the configuration
    MongooseModule.forRootAsync({
      inject: [ConfigService], // Inject the ConfigService to access environment variables

      // Use a factory function to create the MongoDB connection configuration
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'), // Get the MongoDB connection string from the configuration

        // Optional: Add connection options and event listeners for better debugging and monitoring
        connectionFactory: (connection: Connection): Connection => {
          if (connection.readyState === mongoose.ConnectionStates.connected) {
            console.log('MongoDB is already connected');
          }

          connection.on('connected', () => {
            console.log('MongoDB connected successfully');
          });

          connection.on('error', (err: Error) => {
            console.error('MongoDB connection error:', err);
          });

          connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
          });

          return connection; // Return the connection instance to be used by MongooseModule
        },
      }),
    }),
    AppConfigModule, // Import the AppConfigModule to make CloudinaryService and MailService available for dependency injection
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [AppController], // controllers used to handle incoming requests and return responses to the client
  providers: [
    AppService,
    {
      provide: APP_GUARD, // Provide the APP_GUARD token to register a global guard
      useClass: ThrottlerGuard, // Use the ThrottlerGuard as a global guard to apply rate limiting to all routes
    },
  ], // providers used to handle business logic and interact with other services
})
export class AppModule {}
