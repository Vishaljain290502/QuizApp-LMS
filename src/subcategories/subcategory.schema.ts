import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Category } from '../categories/category.schema';

export type SubcategoryDocument = Subcategory & Document;

@Schema()
export class Subcategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: Category;  // Reference to the parent Category

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
