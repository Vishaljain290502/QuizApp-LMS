import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

// src/students/dto/create-student.dto.ts
export class CreateStudentDto {
  @ApiProperty({
    description: 'firstName'
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description:'lastName'
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description:"Email",
    default:"ABC@gmail.com",
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: "Date of the started course",
    example:"29/05/2003",
  })
  @IsNotEmpty()
  @IsString()
  enrolledDate: Date; 

  @ApiProperty({
    description:"Array of strings",
    example:"Python"
  })
  @IsNotEmpty()
  @IsString()
  enrolledCourses: string[]; 
  }


  