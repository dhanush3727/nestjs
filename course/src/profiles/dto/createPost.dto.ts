import { IsString, Length } from 'class-validator';

export class CreateProfileDTO {
  // Use class-validator decorators to validate the incoming data
  // In this case, we are validating that the name property is a string and has a length between 3 and 30 characters
  @IsString() // Validate that the name property is a string
  @Length(3, 30) // Validate that the name property has a length between 3 and 30 characters
  name: string;

  @IsString() // Validate that the id property is a string
  id: number;
}
