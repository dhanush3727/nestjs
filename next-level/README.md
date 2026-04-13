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
  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    return call$.pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
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

## API Design
1. REST API Standards:
- When designing your REST API, it's important to follow established standards to ensure that your API is intuititve and easy to use for developers. Here are some key principles to keep in mind:
- Use Nouns for Endpoints: You API endpoints should be based on nouns that represent the resources being accessed. For example, use /users to access user resources and
  /transactions to access transaction resources.
- Use HTTP Methods Appropriately: Use the appropriate HTTP methods for different operations. For example, use GET to retrieve data, POST to create new resources, PUT to update existing resources, and DELETE to remove resources.
- Use Plural Nouns: Use plural nouns for your endpoints to indicate that they represent collections of resources. For example, use /users instead of /user. In this users endpoint, you can perform create, read, update, and delete operations on user resources.
2. Proper status codes:
- Use appropriate HTTP status codes to indicate the outcome of API requests. For example, use 200 OK for successful GET requests, 201 Created for successful POST requests, 204 No Content for successful DELETE requests, and 400 Bad Request for invalid input.
```ts
@Get(':id')
async getUser(@Param('id') id: string): Promise<User> {
  const user = await this.usersService.findById(id);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

@Post()
async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
  const user = await this.usersService.create(createUserDto);
  return user;
}

@Put(':id')
async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
  const user = await this.usersService.update(id, updateUserDto);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

@Delete(':id')
async deleteUser(@Param('id') id: string): Promise<void> {
  const result = await this.usersService.delete(id);
  if (!result) {
    throw new NotFoundException('User not found');
  }
}
```
3. Pagination API's:
- When designing API endpoints that return lists of resources, it's important to implement pagination to improve performance and usability. This can be achieved by accepting query parameters for page number and page size, and returning a subset of the data along with metadata about the total number of resources and pages.

```ts
@Get()
async getUsers(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
): Promise<{ data: User[]; total: number; page: number; lastPage: number }> {
  const [data, total] = await this.usersService.findAll({ page, limit });
  return {
    data,
    total,
    page,
    lastPage: Math.ceil(total / limit),
  };
}
```
4. Filtering and Sorting:
- Allow clients to filter and sort data by accepting query parameters for filtering criteria and sort order. This can be implemented by parsing the query parameters and applying the appropriate filters and sorting logic in your service layer.
```ts
@Get()
async getTransactions(
  @Query('category') category: string,
  @Query('sort') sort: 'asc' | 'desc' = 'asc',
): Promise<Transaction[]> {
  return this.transactionsService.findAll({ category, sort });
}
```
5. Versioning:
- Implement API versioning to allow for changes and improvements to your API without breaking existing clients. This can be done by including the version number in the URL (e.g., /api/v1/users) or by using custom headers to specify the API version.

