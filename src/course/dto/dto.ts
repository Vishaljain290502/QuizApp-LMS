import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
    @ApiProperty({ description: 'The title of the course', example: 'Introduction to Programming' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'The description of the course', example: 'Learn the basics of programming.' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'A list of lessons in the course', example: ['Lesson 1', 'Lesson 2'] })
    @IsArray()
    @IsNotEmpty()
    lessons: string[];

    @ApiProperty({ description: 'The instructor of the course', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    instructor: string;
}
