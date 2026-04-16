import * as winston from 'winston';
import { Injectable } from '@nestjs/common';

@Injectable()
// A simple wrapper around winston to provide a consistent logging interface
export class WinstonLogger {
  private logger: winston.Logger; // The winston logger instance
  constructor() {
    // Configure the winston logger with transports and formats
    this.logger = winston.createLogger({
      level: 'info', // Set the default log level to 'info'

      // Combine timestamp and JSON formatting for log messages
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),

      // Define the transports for logging to console and files
      transports: [
        new winston.transports.Console(), // Log to the console

        // Log error messages to 'logs/error.log' and all messages to 'logs/combined.log'
        new winston.transports.File({
          filename: 'logs/error.log', // Log only error level messages to this file
          level: 'error', // Set the log level to 'error' for this transport
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }), // Log all messages to this file
      ],
    });
  }

  // Log an informational message with optional metadata
  log(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  // Log an error message with optional metadata
  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }
}
