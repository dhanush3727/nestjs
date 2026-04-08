## Auth Module Explanation:
The Auth module is responsible for handling user authentication and authorization in the application. It provides functionalities such as user registration, login, password management, and access control. The module ensures that only authenticated users can access certain resources and perform specific actions based on their roles and permissions.


### Module:
```ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
```
In this module, we import the necessary controllers and services. The `AuthController` handles incoming HTTP requests related to authentication, while the `AuthService` contains the business logic for authentication processes. The `JwtStrategy` and `RefreshStrategy` are used for handling JWT authentication and refresh token functionality, respectively.

### Controller:
```ts
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: any) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: any, @Res() res: Response) {
    const user = await this.authService.validateUser(dto);

    const { accessToken, refreshToken } =
      await this.authService.generateTokens(user);

    const hashed = await this.authService.hashToken(refreshToken);

    await this.authService['userRepo'].update(user.id, {
      refreshToken: hashed,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.json({ accessToken });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: any) {
    console.log('User from request:', req.user); 

    return {
      message: 'Protected route success',
      user: req.user,
    };
  }

  // REFRESH (ROTATION)
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req: any, @Res() res: Response) {
    const { userId, refreshToken } = req.user;

    const isValid = await this.authService.validateRefreshToken(
      userId,
      refreshToken,
    );

    if (!isValid) throw new UnauthorizedException();

    const user = await this.authService['userRepo'].findById(userId);

    const { accessToken, refreshToken: newRefresh } =
      await this.authService.generateTokens(user);

    const hashed = await this.authService.hashToken(newRefresh);

    await this.authService['userRepo'].update(userId, {
      refreshToken: hashed,
    });

    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return res.json({ accessToken });
  }

  // LOGOUT
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any, @Res() res: Response) {
    await this.authService['userRepo'].update(req.user.userId, {
      refreshToken: null,
    });

    res.clearCookie('refreshToken');

    return res.json({ message: 'Logged out' });
  }
}
```
In this code:
- The `register` method allows users to create a new account by providing their details in the request body.
- The `login` method validates the user's credentials and generates access and refresh tokens. The refresh token is hashed and stored in the database, while the access token is returned in the response. The refresh token is also set as an HTTP-only cookie.
- The `getProfile` method is a protected route that requires a valid JWT access token. It returns the user's profile information if the token is valid. The `JwtAuthGuard` is used to protect this route, ensuring that only authenticated users can access it.
- The `refresh` method allows users to obtain a new access token using a valid refresh token. It validates the refresh token, generates new tokens, and updates the stored refresh token in the database. The `AuthGuard('jwt-refresh')` is used to protect this route, ensuring that only users with a valid refresh token can access it. The name 'jwt-refresh' corresponds to the strategy defined for handling refresh tokens.
- The `logout` method clears the refresh token from the database and removes the cookie, effectively logging the user out. The `JwtAuthGuard` is used to protect this route, ensuring that only authenticated users can log out.

### Service:
```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  // This is a user repository t's just for example in project use separately
  private userRepo = {
    async findByEmail(email: string) {
      // Fetch user from DB
    },
    async findById(id: number) {},
    async create(data: any) {},
    async update(id: number, data: any) {},
  };

  // Register user
  async register(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      role: 'USER',
    });

    return user;
  }

  // Validate user
  async validateUser(dto: any) {
    const user = await this.userRepo.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) throw new UnauthorizedException();

    return user;
  }

  // Generate the access and refresh token with user payload
  async generateTokens(user: any) {
    // user payload
    const payload = {
      sub: user.id,
      role: user.role,
    };

    // access token in 15m expiration. Store it in memory
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    });

    // refresh token in 7d expiration. Store it in DB using hash
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  // compare the refresh token and DB refresh token
  async validateRefreshToken(userId: number, token: string) {
    const user = await this.userRepo.findById(userId);

    if (!user || !user.refreshToken) return false;

    return bcrypt.compare(token, user.refreshToken);
  }
}
```
In this code:
- The `register` method hashes the user's password and creates a new user in the database.
- The `validateUser` method checks if the user's credentials are correct.
- The `generateTokens` method creates access and refresh tokens for the user.
- The `validateRefreshToken` method compares the provided refresh token with the one stored in the database.

### strategies:
`jwt.strategy.ts` and `refresh.strategy.ts` contain the logic for validating JWT access tokens and refresh tokens, respectively. They use Passport strategies to handle authentication and ensure that only valid tokens can access protected routes. The `jwt.strategy.ts` validates the access token, while the `refresh.strategy.ts` validates the refresh token and ensures that it matches the one stored in the database. The `passport` is a library that provides a simple and consistent way to handle authentication in Node.js applications, and it integrates well with NestJS.
`jwt.strtegy.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      role: payload.role,
    };
  }
}
```
In this code:
- The `JwtStrategy` class extends the `PassportStrategy` and uses the `Strategy` from `passport-jwt`.
- The constructor configures the strategy to extract the JWT from the Authorization header as a Bearer token and uses the secret key defined in the environment variables to verify the token.
- Why used `super`? The `super` function is called to invoke the constructor of the parent class (`PassportStrategy`) and pass the configuration object that defines how the JWT should be extracted and verified. This is necessary to properly set up the strategy for handling JWT authentication in the application.
- The `validate` method is called after the token is verified and extracts the user information from the token payload. It returns an object containing the user's ID and role, which can be accessed in the request object for protected routes.
- We used this strategy in the `getProfile` and `logout` routes to protect them, ensuring that only authenticated users with a valid access token can access these routes.

