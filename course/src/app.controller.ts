import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// This is the main controller for the application. It handles the root route and returns a greeting message.
@Controller()
export class AppController {
  // The constructor injects the AppService, which contains the business logic for the application.
  constructor(private readonly appService: AppService) {}

  // This method handles GET requests to the root route ("/") and returns a greeting message by calling the getHello method of the AppService.
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
