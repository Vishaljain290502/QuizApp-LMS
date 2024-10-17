import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

// src/instructors/dto/create-instructor.dto.ts
export class CreateInstructorDto {
  @ApiProperty({
    description:"Firstaname",
    example:"john",
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description:"lastName"
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description:"Email of the Instructor",
    example:"absc@gmail.com",
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description:"Which courses they thought Array",
    example:"Python course,  Java Course",
  })
  taughtCourses: string[]; // Array of Course IDs
  }
  