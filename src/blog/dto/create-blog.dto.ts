import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";


export class CreateBlogDto {
    @ApiProperty({
        description:"Title of the Blog",
        example:"Money",
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description:"content of the blog",
        example:"OCntent of the blog",
    })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({
        description:"Author of the blog",
        example:"Vishal jain",
    })
    @IsNotEmpty()
    @IsString()
    author: string;

    @ApiProperty({
        description:"Categories of Blog",
        example:"coins"
    })
    categories?: string[]; 

    @ApiProperty({
        description:"Blog is active or not",
        example:"true",
        default:"true"
    })
    @IsBoolean()
    isPublished: boolean;
  }
  