## dotenv configuration in nestJS
1. Install the `dotenv` package in your NestJS project:
```bash
npm install @nestjs/config
npm install joi
```
- `@nestjs/config` is the official configuration module for NestJS that provides a convenient way to manage environment variables and configuration settings.
- `joi` is a powerful schema validation library that can be used to validate the structure and values of your environment variables, ensuring that they meet the expected format and constraints. This helps to prevent runtime errors caused by misconfigured environment variables.

2. Create a `.env` file in the root of your project and add your environment variables:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
```
3. In your `app.module.ts`, import the `ConfigModule` and configure it to load the `.env` file:
```typescript
ConfigModule.forRoot({
  isGlobal: true,
  validatinoSchema: joi.object({
    MONGO_URI: joi.string().required(),
  })
})
```
It will automatically load the environment variables from the `.env` file and make them available throughout your application.
- `ConfigModule`: This is the main module provided by `@nestjs/config` that allows you to manage and access configuration settings in your NestJS application.
- `ConfigService`: This service is used to access the configuration values defined in your `.env` file or other configuration sources. You can inject this service into your components to retrieve the necessary configuration values.

