import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
// This strategy is responsible for validating JWT tokens and extracting user information from them.
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts the JWT token from the Authorization header as a Bearer token.
      secretOrKey: process.env.JWT_ACCESS_SECRET, // The secret key used to verify the JWT token, typically stored in environment variables for security.
    });
  }

  // The validate method is called after the JWT token is successfully verified. It receives the decoded payload of the token and can be used to extract user information and perform additional validation if necessary.
  async validate(payload: any) {
    return {
      userId: payload.sub,
      role: payload.role,
    };
  }
}
