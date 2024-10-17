import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class InstructorDocument {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [String], ref: 'Course', required: false })
  taughtCourses: string[]; // References to courses taught by the instructor
}

export type Instructor = HydratedDocument<InstructorDocument>;
export const InstructorSchema = SchemaFactory.createForClass(InstructorDocument);
