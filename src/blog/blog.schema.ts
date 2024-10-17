// src/blogs/schemas/blog.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class BlogDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  author: string; // Can be a reference to the `User` or `Author` schema, if applicable

  @Prop({ type: [String], default: [] })
  categories: string[]; // Categories or tags for the blog post

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: true })
  isPublished: boolean;
}

export type Blog = HydratedDocument<BlogDocument>;
export const BlogSchema = SchemaFactory.createForClass(BlogDocument);
