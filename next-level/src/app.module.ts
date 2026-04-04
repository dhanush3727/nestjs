import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';

@Module({
  imports: [
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
