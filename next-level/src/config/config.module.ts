import { Module } from '@nestjs/common';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import { MailService } from 'src/shared/services/mail.service';

@Module({
  providers: [CloudinaryService, MailService], // Registering CloudinaryService and MailService as providers in the module, making them available for dependency injection throughout the application.
  exports: [CloudinaryService, MailService], // Exporting CloudinaryService and MailService so that they can be used in other modules that import this ConfigModule.
})
export class AppConfigModule {}