```ts
// Using version number in URL
@Controller('api/v1/users')
export class UsersController {
  // ... controller methods
}

// Using custom headers
@Controller('users')
export class UsersController {
  @Get()
  async getUsers(@Headers('API-Version') apiVersion: string): Promise<User[]> {
    if (apiVersion === '1') {
      // Return data in format for version 1
    } else if (apiVersion === '2') {
      // Return data in format for version 2
    } else {
      throw new BadRequestException('Unsupported API version');
    }
  }
}
```
6. Example of API design
```ts
// main.ts
app.enableVersioning({
  type: VersioningType.URI,
});

// createTransaction.dto.ts
import { IsNumber, IsString, IsEnum } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount!: number;

  @IsEnum(['income', 'expense'])
  type!: 'income' | 'expense';

  @IsString()
  category!: string;

  @IsString()
  note!: string;
}

// TransactionQueryDto.dto.ts
import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class TransactionQueryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}

// updateTransaction.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './createTransaction.dto';
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

// transactions.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/createTransaction.dto';
import { TransactionQueryDto } from './dto/TransactionQueryDto.dto';
import { UpdateTransactionDto } from './dto/updateTransaction.dto';

type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
};

@Controller({
  path: 'transactions',
  version: '1',
})
export class TransactionController {
  private transactions: Transaction[] = [];

  // Create a new transaction
  @Post()
  create(@Body() dto: CreateTransactionDto) {
    const newTx = { id: Date.now().toString(), ...dto };
    this.transactions.push(newTx);

    return {
      success: true,
      data: newTx,
      message: 'Transaction created',
    };
  }

  // Get all transactions
  @Get()
  findAll(@Query() query: TransactionQueryDto) {
    let data = [...this.transactions];

    // Filtering
    if (query.type) {
      data = data.filter((tx) => tx.type === query.type);
    }

    if (query.category) {
      data = data.filter((tx) => tx.category === query.category);
    }

    // Sorting
    if (query.sort) {
      const [field, order] = query.sort.split(':');
      data.sort((a, b) => {
        if (a[field] < b[field]) return order === 'desc' ? 1 : -1;
        if (a[field] > b[field]) return order === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Pagination
    const page = query.page ? parseInt(query.page.toString(), 10) : 1;
    const limit = query.limit ? parseInt(query.limit.toString(), 10) : 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginated = data.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginated,
      meta: {
        total: data.length,
        page,
        limit,
      },
    };
  }

  // Get a transaction by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    const tx = this.transactions.find((t) => t.id === id);

    if (!tx) {
      throw new NotFoundException('Transaction not found');
    }

    return {
      success: true,
      data: tx,
    };
  }

  // Update transaction
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    const index = this.transactions.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException('Transaction not found');
    }

    this.transactions[index] = { ...this.transactions[index], ...dto };

    return {
      success: true,
      data: this.transactions[index],
      message: 'Transaction updated',
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const index = this.transactions.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundException('Transaction not found');
    }

    const deleted = this.transactions.splice(index, 1);

    return {
      success: true,
      data: deleted[0],
      message: 'Transaction deleted',
    };
  }
}

// transactions.controller.v2.ts
import { Controller, Get } from '@nestjs/common';

@Controller({
  path: 'transactions',
  version: '2',
})
export class TransactionsControllerV2 {
  @Get()
  getTransactions() {
    return {
      success: true,
      data: [
        {
          id: '1',
          totalAmount: 500,
          currency: 'INR',
        },
      ],
    };
  }
}
```
In this example, we have designed a RESTful API for managing transactions in an expense tracking application. The API follows REST standards, uses appropriate HTTP methods and status codes, implements pagination, filtering, and sorting, and includes versioning to allow for future changes without breaking existing clients.

