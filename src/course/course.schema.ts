import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  lessons: string[];

  @Prop({ required: true })
  instructor: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
