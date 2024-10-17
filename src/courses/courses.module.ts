import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './courses.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"Course",schema:CourseSchema}])],
  providers: [CoursesService],
  controllers: [CoursesController]
})
export class CoursesModule {}
