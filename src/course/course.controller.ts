import { Controller, Get, Post, Body } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/dto'; 
import { ApiTags, ApiResponse } from '@nestjs/swagger'; 

@ApiTags('courses') 
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'List of courses returned successfully.' })
  async getCourses() {
    return this.courseService.getCourses();
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Course created successfully.' }) 
  @ApiResponse({ status: 400, description: 'Invalid course data.' }) 
  async createCourse(@Body() courseData: CreateCourseDto) {
    return this.courseService.createCourse(courseData);
  }
}
