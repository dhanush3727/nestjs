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

## Auth(JWT + RBAC)
1. JWT Authentication(access + refresh tokens):
- JWT (Json Web Token) is a popular method for implementing authentication in web applications. It allows you to securely transmit information between parties as a JSON object.
- JWT have three parts:
  - Header: Contains metadata about the token, such as the signing algorithm and type.
  - Payload: contain the claims, which are data about the user and any additional information you want to include.
  - Signature: is created by signing the header and payload with a secret key. Check that the token is valid and has not been tampered with.
- Login Flow: When user login with their credentials, the server verifies them and generates two tokens: an access token (short-lived) and a refersh token (long-lived).
- Access Token: When client(browser) sent request to server the request have header authorization, this authorization have access token with bearer like `Authorization: Bearer <accessToken>`. The bearer is indicates that the token is JWT to server. The server will verify the access token and if valid, it will allow access to the protected resource. If the access token is expired, the server will return an error now the client can use the refresh token here.
- Refresh Token: When the access token expires, the client can send a request to the server with the refresh token to obtain a new access token. The server will verify the refresh token and if valid, it will generate a new access and refresh token and return them to the client. Now client can use the new access token to access protected resources. If the refresh token is also expired or invalid, the client will need to log in again to obtain new tokens.
- Store the tokens:
  - Access Token: It is recommended to store the access token in memory.
  - Refresh Token: It is recommended to store the refresh token in an HttpOnly cookie to prevent XSS attacks.

2. Refresh Token Rotation:
- Refresh token rotation, when every time we use refresh token to get new access token, we also issue a new refresh token and invalidate the old one. This helps to prevent replay attacks, where an attacker could use a stolen refresh token to obtain new access tokens.
- Implementation:
  - When the client sends a request to refresh the access token, the server verifies the refresh token.
  - If the refresh token is valid, the server generates a new access token and a new refresh token.
  - The server invalidates the old refresh token, ensuring that it cannot be used again.

3. Secure Cookies:
A cookie is just way for the browser to automatically send the data to server with every request. When we store refresh token in cookie, we should set the following flags to enhance security:
- HttpOnly: This flag prevents JavaScript from accessing the cookie, which helps to mitigate XSS attacks. When a cookie is marked as HttpOnly, it cannot be accessed or modified by client-side scripts, making it more secure against cross-site scripting attacks.
- Secure: This flag ensures that the cookie is only sent over HTTPS connections, which helps to prevent man-in-the-middle attacks. When a cookie is marked as Secure, it will only be transmitted over secure HTTPS connections, providing an additional layer of protection against interception by attackers.
- SameSite: This flag helps to prevent CSRF attacks by controlling when cookies are sent with cross-site requests. The SameSite attribute can be set to "Strict", "Lax", or "None". "Strict" means the cookie will only be sent in a first-party context, "Lax" allows the cookie to be sent with top-level navigations and GET requests, while "None" allows the cookie to be sent in all contexts, but it must be marked as Secure.
```typescript
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict',
});
```

4. Role-Based Access Control (RBAC):
RBAC is a method of restricting access to resources based on the roles of individual users within an organization.
- Define Roles: First, you need to define the roles in your application (e.g., Admin, User, Guest).
- Assign Roles to Users: Next, you need to assign roles to users. This can be done during user registration or through an admin interface.

5. Guards in NestJS:
Guards are a powerful feature in NestJS that allow you to implement authentication and authorization logic. You can create custom guards to check if a user has the necessary permissions to access a particular route.
```typescript
@Injectable()
export class RolesGuard implements CanActivate { 
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // No roles required, allow access
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```
In this example, the `RolesGuard` checks if the user has any of the required roles to access the route. You can use this guard in your controllers to protect routes based on user roles.
```typescript
@UseGuards(RolesGuard)
@Roles('Admin')
@Get('admin')
getAdminData() {
  // Only users with the 'Admin' role can access this route
}
```