## Error Handling
Error handling is a critical aspect of any application, as it ensures that your application can gracefully handle unexpected situations and provide meaningful feedback to users. In NestJS, you can implement error handling using exception filters, which allow you to catch and handle exceptions thrown in your application.
1. DTO Validataion:
- Use DTOs to validate incoming data and ensure that it meets the expected format and constraints. This can be done using class-validator decorators in your DTO classes. Ex:
```ts
// createTransaction.dto.ts
import { IsString, IsNumber, IsEnum, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsString()
  category: string;

  @IsString()
  note: string;
}

// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // Strip properties that do not have decorators
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
    transform: true, // Automatically transform payloads to DTO instances
  }),
);
```
In this example if user give the request give the bad request like
```json
{
  "amount": -100,
  "type": "invalid",
  "category": "Food",
  "note": "Dinner"
}
```
The validation pipe will catch the error and return a 400 Bad Request response with details about the validation errors:
```json
{
  "statusCode": 400,
  "message": [
    "amount must not be less than 1",
    "type must be one of the following values: income, expense"
  ],
  "error": "Bad Request"
}
```
2. Exception Filters:
- Use exception filters to catch and handle exceptions thrown in your application. You can create custom exception filters to handle specific types of errors and return appropriate responses to the client. Ex:
```ts
import { NotFoundException, BadRequestException } from '@nestjs/common';

if (!transaction) {
  throw new NotFoundException('Transaction not found');
}

if (amount <= 0) {
  throw new BadRequestException('Invalid amount');
}
```
In this example, if a transaction is not found it return
```json
{
  "statusCode": 404,
  "message": "Transaction not found",
  "error": "Not Found"
}
```
3. Global Exception Filter:
- You can also create a global exception filter to catch any unhandled exceptions and return a generic error response. This can help to ensure that your application does not expose sensitive information in error messages and provides a consistent error response format.
```ts
// exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();

      response.status(status).json({
        success: false,
        message,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An unexpected error occurred',
      });
    }
  }
}

// main.ts
app.useGlobalFilters(new GlobalExceptionFilter());
```
In this example, any unhandled exceptions will be caught by the GlobalExceptionFilter and return a 500 Internal Server Error response with a generic error message:
```json
{
  "success": false,
  "message": "An unexpected error occurred"
}
```
4. Custom Error Handling Logic:
- In addition to using exception filters, you can also implement custom error handling logic in your services or controllers. This can be useful for handling specific business logic errors or for logging errors for debugging purposes.
```ts
throw new BadRequestException({
  code: 'INSUFFICIENT_BALANCE',
  message: 'You don’t have enough balance',
});
```
In this example, we throw a BadRequestException with a custom error code and message. The
client will receive a 400 Bad Request response with the custom error details:
```json
{
  "statusCode": 400,
  "message": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "You don’t have enough balance"
  },
  "error": "Bad Request"
}
```
Example of error handling:
- Custom Validation Error Format:
```ts
// main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property, 
            errors: Object.values(error.constraints || {}), 
          }));

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );
```
In this case, if the validation fails, the client will receive a 400 Bad Request response with a structured error message that includes the field name and the specific validation errors for each field:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "errors": ["amount must not be less than 1"]
    },
    {
      "field": "type",
      "errors": ["type must be one of the following values: income, expense"]
    }
  ]
}
```
- Global Exception Filter for Unhandled Exceptions:
```ts
// exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = 500;
    let message: string = 'Internal Server Error';
    let errors = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else {
        const r = res as any;
        message = r.message || message;
        errors = r.errors || null;
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
    });
  }
}

// main.ts
app.useGlobalFilters(new GlobalExceptionFilter());
```
In this code:
- We catch all exceptions using the `@Catch()` decorator.
- Create a GlobalExceptionFilter that implements the `ExceptionFilter` interface.
- In the `catch` method, we determine the HTTP status code and message based on whether the exception is an instance of `HttpException`.
- In the `ctx` object, we get the response object to send the error response back to the client.
- The `response` is structured to include a success flag, status code, message, and any additional errors if available.
- Check `if (exception instanceof HttpException)` to handle known HTTP exceptions and extract their status and message. For unknown exceptions, we default to a 500 Internal Server Error with a generic message.
- This filter will catch any unhandled exceptions in the application and return a consistent error response format to the client, improving the overall error handling and user experience.
- With this setup, you can ensure that all errors in your application are handled gracefully and provide meaningful feedback to users while also maintaining security by not exposing sensitive information in error messages.

## Caching
Caching is a technique used to improve the performance of an application by storing frequently accessed data in a temporary storage location, such as memory or a distributed cache. In NestJS, you can implement caching using the built-in CacheModule, which provides a simple and flexible way to cache data in your application.
- Redis: This is a popular library for caching,
- Cache aside: This is a caching strategy where the application is responsible for managing the cache. When a request is made, the application first checks if the data is available in the cache. If it is, it returns the cached data. If not, it fetches the data from the source (e.g., database or external API), stores it in the cache for future requests, and then returns the data to the caller.
- TTL: Time-to-live (TTL) is a caching strategy where cached data is automatically invalidated after a certain period of time. This can help to ensure that the cache does not become stale and that users always receive up-to-date information. When using TTL, you can specify the duration for which the data should be cached, and after that duration has passed, the cache will automatically remove the data.

1. Redis
- Redis is a popular in-memory data structure store that can be used as a caching solution. It offers high performance and supports various data structures, making it suitable for caching complex data. To use Redis with NestJS, you can install the `ioredis` package and configure the Redis
```ts
// redis.provider.ts
import Redis from 'ioredis';

