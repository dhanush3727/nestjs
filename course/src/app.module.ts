import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ProfilesModule],
})
export class AppModule {}
