import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

export enum QuizMode {
  Flexible = 'flexible',   
  Guaranteed = 'guaranteed', 
}

export enum QuizStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
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

  @Prop()
  description: string;

  @Prop()
  test: string;

  @Prop()
  image: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema()
export class WinningAmount {
  @Prop({ required: true, min: 1 })
  place: number; 

  @Prop({ required: true, min: 0 })
  amount: number;
}

export const WinningAmountSchema = SchemaFactory.createForClass(WinningAmount);

@Schema()
export class Quiz {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: [QuestionSchema], required: true })
  questions: Question[];

  @Prop({ type: Types.ObjectId, ref: 'MainTopic', required: true })
  mainTopic: Types.ObjectId;
  
  @Prop({ type: [{ type: Types.ObjectId, ref: 'SubTopic' }], required: true })
  subTopics: Types.ObjectId[];
  

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ enum: QuizStatus, default: QuizStatus.Draft })
  status: QuizStatus;

  @Prop({ type: Number, required: true })
  totalWinningAmount: number;
  
  @Prop({ type: [WinningAmountSchema], required: true })
  winningAmounts: WinningAmount[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  playedBy: Types.ObjectId[];


  @Prop({ enum: QuizMode })
  quizMode: QuizMode;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
