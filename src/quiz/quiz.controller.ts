import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, UpdateQuizDto } from './dto/dto';
import { Quiz } from './quiz.schema';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // Create a new quiz
  @Post()
  async createQuiz(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return await this.quizService.createQuiz(createQuizDto);
  }

  // Get a quiz by ID
  @Get(':id')
  async getQuizById(@Param('id') quizId: string): Promise<Quiz> {
    return await this.quizService.getQuizById(quizId);
  }

  // Get all quizzes
  @Get()
  async getAllQuizzes(): Promise<Quiz[]> {
    return await this.quizService.getAllQuizzes();
  }

  // Update a quiz
  @Put(':id')
  async updateQuiz(
    @Param('id') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<Quiz> {
    return await this.quizService.updateQuiz(quizId, updateQuizDto);
  }

  // Delete a quiz
  @Delete(':id')
  async deleteQuiz(@Param('id') quizId: string): Promise<Quiz> {
    return await this.quizService.deleteQuiz(quizId);
  }
}
