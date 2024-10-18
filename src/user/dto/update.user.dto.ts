import { IsString, IsOptional, IsBoolean, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

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
