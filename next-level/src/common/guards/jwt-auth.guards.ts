import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// This guard is used to protect routes that require authentication using JWT (JSON Web Token).
// It extends the AuthGuard provided by the @nestjs/passport package, specifying 'jwt' as the strategy to use for authentication.
export class JwtAuthGuard extends AuthGuard('jwt') {}
