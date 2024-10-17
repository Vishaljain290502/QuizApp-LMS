// src/lessons/schemas/lesson.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';  // For referencing other models (e.g., Course, Module)

@Schema()
export class LessonDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  module: Types.ObjectId; 

  @Prop({ type: Date, required: true })
  date: Date; 

  @Prop({ type: Number, default: 0 })
  duration: number; 

  @Prop({ default: true })
  isActive: boolean;
}

export type Lesson = HydratedDocument<LessonDocument>;
export const LessonSchema = SchemaFactory.createForClass(LessonDocument);
