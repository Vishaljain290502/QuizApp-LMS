import { Controller, Post, Body, Get, Param, Put, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, UpdateQuizDto, StartQuizDto, SubmitAnswerDto } from './dto/dto';
import { Quiz } from './quiz.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as multer from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('quizzes') 
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  // Create a new quiz
  @Post()
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({ status: 201, description: 'The quiz has been successfully created.', type: Quiz })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateQuizDto }) // Documenting the request body type
  async createQuiz(@Body() createQuizDto: CreateQuizDto): Promise<Quiz> {
    return await this.quizService.createQuiz(createQuizDto);
  }

  // Get a quiz by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a quiz by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Quiz ID' })
  @ApiResponse({ status: 200, description: 'The quiz has been successfully retrieved.', type: Quiz })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  async getQuizById(@Param('id') quizId: string): Promise<Quiz> {
    return await this.quizService.getQuizById(quizId);
  }

  // Get all quizzes
  @Get()
  @ApiOperation({ summary: 'Get all quizzes' })
  @ApiResponse({ status: 200, description: 'List of quizzes retrieved.', type: [Quiz] })
  async getAllQuizzes(): Promise<Quiz[]> {
    return await this.quizService.getAllQuizzes();
  }

  // Update a quiz
  @Put(':id')
  @ApiOperation({ summary: 'Update a quiz' })
  @ApiParam({ name: 'id', required: true, description: 'Quiz ID' })
  @ApiResponse({ status: 200, description: 'The quiz has been successfully updated.', type: Quiz })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  @ApiBody({ type: UpdateQuizDto }) // Documenting the request body type
  async updateQuiz(
    @Param('id') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<Quiz> {
    return await this.quizService.updateQuiz(quizId, updateQuizDto);
  }

  // Delete a quiz
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quiz' })
  @ApiParam({ name: 'id', required: true, description: 'Quiz ID' })
  @ApiResponse({ status: 200, description: 'The quiz has been successfully deleted.', type: Quiz })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  async deleteQuiz(@Param('id') quizId: string): Promise<Quiz> {
    return await this.quizService.deleteQuiz(quizId);
  }

  // Upload quiz file
  @Post('/upload')
  @ApiOperation({ summary: 'Upload a quiz file' })
  @ApiConsumes('multipart/form-data') // Specifies that the endpoint consumes multipart/form-data
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads');
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 5 }, // Optional: limit file size to 5MB
    }),
  )
  @ApiResponse({ status: 201, description: 'File uploaded successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  uploadQuizFile(@UploadedFile() file: Express.Multer.File) {
    console.log('Uploaded file:', file);
  }

  // Start a quiz
  @Post('/start')
  @ApiOperation({ summary: 'Start a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz started successfully.' })
  @ApiResponse({ status: 404, description: 'Quiz not found.' })
  @ApiBody({ type: StartQuizDto }) // Documenting the request body type
  async startQuiz(@Body() startQuizDto: StartQuizDto) {
    // Implement start quiz logic here
  }

  // Submit an answer
  @Post('/submit-answer')
  @ApiOperation({ summary: 'Submit an answer to a quiz question' })
  @ApiResponse({ status: 200, description: 'Answer submitted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid answer submission.' })
  @ApiResponse({ status: 404, description: 'Quiz or question not found.' })
  @ApiBody({ type: SubmitAnswerDto }) // Documenting the request body type
  async submitAnswer(@Body() submitAnswerDto: SubmitAnswerDto) {
    // Implement submit answer logic here
  }
}
