import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

// src/modules/dto/create-module.dto.ts
export class CreateModuleDto {
  @ApiProperty({
    description:"Title of the Module"
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description:"Content of the module"
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description:"Duration of the Module"
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({
    description:"Curse Name"
  })
  @IsNotEmpty()
  @IsString()
  course: string;
  }
  


  