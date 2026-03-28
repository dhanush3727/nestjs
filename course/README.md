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