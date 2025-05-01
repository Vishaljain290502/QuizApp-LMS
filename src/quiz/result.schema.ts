import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Result {
  @Prop({ type: Types.ObjectId, ref: 'Quiz', required: true })
  quizId: Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string; // Reference to the user who participated

  @Prop({ type: [String], required: true })
  answers: string[]; // User's selected answers for each question

  @Prop({ type: Number, required: true })
  completionTime: number; // Time taken to complete the quiz (in seconds)

  @Prop({ type: Number, required: true })
  score: number; // User's score based on correct answers

  @Prop({ type: Number, required: true })
  rank: number; // Rank of the user in the quiz

  @Prop({ type: Number, required: true, default: 0 })
  correctAnswers: number; // Number of correct answers

  @Prop({ type: Number, required: true, default: 0 })
  incorrectAnswers: number; // Number of incorrect answers
}

export type ResultDocument = Result & Document;
export const ResultSchema = SchemaFactory.createForClass(Result);
