// src/blogs/schemas/blog.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class BlogDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User' ,required: true })
  author: string; 

  @Prop({ type: [String], default: [] })
  categories: string[]; 

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: true })
  isPublished: boolean;
}

export type Blog = HydratedDocument<BlogDocument>;
export const BlogSchema = SchemaFactory.createForClass(BlogDocument);
