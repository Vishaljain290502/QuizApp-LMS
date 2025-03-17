import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema, LessonSchema } from './course.schema';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports:[MongooseModule.forFeature([{name:"Course",schema:CourseSchema}]),
  MongooseModule.forFeature([{name:"Lesson",schema:LessonSchema}]),
  HelperModule],
  providers: [CourseService],
  controllers: [CourseController]
})
export class CourseModule {}
