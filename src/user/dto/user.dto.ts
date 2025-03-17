import { IsString, IsBoolean, IsDate, IsOptional, MaxLength, MinLength, IsNotEmpty, IsEmail, IsMongoId, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class UserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The date of birth of the user', type: String, example: '1990-01-01T00:00:00.000Z' })
  @IsDate()
  readonly dob: Date;

  @ApiProperty({ description: 'The email address of the user', example: 'john.doe@example.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: 'The password of the user', example: 'securepassword123' })
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'The city of the user', required: false, example: 'New York' })
  @IsOptional()
  @IsString()
  readonly city?: string;

  @ApiProperty({ description: 'The country of the user', required: false, example: 'USA' })
  @IsOptional()
  @IsString()
  readonly country?: string;

  @ApiProperty({ description: 'The mobile number of the user', required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  readonly mobileNumber?: string;

  @ApiProperty({ description: 'Indicates if the phone number is verified', example: true })
  @IsBoolean()
  readonly isPhoneVerified: boolean;

  @ApiProperty({ description: 'Indicates if the email is verified', example: true })
  @IsBoolean()
  readonly isEmailVerified: boolean;

  @ApiProperty({ description: 'Expiration date for the reset token', required: false, type: String, example: '2024-10-18T00:00:00.000Z' })
  @IsOptional()
  @IsDate()
  readonly resetTokenExpiration?: Date;

  @ApiProperty({ description: 'The OTP for verification', required: false, example: '123456' })
  @IsOptional()
  @IsString()
  readonly otp?: string;

  @ApiProperty({ description: 'The address of the user', required: false, example: '123 Main St, Springfield' })
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiProperty({ description: 'List of quizzes completed by the user', required: false, type: [String], example: ['60b8d6c8f1d8c1a3348f571b'] })
  @IsOptional()
  @IsMongoId({ each: true })
  readonly quizzesCompleted?: string[];

  @ApiProperty({ description: 'List of courses the user is enrolled in', required: false, type: [String], example: ['60b8d6c8f1d8c1a3348f571b'] })
  @IsOptional()
  @IsMongoId({ each: true })
  readonly coursesEnrolled?: string[];

  @ApiProperty({ description: 'Wallet associated with the user', required: false, example: '60b8d6c8f1d8c1a3348f571b' })
  @IsOptional()
  @IsMongoId()
  readonly wallet?: string;
}

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


  @ApiProperty({
    description: 'The city of the user',
    required: false,
    example: 'Indore',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'The state of the user',
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  state?: string;
}
export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'The city of the user',
    required: false,
    example: 'Indore',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'The state of the user',
    required: false,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'The date of birth of the user',
    required: false,
    type: String, 
    example: '1990-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  dob?: Date;

  @ApiProperty({
    description: 'The email address of the user',
    required: false,
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'The password of the user',
    required: false,
    example: 'securepassword123',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'The token associated with the user for authentication',
    required: false,
    example: 'some-jwt-token',
  })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({
    description: 'The mobile number of the user',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  mobileNumber?: string;

  @ApiProperty({
    description: 'Indicates if the phone number is verified',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;

  @ApiProperty({
    description: 'Indicates if the email is verified',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiProperty({
    description: 'Expiration date for the reset token',
    required: false,
    type: String, 
    example: '2024-10-18T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  resetTokenExpiration?: Date;

  @ApiProperty({
    description: 'The OTP for verification',
    required: false,
    example: '123456',
  })
  @IsOptional()
  @IsString()
  otp?: string;

  @ApiProperty({
    description: 'The address of the user',
    required: false,
    example: '123 Main St, Springfield',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Location coordinates of the user in GeoJSON format',
    required: false,
    example: {
      type: 'Point',
      coordinates: [40.73061, -73.935242],
    },
  })
  @IsOptional()
  location?: {
    type: string;
    coordinates: [number, number];
  };
}

export class FetchUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user (MongoDB ObjectId)',
    example: '60b8d6c8f1d8c1a3348f571b', 
  })
  @IsMongoId()
  readonly id: string;
}

export class PaymentDetailsDto {
  @IsString()
  @IsOptional()
  bankName: string;

  @IsString()
  @IsOptional()
  accountHolderName: string;

  @IsString()
  @IsOptional()
  accountNumber: string;

  @IsString()
  @IsOptional()
  ifscCode: string;

  @IsArray()
  @IsOptional()
  upiIds: string[];
}
