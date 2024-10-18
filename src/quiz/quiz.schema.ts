import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

export enum QuestionType {
  ShortAnswer = 'short-answer',
  Radio = 'radio',
  Checkbox = 'checkbox',
  Dropdown = 'dropdown',
}

export enum OptionType {
  Image = 'image',
  Text = 'text',
}

@Schema()
export class Option {
  @Prop({ enum: OptionType, required: true })
  type: OptionType;

  @Prop({ required: true })
  value: string;

  @Prop({ required: true })
  correctAnswer: boolean;
}

export const OptionSchema = SchemaFactory.createForClass(Option);

@Schema()
export class Question {
  @Prop({ required: true })
  question: string;

  @Prop({ enum: QuestionType, required: true })
  type: QuestionType;

  @Prop({ type: [OptionSchema], required: true })
  options: Option[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema()
export class Quiz {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ type: [QuestionSchema], required: true })
  questions: Question[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
