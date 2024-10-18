import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import ApiProperty for Swagger documentation

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe', 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com', 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The mobile number of the user',
    example: '+1234567890', 
  })
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'strongpassword', 
    minLength: 6, 
    maxLength: 20, 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
