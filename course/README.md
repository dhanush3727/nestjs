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