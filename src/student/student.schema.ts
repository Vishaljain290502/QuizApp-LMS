import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class StudentDocument {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: Date.now })
  enrolledDate: Date;

  @Prop({ type: [String], ref: 'Course', required: false })
  enrolledCourses: string[]; // References to enrolled courses
}

export type Student = HydratedDocument<StudentDocument>;
export const StudentSchema = SchemaFactory.createForClass(StudentDocument);
