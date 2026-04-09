import { SetMetadata } from '@nestjs/common';

// This decorator is used to specify the roles that are allowed to access a particular route or controller.
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
