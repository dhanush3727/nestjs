import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  controllers: [AuthController], // Add the AuthController to the controllers array
  providers: [AuthService, JwtStrategy, RefreshStrategy], // Add the AuthService, JwtStrategy, and RefreshStrategy to the providers array
})
export class AuthModule {}