`refresh.strategy.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => req.cookies.refreshToken,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    return {
      userId: payload.sub,
      refreshToken: req.cookies.refreshToken,
    };
  }
}
```
In this code:
- The `RefreshStrategy` class extends the `PassportStrategy` and uses the `Strategy` from `passport-jwt`, with a custom name 'jwt-refresh'.
- The constructor configures the strategy to extract the JWT from the `refreshToken` cookie and uses the secret key defined in the environment variables to verify the token. The `passReqToCallback` option is set to true to allow access to the request object in the `validate` method.
- The `validate` method is called after the token is verified and extracts the user information from the token payload, as well as the refresh token from the request cookies. It returns an object containing the user's ID and the refresh token, which can be accessed in the request object for the refresh route.
- We used this strategy in the `refresh` route to protect it, ensuring that only users with a valid refresh token can access this route to obtain a new access token.

### Guards:
Guards are used to protect routes and ensure that only authenticated users can access certain resources. In this module, we use the `JwtAuthGuard` to protect the `getProfile` and `logout` routes, and the `AuthGuard('jwt-refresh')` to protect the `refresh` route. These guards check for the presence of a valid JWT access token or refresh token, respectively, before allowing access to the protected routes. If the token is invalid or missing, the guards will prevent access and return an appropriate error response.
`jwt-auth.guards.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```
In this code:
- The `JwtAuthGuard` class extends the `AuthGuard` from `@nestjs/passport` and specifies the 'jwt' strategy to use for authentication. This guard will check for a valid JWT access token in the Authorization header of incoming requests.
- We used this guard in the `getProfile` and `logout` routes to protect them, ensuring that only authenticated users with a valid access token can access these routes. If a request is made to these routes without a valid token, the guard will prevent access and return an appropriate error response.

`roles.guards.ts`:
```ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    userId: number;
    role: string;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    if (!user) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    const hasRole = requiredRoles.some((role) => user.role?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return true;
  }
}
```
In this code:
- The `RolesGuard` class implements the `CanActivate` interface from `@nestjs/common` and is used to protect routes based on user roles. It checks if the user has the required roles to access a particular route.
- The `canActivate` method retrieves the required roles for the route using the `Reflector` and checks if the user has any of the required roles. If the user does not have the necessary permissions, a `ForbiddenException` is thrown, preventing access to the resource.
- This guard can be used in combination with the `JwtAuthGuard` to ensure that only authenticated users with the appropriate roles can access certain routes in the application.

### Decorators:
Decorators are used to add metadata to routes and controllers, which can be accessed by guards and other components to implement features such as role-based access control. In this module, we can create a custom `Roles` decorator to specify the required roles for a route. This decorator will use the `SetMetadata` function from `@nestjs/common` to attach the required roles to the route handler, which can then be accessed by the `RolesGuard` to determine if the user has the necessary permissions to access the route.
`roles.decorator.ts`:
```ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```
In this code:
- The `Roles` function is a custom decorator that takes a variable number of string arguments representing the required roles for a route. It uses the `SetMetadata` function to attach these roles to the route handler under the key 'roles'.
- This decorator can be used in conjunction with the `RolesGuard` to protect routes based on user roles. For example, you can use it like this:
```ts
@Roles('ADMIN')
@Get('admin')
getAdminData() {
  // This route can only be accessed by users with the 'ADMIN' role
}
```
In this example, the `getAdminData` route is protected by the `RolesGuard`, and only users with the 'ADMIN' role will be able to access it. If a user without the required role tries to access this route, they will receive a `ForbiddenException` response.

### Final Flow:
Request
 ↓
JwtAuthGuard
 ↓
JwtStrategy
 ↓
validate()
 ↓
req.user
 ↓
Controller
 ↓
RolesGuard
 ↓
Response
In this flow:
- The incoming request first goes through the `JwtAuthGuard`, which checks for a valid JWT access token in the Authorization header.
- If the token is valid, the `JwtStrategy` is invoked to validate the token and extract the user information from the token payload.
- The `validate` method in the `JwtStrategy` returns the user information, which is attached to the request object as `req.user`.
- The request then reaches the controller, where the route handler can access `req.user` to perform actions based on the authenticated user's information.
- If the route is protected by the `RolesGuard`, it will check if the user has the required roles to access the route. If the user does not have the necessary permissions, a `ForbiddenException` is thrown, preventing access to the resource.
- Finally, if all checks pass, the controller processes the request and returns a response to the client.
