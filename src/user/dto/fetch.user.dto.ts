import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; 

export class FetchUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user (MongoDB ObjectId)',
    example: '60b8d6c8f1d8c1a3348f571b', 
  })
  @IsMongoId()
  readonly id: string;
}
