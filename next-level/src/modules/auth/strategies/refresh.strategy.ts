import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
// This strategy is responsible for validating refresh tokens and extracting user information from them. It uses a different secret key than the access token strategy to ensure that refresh tokens are handled securely.
// The 'jwt-refresh' name is used to differentiate this strategy from the access token strategy when using Passport's authentication mechanisms.
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => req.cookies.refreshToken, // Extracts the refresh token from the cookies of the incoming request.
      secretOrKey: process.env.JWT_REFRESH_SECRET, // The secret key used to verify the refresh token, typically stored in environment variables for security.
      passReqToCallback: true, // Passes the request object to the validate method, allowing access to cookies and other request data.
    });
  }

  // The validate method is called after the refresh token is successfully verified. It receives both the request object and the decoded payload of the token.
  // This allows it to extract user information from the payload and also access the refresh token from the cookies for further validation if necessary.
  async validate(req: any, payload: any) {
    return {
      userId: payload.sub,
      refreshToken: req.cookies.refreshToken,
    };
  }
}
