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
4. Middleware and Interceptors:
  NestJS allows you to use middleware and interceptors to handle cross-cutting concerns such as logging, authentication, and error handling. Middleware runs before the request reaches the controller, while interceptors can manipulate the response after the controller has processed the request.
```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return call$.pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
    );
  }
}
```
5. ExpenseIQ project structure in NestJS:
```
server/
├── dist/                                   # compiled (auto)
├── src/
│
│   ├── main.ts                             # entry point (replaces server.ts)
│   ├── app.module.ts                       # root module
│   ├── app.controller.ts                   # root controller
│   ├── app.service.ts                      # root service
|
│   ├── common/                             # cross-cutting (NOT feature logic)
│   │   ├── decorators/                     # custom decorators (e.g., @Roles)
|   |   |   ├──user.decorator.ts            # custom user decorator for extracting user from request                
│   │   ├── filters/                        # global exception filters
|   |   |   ├──exception.filter.ts          # custom exception filter
│   │   ├── guards/                         # global guards (e.g., RBAC)
|   |   |   ├──auth.guard.ts                # custom auth guard for extracting user from request
│   │   ├── interceptors/                   # global interceptors (e.g., logging)
|   |   |   ├──fileUpload.interceptor.ts    # custom logging interceptor                   
│
│   ├── config/                             # config layer
│   │   ├── configuration.ts                # centralized config (using @nestjs/config)
│
│   ├── database/                           # DB connection (clean separation)
│   │   ├── mongoose.module.ts              # DB module (provides connection)
│
│   ├── shared/                             # reusable logic (controlled)
│   │   ├── services/
|   |   |   ├──cloudinary.service.ts        # custom cloudinary service for handling file uploads
|   |   |   ├──mail.service.ts              # custom mail service for handling email operations
│
│   ├── modules/                            # CORE BUSINESS FEATURES
│   │   ├── auth/                           # NEW (mandatory)
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/                 # JWT strategy      
│   │   │   ├── guards/                     # RBAC guards
│   │   │   ├── dto/                        # auth DTOs
│   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── dto/
│   │   │   ├── schemas/                    # Mongo schema
│
│   │   ├── transactions/
│   │   │   ├── transactions.module.ts
│   │   │   ├── transactions.controller.ts
│   │   │   ├── transactions.service.ts
│   │   │   ├── transactions.repository.ts
│   │   │   ├── dto/
│   │   │   ├── schemas/
│
│   │   ├── categories/
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   ├── categories.repository.ts
│   │   │   ├── dto/
│   │   │   ├── schemas/
│
│   │   ├── budgets/
│   │   │   ├── budgets.module.ts
│   │   │   ├── budgets.controller.ts
│   │   │   ├── budgets.service.ts
│   │   │   ├── budgets.repository.ts
│   │   │   ├── dto/
│   │   │   ├── schemas/
│   │   │   ├── constants/
│   │   │   ├── enums/
│
│   │   ├── insights/                  # heavy logic module
│   │   │   ├── insights.module.ts
│   │   │   ├── insights.controller.ts
│   │   │   ├── insights.service.ts
│   │   │   ├── dto/
│
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── schemas/
│
│   │   ├── overview/                  # optional aggregation layer
│   │       ├── overview.module.ts
│   │       ├── overview.controller.ts
│   │       ├── overview.service.ts
│
│   ├── .env
```
