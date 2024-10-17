import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// For the location field, we need to follow Mongoose's GeoJSON structure.
export @Schema({ _id: false })
class Location {
  @Prop({ type: String, enum: ['Point'], required: true, default: 'Point' })
  type: string;

  @Prop({ type: [Number], required: true, default: [0, 0] })
  coordinates: [number, number];
}

export const LocationSchema = SchemaFactory.createForClass(Location);
