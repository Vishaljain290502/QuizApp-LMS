import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

// src/lessons/dto/create-lesson.dto.ts
export class CreateLessonDto {
  @ApiProperty({
    description:"Title of the lesson",
    example:"Mata"
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description:"Content of the lesson",
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description:"Modeles of lesson",
  })
  @IsNotEmpty()
  @IsString()
  module: string; 

  @ApiProperty({
    description:"Date of the lesson at which time its started"
  })
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @ApiProperty({
    description:"Duration in minutes 2hours = 120min",
    example:"120min"
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    description:"Lesson is active or not"
  })
  @IsBoolean()
  isActive?: boolean;
  }
  