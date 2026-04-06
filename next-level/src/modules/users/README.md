## Users:
This module is responsible for managing users in the application. It provides functionalities such as creating, updating, and deleting user accounts.

### User Schema:
`schemas/user.schema.ts`:
```ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  userName!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    index: true,
  })
  email!: string;

  @Prop({ required: true, minLength: 6, select: false })
  password!: string;

  @Prop({ default: '' })
  imgID!: string;

  @Prop({ default: '' })
  imgURL!: string;

  @Prop({ default: '', select: false })
  otp!: string;

  @Prop({ select: false })
  otpExpiresAt!: Date;

  @Prop({ default: '', select: false })
  tempToken!: string;

  @Prop({ select: false })
  tempTokenExpires!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
```
This is the replacement of user.model.ts in express.
In this code:
- First we import necessary decorators and types from `@nestjs/mongoose` and `mongoose`.
- We define a `UserDocument` type that represents a hydrated document of the `User` schema. hydrated document means that it has all the properties of the schema and also includes any virtuals or methods defined on the schema.
- We use the `@Schema` decorator to define the `User` class as a Mongoose schema. The `timestamps: true` option automatically adds `createdAt` and `updatedAt` fields to the schema.
- We define various properties for the `User` schema using the `@Prop` decorator. Each property has its own validation rules and options. For example, the `email` property is required, unique, lowercase, trimmed, and must match a valid email format.
- Finally, we create the `UserSchema` using the `SchemaFactory.createForClass(User)` method, which generates a Mongoose schema based on the `User` class definition.

### User DTO:
DTO stands for Data Transfer Object. It is a design pattern used to transfer data between different layers of an application. In NestJS, DTOs are often used to define the shape of data that is sent and received by controllers.

`dto/create-user.dto.ts`:
```ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString() 
  userName!: string;

  @IsEmail() 
  email!: string;

  @IsString() 
  @MinLength(6) 
  password!: string;
}

// main.ts
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );
```
In this code:
- First we install the `class-validator` and `class-transformer` packages to use validation decorators.
- We import necessary decorators from `class-validator`.
- We define a `CreateUserDTO` class that represents the data structure for creating a new user. This class has three properties: `userName`, `email`, and `password`.
- Each property is decorated with validation decorators to enforce certain rules. For example, `userName` must be a string, `email` must be a valid email address, and `password` must be a string with a minimum length of 6 characters.
- This DTO can be used in the controller to validate incoming data when creating a new user.
- After declare the DTO, we also need to set up global validation pipes in the `main.ts` file to enable validation for all incoming requests. The `ValidationPipe` will automatically validate the incoming data against the defined DTOs and throw errors if the validation fails.
- `whitelist: true` will strip any properties that are not defined in the DTO, while `forbidNonWhitelisted: true` will throw an error if any non-whitelisted properties are present. `transform: true` will automatically transform the incoming data to match the DTO's types.

### User Service:
`user.srvice.ts`:
```ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/shared/services/cloudinary.service';
import { MailService } from 'src/shared/services/mail.service';
import { CreateUserDTO } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private mailService: MailService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // This is the create method, it takes a partial user object and creates a new user in the database
  async registerUser(data: CreateUserDTO) {
    const { userName, email, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      userName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      this.configService.get<string>('JWT_SECRET'),
      { expiresIn: '1h' },
    );

    return { newUser, token };
  }
}
```
In this code:
- We import necessary decorators and types from `@nestjs/common`, `@nestjs/mongoose`, and other modules.
- We define the `UsersService` class and decorate it with `@Injectable()` to make it available for dependency injection.
- We inject the `User` model using `@InjectModel(User.name)` and other services such as `ConfigService`, `MailService`, and `CloudinaryService` through the constructor.
- We define the `registerUser` method that takes a `CreateUserDTO` object as input. This method is responsible for creating a new user in the database.
- Inside the `registerUser` method, we extract the `userName`, `email`, and `password` from the input data. We then hash the password using `bcrypt` before saving it to the database.
- We create a new user instance using the `userModel` and save it to the database.
- After creating the user, we generate a JWT token using the `jsonwebtoken` library. The token contains the user's ID and is signed with a secret key from the configuration. The token is set to expire in 1 hour.
- Finally, we return the newly created user and the generated token. This allows the client to receive the user information and the token for authentication purposes after registration.

### User Controller:
`users.controller.ts`:
```ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Register user
  @Post()
  async register(@Body() dto: CreateUserDTO, @Res() res: Response) {
    const { newUser, token } = await this.usersService.registerUser(dto);
    res.cookie('token', token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks by only sending cookies for same-site requests
    });
    return await res.json({ newUser });
  }
}
```
In this code:
- We import necessary decorators and types from `@nestjs/common` and other modules.
- We define the `UsersController` class and decorate it with `@Controller('users') to specify the route prefix for all endpoints in this controller.
- We inject the `UsersService` through the constructor to use its methods for handling user-related operations.
- We define the `register` method that handles the registration of a new user. This method is decorated with `@Post()` to indicate that it will handle POST requests to the `/users` endpoint.
- Inside the `register` method, we call the `registerUser` method of the `UsersService` to create a new user and generate a token. We pass the incoming data (DTO) to the service method.
- After receiving the new user and token from the service, we set a cookie named 'token' with the generated token. The cookie is configured to be HTTP-only, secure in production, and have a strict same-site policy to enhance security.
- Finally, we return a JSON response containing the newly created user information. This allows the client to receive the user details after successful registration.

### User Module:
`users.module.ts`:
```ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name, // User.name is the name of the model, which is 'User' in this case
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```
In this code:
- We import necessary decorators and types from `@nestjs/common`, `@nestjs/mongoose`, and other modules.
- We define the `UsersModule` class and decorate it with `@Module()` to specify the module's metadata.
- In the `imports` array, we use `MongooseModule.forFeature()` to register the `User` model with its corresponding schema. This allows us to inject the `User` model into our services and controllers.
- We specify the `UsersController` in the `controllers` array to make it available for handling incoming requests related to users.
- We specify the `UsersService` in the `providers` array to make it available for dependency injection in our controllers and other services.
- Finally, we export the `UsersModule` class so that it can be imported and used in the main application module (`app.module.ts`) to integrate the user functionalities into the overall application.
