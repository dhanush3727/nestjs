import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

// This guard is used to protect routes that require specific roles for access.
// It checks if the user has the required roles before allowing access to the route or controller.
export interface RequestWithUser extends Request {
  user: {
    userId: number;
    role: string;
  };
}

@Injectable()
// The RolesGuard class implements the CanActivate interface, which is used by NestJS to determine if a route can be accessed based on the user's roles.
export class RolesGuard implements CanActivate {
  // The constructor injects the Reflector service, which is used to retrieve metadata about the required roles for a route or controller.
  constructor(private readonly reflector: Reflector) {}

  // The canActivate method is called by NestJS to determine if the current request can access the route or controller.
  canActivate(context: ExecutionContext): boolean {
    // Retrieve the required roles from the metadata of the route or controller using the Reflector service.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), // Get the handler (method) of the current route.
      context.getClass(), // Get the class (controller) of the current route.
    ]);
    // If there are no required roles specified, allow access to the route.
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<RequestWithUser>(); // Get the user information from the request object.
    // If there is no user information (i.e., the user is not authenticated), throw a ForbiddenException to deny access to the route.
    if (!user) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    const hasRole = requiredRoles.some((role) => user.role?.includes(role)); // Check if the user's role matches any of the required roles for the route.
    // If the user does not have any of the required roles, throw a ForbiddenException to deny access to the route.
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }
    return true; // If the user has the required roles, allow access to the route.
  }
}
