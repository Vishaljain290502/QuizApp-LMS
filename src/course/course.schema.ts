import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

export enum ContentType {
  Video = 'video',
  Article = 'article',
  Quiz = 'quiz',
}

@Schema()
export class Content {
  @Prop({ enum: ContentType, required: true })
  type: ContentType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string; 

  @Prop()
  quizId?: string;  
}

export const ContentSchema = SchemaFactory.createForClass(Content);

@Schema()
export class Lesson {
  @Prop({ required: true })
  title: string;

  @Prop({ type: [ContentSchema], required: true })
  contents: Content[];
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

@Schema()
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [LessonSchema], required: true })
  lessons: Lesson[];

  @Prop({ required: true })
  instructor: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
