import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Location, LocationSchema } from './location.schema'; 

@Schema()
export class CourseDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  duration: number; // Duration in hours or weeks

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: LocationSchema, required: false })
  location: Location;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;
}

export type Course = HydratedDocument<CourseDocument>;
export const CourseSchema = SchemaFactory.createForClass(CourseDocument);