6. Device/Session Tracking:
To enhance security, you can implement device or session tracking. This involves keeping track of the devices or sessions that a user has logged in from. If a user logs in from a new device or location, you can send an alert or require additional verification to ensure that it is the legitimate user. You can store device information (e.g., device type, IP address, location) in your database and associate it with the user's account. When a user logs in, you can check if the device is recognized and take appropriate actions if it is not.
```typescript
@Injectable()
export class AuthService {
  // ... other methods

  async login(user: User, deviceInfo: DeviceInfo) {
    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Store device info in the database
    await this.deviceRepository.create({
      userId: user.id,
      deviceType: deviceInfo.type,
      ipAddress: deviceInfo.ip,
      location: deviceInfo.location,
    });

    return { accessToken, refreshToken };
  }
}
```

## Database Design
1. Schema Design:
- When desigining your database schema, it's important to follow best practices to ensure that your data is organized efficiently and can be easily queried. Here are some key principles to keep in mind:
- Normalization: This is the process of organizing your data to minimize redundancy and improve data integrity. It involves breaking down your data into smaller, related tables and establishing relationships between them. For example, instead of storing user information in a single table, you might have separate tables for users, profiles, and addresses, with foreign keys linking them together.
- Indexing: Indexes can significantly improve query performance by allowing the database to quickly locate the relevant data. When designing your schema, consider which fields will be frequently queried and create indexes on those fields. For example, if you frequently query users by their email address, you might create an index on the email field in the users table.
- Relationships: Establishing clear relationships between tables is crucial for maintaining data integrity and enabling efficient queries. Use foreign keys to link related tables together. For example, if you have a transactions table that references a users table, you would include a user_id foreign key in the transactions table to establish the relationship.
- Data Types: Choose appropriate data types for your fields to ensure that your data is stored efficiently and can be easily queried. For example, if you have a field for storing dates, use a date or timestamp data type instead of a string to allow for easier date manipulation and querying.
- Denormalization: In some cases, it may be beneficial to denormalize your data for performance reasons. This involves duplicating data across tables to reduce the number of joins needed for queries. However, be cautious when denormalizing, as it can lead to data inconsistencies if not managed properly.
Ex: Database schema for expenseIQ project:
Step 1: Identify entities and relationships
- Users: Represents the users of the application.
- Transactions: Represents the financial transactions made by users.
- Categories: Represents the categories that transactions can be classified into.
- Budgets: Represents the budgets set by users for different categories.

Step 2: Define tables and fields
- Users Table:
  - id (primary key)
  - email (unique)
  - password
  - name
  - created_at
  - updated_at
- Transactions Table:
  - id (primary key)
  - user_id (foreign key referencing Users)
  - amount
  - category_id (foreign key referencing Categories)
  - date
  - name
  - type (income or expense)
  - created_at
  - updated_at
- Categories Table:
  - id (primary key)
  - user_id (foreign key referencing Users)
  - name
  - created_at
  - updated_at
- Budgets Table:
  - id (primary key)
  - user_id (foreign key referencing Users)
  - category_id (foreign key referencing Categories)
  - amount
  - start_date
  - end_date
  - created_at
  - updated_at

Step 3: Establish relationships
- Users to Transactions: One-to-Many (one user can have many transactions)
- Users to Categories: One-to-Many (one user can have many categories)
- Users to Budgets: One-to-Many (one user can have many budgets)
- Categories to Transactions: One-to-Many (one category can have many transactions)
- Categories to Budgets: One-to-Many (one category can have many budgets)

Step 4: Create indexes
- Create indexes on frequently queried fields such as user_id in the Transactions, Categories, and Budgets tables to improve query performance.
```sql
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
```
Step 5: Pagination and Query Optimization
- When designing your database schema, consider how you will handle pagination for large datasets. This can be achieved by using LIMIT and OFFSET in your SQL queries or by implementing cursor-based pagination for better performance. Additionally, optimize your queries by selecting only the necessary fields and using appropriate JOINs to minimize the amount of data being retrieved from the database.
```sql
SELECT id, amount, date FROM transactions WHERE user_id = 1 ORDER BY date DESC LIMIT 10 OFFSET 0;
```

