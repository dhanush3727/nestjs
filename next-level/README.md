# NestJS Next Level Learning
- Backend Architecture
- Auth(JWT + RBAC)
- Database Design
- API Design
- Error Handling
- Caching
- Rate Limiting & Security
- File Upload
- Background Jobs
- Logging & Monitoring
- Testing

## Backend Architecture
1. Modular Architecture:
  NestJS follows a modular architecture, allowing you to organize your code into modules, controllers, and services. This promotes separation of concerns and makes it easier to maintain and scale your application. Each layer should have only one responsibility
  - **Controller**: Handles incoming requests and returns responses. It should not contain business logic.
  - **Service**: Contains business logic and interacts other services. It should not handle HTTP requests directly.
  - **Repository**: Handles database interactions. It should not contain business logic or HTTP handling.
  - **DTO**: Data Transfer Objects are used to define the shape of data being sent and received. They help with validation and ensure that your API contracts are clear.
  - **Module**: Groups related controllers, services, and providers together. It helps to organize your application into cohesive units.

2. Example of module structure:
```
src/
  users/
    users.module.ts
    users.controller.ts
    users.service.ts
    users.repository.ts
    dto/
      create-user.dto.ts
      update-user.dto.ts
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    jwt.strategy.ts
    roles.guard.ts
    dto/
      login.dto.ts
      register.dto.ts
  app.module.ts
```
3. Dependency Injection:
  NestJS has a powerful dependency injection system that allows you to manage your application's dependencies efficiently. You can inject services into controllers and other services, making it easier to test and maintain your code.
```typescript
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  
  // Business logic here
}
```