export const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

// cache.module.ts
import { Module, CacheModule } from '@nestjs/common';
import { redis } from './redis.provider';
@Module({
  imports: [
    CacheModule.register({
      store: redis,
    }),
  ],
  exports: [CacheModule],
})
export class CacheModule {}
```
In this example, we create a Redis client using the `ioredis` package and register it as the cache store in the CacheModule. You can then inject the CacheService into your services or controllers to use Redis for caching data.
```ts
import { Injectable, CacheService } from '@nestjs/common';
@Injectable()
export class SomeService {
  constructor(private cacheService: CacheService) {}

  async getData(key: string): Promise<any> {
    // Check if data is in cache
    const cachedData = await this.cacheService.get(key);
    if (cachedData) {
      return cachedData; // Return cached data if available
    }

    // If not in cache, fetch data from source
    const data = await this.fetchDataFromSource();

    // Store data in cache for future requests
    await this.cacheService.set(key, data, { ttl: 3600 }); // Cache for 1 hour

    return data;
  }
}
```
In this example, the `getData` method first checks if the requested data is available in the cache. If it is, it returns the cached data. If not, it fetches the data from the source (e.g., database or external API), stores it in the cache with a time-to-live (TTL) of 1 hour, and then returns the data to the caller. This approach can significantly improve performance by reducing the number of times you need to fetch data from slower sources.

2. In-Memory Caching
- In-memory caching is a simple caching solution that stores data in the memory of the application process itself. This can be useful for caching small amounts of data that are frequently accessed, but it may not be suitable for larger datasets or applications that require high availability. To implement in-memory caching in NestJS, you can use a simple JavaScript object to store cached data.
```ts
@Injectable()
export class InMemoryCacheService {
  private cache: Record<string, any> = {};

  async get(key: string): Promise<any> {
    return this.cache[key];
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    this.cache[key] = value;

    if (ttl) {
      setTimeout(() => {
        delete this.cache[key]; // Automatically remove data after TTL expires
      }, ttl * 1000);
    }
  }
}
```
In this example, we create an `InMemoryCacheService` that uses a simple JavaScript object to store cached data. The `get` method retrieves data from the cache, while the `set` method stores data in the cache and optionally sets a time-to-live (TTL) to automatically remove the data after a certain period of time. This approach is straightforward and can be effective for small datasets, but it may not be suitable for larger applications or those that require distributed caching across multiple instances.

3. Cache Aside Strategy
- The cache aside strategy is a caching pattern where the application is responsible for managing the cache. When a request is made, the application first checks if the data is available in the cache. If it is, it returns the cached data. If not, it fetches the data from the source (e.g., database or external API), stores it in the cache for future requests, and then returns the data to the caller. This approach allows for more control over when data is cached and can help to ensure that the cache remains up-to-date.
```ts
@Injectable()
export class CacheAsideService {
  constructor(private cacheService: CacheService) {}

  async getData(key: string): Promise<any> {
    // Check if data is in cache
    const cachedData = await this.cacheService.get(key);
    if (cachedData) {
      return cachedData; // Return cached data if available
    }

    // If not in cache, fetch data from source
    const data = await this.fetchDataFromSource();

    // Store data in cache for future requests
    await this.cacheService.set(key, data, { ttl: 3600 }); // Cache for 1 hour

    return data;
  }
}
```
In this example, the `getData` method implements the cache aside strategy. It first checks if the requested data is available in the cache. If it is, it returns the cached data. If not, it fetches the data from the source, stores it in the cache with a TTL of 1 hour, and then returns the data to the caller. This approach allows for more control over when data is cached and can help to ensure that users always receive up-to-date information while still benefiting from improved performance through caching.

4. Time-to-Live (TTL) Caching
- Time-to-live (TTL) caching is a strategy where cached data is automatically invalidated after a certain period of time. This can help to ensure that the cache does not become stale and that users always receive up-to-date information. When using TTL, you can specify the duration for which the data should be cached, and after that duration has passed, the cache will automatically remove the data.
```ts
@Injectable()
export class TTLCacheService {
  private cache: Record<string, any> = {};

