## Modules & Decorators
In nestjs we can generate module using the command `nest g module <module-name>`. A module is a class annotated with the `@Module()` decorator. The `@Module()` decorator provides metadata that Nest makes use of to organize the application structure. The `@Module()` decorator takes an object as an argument, which can have the following properties:
- `imports`: A list of modules that are required by this module. These modules are imported and can be used within this module.
- `controllers`: A list of controllers that are instantiated within this module. Controllers are responsible for handling incoming requests and returning responses to the client.
- `providers`: A list of providers that are instantiated by the Nest injector and can be shared across the application. Providers are typically used for services, repositories, and other classes that provide functionality to the application.
- `exports`: A list of providers that are provided by this module and can be used in other modules. This allows you to share providers between modules.
Ex:
```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
```

## Controllers
Controllers are responsible for handling incoming requests and returning responses to the client. In NestJS, controllers are defined using the `@Controller()` decorator. The `@Controller()` decorator takes an optional string argument that specifies the route path for the controller. If no path is provided, the controller will be registered at the root path.
Ex: 
```ts
@Controller('profiles')
```
1. Get all profiles: `GET /profiles`
```ts
 @Get()
  findAll() {
    return [];
  }
```
2. Get a query parameter: `GET /profiles?name=John`
```ts
 @Get()
  findAll(@Query('name') name: string) {
    return `This action returns all profiles with the name ${name}`;
  }
```
3. Get a route parameter: `GET /profiles/:id`
```ts
 @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a profile with the ID ${id}`;
  }
```
4. Create a new profile: `POST /profiles`
```ts
 @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }
```
5. Update a profile: `PUT /profiles/:id`
```ts
 @Put(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return `This action updates a profile with the ID ${id}`;
  }
```
6. Delete a profile: `DELETE /profiles/:id`
```ts
 @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a profile with the ID ${id}`;
  }
```

## Services
Services are responsible for handling the business logic of the application. In NestJS, services are defined using the `@Injectable()` decorator. The `@Injectable()` decorator marks a class as a provider that can be injected into other classes using dependency injection. Services are typically used to handle data access, perform calculations, and implement other business logic that is not directly related to handling HTTP requests. Services can be injected into controllers and other services using the constructor of the class. This allows you to keep your controllers thin and focused on handling HTTP requests, while the services handle the business logic of the application. Ex:
```ts
import { Injectable } from '@nestjs/common';
import { CreateProfileDTO } from './dto/createPost.dto';
import { UpdateProfile } from './dto/updatePost.dto';

@Injectable() // Decorator to mark this class as a provider that can be injected into other classes
export class ProfilesService {
  private profiles = [
    {
      id: 1,
      name: 'John Doe',
    },
    {
      id: 2,
      name: 'Leo',
    },
    {
      id: 3,
      name: 'Alice Smith',
    },
    {
      id: 4,
      name: 'Bob Johnson',
    },
  ];

  // Get all profiles
  findAll() {
    return this.profiles;
  }

  // Get a profile by id
  findOne(id: string) {
    return this.profiles.find((profile) => profile.id === parseInt(id));
  }

  // Create a new profile
  create(data: CreateProfileDTO) {
    return this.profiles.push(data);
  }

  // Update a profile by id
  update(id: string, data: UpdateProfile) {
    const profile = this.profiles.find(
      (profile) => profile.id === parseInt(id),
    );
    if (profile) {
      profile.name = data.name || profile.name;
      return profile;
    }
  }

  // Delete a profile by id
  delete(id: string) {
    this.profiles = this.profiles.filter(
      (profile) => profile.id !== parseInt(id),
    );

    return this.profiles;
  }
}
```
## Exceptions
In NestJS, you can throw exceptions to indicate that an error has occurred. NestJS provides a set of built-in exceptions that you can use to handle common error scenarios. For example, if you want to indicate that a resource was not found, you can throw a `NotFoundException`. This will automatically set the HTTP status code to 404 and return a response with the appropriate error message. You can also create custom exceptions by extending the built-in exceptions or by creating your own exception classes. When you throw an exception in a controller or service, NestJS will catch the exception and return an appropriate response to the client based on the type of exception thrown. Ex:
```ts
 if (!profile) {
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
```
In this example, if the profile with the specified id is not found, a `NotFoundException` is thrown with a message indicating that the profile was not found. This will result in a response with a 404 status code and the error message in the response body. Some common built-in exceptions in NestJS include:
- `BadRequestException`: Indicates that the request was invalid or cannot be processed.
- `UnauthorizedException`: Indicates that the client is not authenticated or does not have the necessary permissions to access the resource.
- `ForbiddenException`: Indicates that the client is authenticated but does not have the necessary permissions to access the resource.
- `NotFoundException`: Indicates that the requested resource was not found.
- `InternalServerErrorException`: Indicates that an unexpected error occurred on the server.
You can also create custom exceptions by extending the built-in exceptions or by creating your own exception classes. For example, you could create a custom exception for a specific error scenario in your application, such as a `ProfileAlreadyExistsException` that is thrown when trying to create a profile that already exists. This allows you to provide more specific error messages and handle different error scenarios in a more granular way.

## Pipes
Pipes are a powerful feature in NestJS that allow you to transform and validate data before it is processed by a controller or service. Pipes can be used to perform tasks such as data validation, transformation, and sanitization.
1. Transformation: Pipes can be used to transform incoming data into a desired format. For example, you can use a pipe to convert a string to a number or to parse a JSON object. Ex:
```ts
 @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return `This action returns a profile with the ID ${id}`;
  }
```
In this example, the `ParseIntPipe` is used to transform the `id` parameter from a string to a number before it is passed to the `findOne` method.


