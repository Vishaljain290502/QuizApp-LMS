import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './quiz.schema';
import { CreateQuizDto, UpdateQuizDto } from './dto/dto';

@Injectable()
export class QuizService {
  calculateRanks(participants: { userId: string; correctAnswers: number; }[]) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
  ) {}

  // Create a new quiz
  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const newQuiz = new this.quizModel(createQuizDto);
    return await newQuiz.save();
  }

  // Get a quiz by ID
  async getQuizById(quizId: string): Promise<Quiz> {
    return await this.quizModel.findById(quizId).exec();
  }

  // Get all quizzes
  async getAllQuizzes(): Promise<Quiz[]> {
    return await this.quizModel.find().exec();
  }

  // Update a quiz
   async updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    return await this.quizModel.findByIdAndUpdate(quizId, updateQuizDto, { new: true }).exec();
  }

  // Delete a quiz
  async deleteQuiz(quizId: string): Promise<Quiz> {
    return await this.quizModel.findByIdAndDelete(quizId).exec();
  }
}