  async get(key: string): Promise<any> {
    return this.cache[key];
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    this.cache[key] = value;

    setTimeout(() => {
      delete this.cache[key]; // Automatically remove data after TTL expires
    }, ttl * 1000);
  }
}
```
In this example, we create a `TTLCacheService` that implements time-to-live caching. The `set` method accepts a TTL parameter, which specifies how long the data should be cached. After the specified duration has passed, the data is automatically removed from the cache. This approach helps to ensure that users always receive up-to-date information while still benefiting from improved performance through caching.

5. Cache Invalidation:
- Cache invalidation is the process of removing or updating cached data when it becomes stale or when the underlying data changes. This is an important aspect of caching, as it helps to ensure that users always receive accurate and up-to-date information. In NestJS, you can implement cache invalidation by using event listeners or by manually clearing the cache when certain actions occur (e.g., when a user updates their profile or when a new transaction is created).
```ts
@Injectable()
export class UserService {
  constructor(private cacheService: CacheService) {}

  async updateUserProfile(userId: string, profileData: any): Promise<void> {
    // Update user profile in the database
    await this.updateUserInDatabase(userId, profileData);

    // Invalidate cache for the user's profile
    await this.cacheService.del(`user_profile_${userId}`);
  }
}
```
In this example, when a user updates their profile, we first update the user information in the database and then invalidate the cache for that user's profile by deleting the cached data using the `del` method of the CacheService. This ensures that the next time the user's profile is requested, it will be fetched from the database and stored in the cache again, providing users with up-to-date information while still benefiting from caching performance improvements.

## Rate Limiting & Security
1. Rate Limiting:
- Rate limiting is a technique used to control the number of requests that a client can make to an API within a certain time period. This can help to prevent abuse and protect your application from denial-of-service (DoS) attacks. In NestJS, you can implement rate limiting using the `@nestjs/throttler` package, which provides decorators and guards to easily apply rate limits to your routes.
**denial-of-service (DoS) attacks: It is a type of attack where an attacker attempts to make a machine or network resource unavailable to its intended users by overwhelming it with a flood of illegitimate requests.**
```ts
// app.module.ts
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60, // Time to live (in seconds) for each request
      limit: 100, // Maximum number of requests allowed within the TTL
    }),
    // ... other imports
   ],
    controllers: [AppController],
    providers: [
      AppService,
      {
        provide: APP_GUARD,
        useClass: ThrottlerGuard, // Use the ThrottlerGuard as a global guard to apply rate limiting to all routes
      },
    ],
})
export class AppModule {}

// transactions.controller.ts
import { Throttle } from '@nestjs/throttler';
@Controller('transactions')
export class TransactionsController {
  @Throttle({ default: { limit: 5, ttl: 60 } }) // Apply rate limiting to this route (5 requests per minute)
  @Get()
  findAll() {
    // ... implementation
  }
}
```
In this example, we configure the `ThrottlerModule` in the `AppModule` to set a global rate limit of 100 requests per minute (60 seconds). We also use the `ThrottlerGuard` as a global guard to apply this rate limit to all routes in the application. Additionally, we can apply specific rate limits to individual routes using the `@Throttle` decorator, as shown in the `TransactionsController`, where we limit the `findAll` route to 5 requests per minute. This helps to protect our application from abuse and ensures that it remains responsive for all users.

2. CORS (Cross-Origin Resource Sharing):
- CORS is a security feature implemented by web browsers to restrict web applications from making requests to a different domain than the one that served the web page. In NestJS, you can enable CORS to allow your API to be accessed from different origins, which is especially important when building APIs that will be consumed by web applications hosted on different domains.
```ts
// main.ts
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://example.com', // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
  });

  await app.listen(3000);
}
bootstrap();
```
In this example, we enable CORS in the `main.ts` file by calling the `enableCors` method on the NestJS application instance. We specify the allowed origin (e.g., `https://example.com`), the allowed HTTP methods, and the allowed headers. This configuration allows web applications hosted on `https://example.com` to make requests to our API while still maintaining security by restricting access from other origins.

