import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

// src/courses/dto/create-course.dto.ts
export class CreateCourseDto {
  @ApiProperty({
    description:"Title of the course",
    example:"Python Course"
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description:"Description of course",
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description:"Duration of the course",
    example:"48 Hours"
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    description:"Boolean field",
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description:"StartDate of the course",
  })
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description:"End Date of the course",
  })
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description:"Location of the course",
  })
  @IsOptional()
    readonly location?: {
      type: string;
      coordinates: [number, number];
    };
  }
  
  
  