import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './course.schema';
import { CreateCourseDto } from './dto/dto'; // Import the DTO

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>) {}

  async createCourse(courseData: CreateCourseDto): Promise<Course> {
    const newCourse = new this.courseModel(courseData);
    return newCourse.save();
  }

  async getCourses(): Promise<Course[]> {
    return this.courseModel.find();
  }
}