3. Helmet:
- Helmet is a middleware that helps to secure your Express applications by setting various HTTP headers. In NestJS, you can use Helmet to enhance the security of your API by protecting it against common vulnerabilities such as cross-site scripting (XSS), clickjacking, and other attacks. Install the `helmet` package and use it in your `main.ts` file to apply security headers to all incoming requests.
```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet()); // Use Helmet to set security-related HTTP headers

  await app.listen(3000);
}
bootstrap();
```
In this example, we import the `helmet` middleware and use it in the `main.ts` file to apply security-related HTTP headers to all incoming requests. Helmet helps to protect your application from various web vulnerabilities by setting headers such as `Content-Security-Policy`, `X-Frame-Options`, `X-XSS-Protection`, and others. This is an important step in securing your API and ensuring that it is protected against common attacks.

4. OWASP Top 10:
- The OWASP Top 10 is a list of the most critical web application security risks, as identified by the Open Web Application Security Project (OWASP). When building your API, it's important to be aware of these risks and take steps to mitigate them. Some common OWASP Top 10 risks include:
- Injection: This occurs when untrusted data is sent to an interpreter as part of a command or query. To prevent injection attacks, always validate and sanitize user input, and use parameterized queries when interacting with databases.
- Broken Authentication: This happens when authentication and session management are implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens. To mitigate this risk, use strong authentication mechanisms, implement multi-factor authentication, and ensure that session tokens are securely stored and transmitted.
- Sensitive Data Exposure: This occurs when sensitive data is not properly protected, allowing attackers to access it. To prevent this, ensure that sensitive data is encrypted both in transit and at rest, and implement proper access controls to restrict who can access the data.
- XML External Entities (XXE): This happens when an application processes XML input that contains a reference to an external entity, which can lead to data exposure or denial of service. To mitigate this risk, disable external entity processing in your XML parsers and validate all XML input.
- Broken Access Control: This occurs when access controls are not properly enforced, allowing attackers to access unauthorized resources. To prevent this, implement proper access control mechanisms, such as role-based access control (RBAC), and ensure that all access control checks are performed on the server side.
- Security Misconfiguration: This happens when security settings are not properly configured, allowing attackers to exploit vulnerabilities. To mitigate this risk, ensure that your application and server configurations are secure, keep software up to date, and regularly review and test your security settings.
- Cross-Site Scripting (XSS): This occurs when an application includes untrusted data in a web page without proper validation or escaping, allowing attackers to execute malicious scripts in the user's browser. To prevent XSS attacks, always validate and sanitize user input, and use appropriate encoding when displaying data in the browser.
- Insecure Deserialization: This happens when an application deserializes untrusted data, which can lead to remote code execution or other attacks. To mitigate this risk, avoid deserializing untrusted data, and if deserialization is necessary, use a safe and secure deserialization library.
- Using Components with Known Vulnerabilities: This occurs when an application uses libraries or components that have known security vulnerabilities. To prevent this, regularly update your dependencies and use tools like `npm audit` to identify and fix vulnerabilities in your dependencies.
- Insufficient Logging and Monitoring: This happens when an application does not have proper logging and monitoring in place, allowing attackers to exploit vulnerabilities without being detected. To mitigate this risk, implement comprehensive logging and monitoring to detect and respond to security incidents in a timely manner.
By being aware of these OWASP Top 10 risks and implementing appropriate security measures, you can help to protect your API from common vulnerabilities and ensure that it is secure for your users.