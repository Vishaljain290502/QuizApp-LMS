import { Controller, Get, Post, Body, Param, Put, Delete, InternalServerErrorException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto , CreateLessonDto, UpdateCourseDto } from './dto/dto'; 
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../helper/cloudinary.service';

@ApiTags('courses')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService,
    private readonly cloudinaryService: CloudinaryService
  ) {}


  @Get()
  @ApiResponse({ status: 200, description: 'List of courses returned successfully.' })
  async getCourses() {
    return this.courseService.getCourses();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded'); 
    }
    return this.cloudinaryService.uploadFile(file, 'courses', 'video'); 
  }
  
  
  
  @Post("create")
  @ApiResponse({ status: 201, description: 'Course created successfully.' }) 
  @ApiResponse({ status: 400, description: 'Invalid course data.' }) 
  async createCourse( @Body() courseData: CreateCourseDto) {
    try {
      return this.courseService.createCourse(courseData);
    } catch (error) {
      console.error('Error creating course:', error);
      throw new InternalServerErrorException('Failed to create course');
    }
  }


  @Post('add-to-course/:courseId')
  @ApiResponse({ status: 200, description: 'Lesson added to course successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async addLessonToCourse(
    @Param('courseId') courseId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    try {
      const updatedCourse = await this.courseService.addLessonToCourse(courseId, createLessonDto);
      return updatedCourse;
    } catch (error) {
      console.error('Error adding lesson to course:', error);
      throw new InternalServerErrorException('Failed to add lesson to course');
    }
  }

  @Get('get/:id')
  @ApiResponse({ status: 200, description: 'Course found successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Put('update/:id')
  @ApiResponse({ status: 200, description: 'Course updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid course data.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async updateCourse(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    try {
      return this.courseService.updateCourse(id, updateCourseDto);
    } catch (error) {
      console.error('Error updating course:', error);
      throw new InternalServerErrorException('Failed to update course');
    }
  }

  @Delete('delete/:id')
  @ApiResponse({ status: 200, description: 'Course deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async deleteCourse(@Param('id') id: string) {
    try {
      return this.courseService.deleteCourse(id);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new InternalServerErrorException('Failed to delete course');
    }
  }
}
