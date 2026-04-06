import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsString() // Validate that the userName property is a string
  userName!: string;

  @IsEmail() // Validate that the email property is a valid email address
  email!: string;

  @IsString() // Validate that the password property is a string
  @MinLength(6) // Validate that the password property has a minimum length of 6 characters
  password!: string;
}
