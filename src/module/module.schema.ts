import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Course } from '../courses/courses.schema'; 

@Schema()
export class ModuleDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  duration: number; // Duration in hours

  @Prop({ type: String, ref: 'Course', required: true })
  course: Course; // Reference to the Course schema
}

export type Module = HydratedDocument<ModuleDocument>;
export const ModuleSchema = SchemaFactory.createForClass(ModuleDocument);
