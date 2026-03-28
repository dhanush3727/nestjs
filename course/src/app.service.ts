import { Injectable } from '@nestjs/common';

// This is the main service for the application. It contains the business logic and provides methods that can be called by controllers to handle requests and return responses.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
