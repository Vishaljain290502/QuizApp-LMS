import { IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class UserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'The date of birth of the user',
    type: String, 
    example: '1990-01-01T00:00:00.000Z',
  })
  @IsDate()
  readonly dob: Date;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'securepassword123',
  })
  @IsString()
  readonly password: string;

  @ApiProperty({
    description: 'The token associated with the user for authentication',
    required: false,
    example: 'some-jwt-token',
  })
  @IsOptional()
  @IsString()
  readonly token?: string;

  @ApiProperty({
    description: 'The mobile number of the user',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  readonly mobileNumber?: string;

  @ApiProperty({
    description: 'Indicates if the phone number is verified',
    example: true,
  })
  @IsBoolean()
  readonly isPhoneVerified: boolean;

  @ApiProperty({
    description: 'Indicates if the email is verified',
    example: true,
  })
  @IsBoolean()
  readonly isEmailVerified: boolean;

  @ApiProperty({
    description: 'Expiration date for the reset token',
    required: false,
    type: String, 
    example: '2024-10-18T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  readonly resetTokenExpiration?: Date;

  @ApiProperty({
    description: 'The OTP for verification',
    required: false,
    example: '123456',
  })
  @IsOptional()
  @IsString()
  readonly otp?: string;

  @ApiProperty({
    description: 'The address of the user',
    required: false,
    example: '123 Main St, Springfield',
  })
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiProperty({
    description: 'Location coordinates of the user in GeoJSON format',
    required: false,
    example: {
      type: 'Point',
      coordinates: [40.73061, -73.935242],
    },
  })
  @IsOptional()
  readonly location?: {
    type: string;
    coordinates: [number, number];
  };
}
