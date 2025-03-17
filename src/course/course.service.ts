import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument, Lesson, LessonDocument } from './course.schema'; 
import { CreateCourseDto , CreateLessonDto, UpdateCourseDto } from './dto/dto';  


@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Lesson.name) private readonly lessonModel: Model<LessonDocument>,
  ) {}

  // Get all courses
  async getCourses() {
    return this.courseModel.find().exec();
  }

  // Create a new course
  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  async addLessonToCourse(courseId: string, createLessonDto: CreateLessonDto): Promise<Course> {
    // Find the course by ID
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Create the lesson
    const createdLesson = new this.lessonModel(createLessonDto);
    const savedLesson = await createdLesson.save();

    // Add the created lesson to the course
    course.lessons.push(savedLesson);
    await course.save();

    return course;
  }

  // Get a course by ID
  async getCourseById(id: string): Promise<Course> {
    const course = await this.courseModel.findById(id).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  // Update a course by ID
  async updateCourse(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const updatedCourse = await this.courseModel.findByIdAndUpdate(id, updateCourseDto, {
      new: true, // Return the updated document
    }).exec();

    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return updatedCourse;
  }

  // Delete a course by ID
  async deleteCourse(id: string): Promise<void> {
    const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();

    if (!deletedCourse) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }
}
