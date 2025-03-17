import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
  HttpStatus,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto, UpdateQuizDto, SubmitAnswerDto, SubmitQuizDto, AddPlayedByDto } from './dto/dto';
import { Quiz } from './quiz.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as multer from 'multer';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({ status: 201, description: 'Quiz successfully created.', type: Quiz })
  async createQuiz(@Body() createQuizDto: CreateQuizDto): Promise<{ statusCode: number; data: Quiz }> {
    try {
      const quiz = await this.quizService.createQuiz(createQuizDto);
      return { statusCode: 201, data: quiz };
    } catch (error) {
      throw new BadRequestException('Failed to create quiz.');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a quiz by ID' })
  async getQuizById(@Param('id') quizId: string): Promise<{ statusCode: number; data: Quiz }> {
    const quiz = await this.quizService.getQuizById(quizId);
    return { statusCode: 200, data: quiz };
  }

  @Get('by-topic/:mainTopicId')
  @ApiOperation({ summary: 'Fetch quizzes by main topic' })
  @ApiResponse({ status: 200, description: 'Quizzes fetched successfully', type: [Quiz] })
  @ApiResponse({ status: 404, description: 'No quizzes found for the given main topic ID' })
  async getQuizzesByMainTopic(
    @Param('mainTopicId') mainTopicId: string, // Take mainTopicId as param
  ): Promise<{ statusCode: number; data: Quiz[] }> {
    const quizzes = await this.quizService.findQuizzesByMainTopic(mainTopicId);
    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException('No quizzes found for the given main topic ID');
    }
    return { statusCode: 200, data: quizzes };
  }
  

  @Get()
  @ApiOperation({ summary: 'Get all quizzes with pagination' })
  async getAllQuizzes(
  ): Promise<{ statusCode: number; data: Quiz[] }> {
    const quizzes = await this.quizService.getAllQuizzes();
    return { statusCode: 200, data: quizzes };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a quiz' })
  async updateQuiz(
    @Param('id') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<{ statusCode: number; data: Quiz }> {
    const quiz = await this.quizService.updateQuiz(quizId, updateQuizDto);
    return { statusCode: 200, data: quiz };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quiz' })
  async deleteQuiz(@Param('id') quizId: string): Promise<{ statusCode: number; data: Quiz }> {
    const quiz = await this.quizService.deleteQuiz(quizId);
    return { statusCode: 200, data: quiz };
  }


  @Post('/upload')
  @ApiOperation({ summary: 'Upload a quiz file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
  async uploadQuizFile(@UploadedFile() file: Express.Multer.File): Promise<{ statusCode: number; message: string; filePath: string }> {
    return { statusCode: 201, message: 'File uploaded successfully.', filePath: file.path };
  }


  @Post('/submit-quiz/:quizId')
  @ApiOperation({ summary: 'Submit quiz answers' })
  async submitQuiz(
    @Param('quizId') quizId: string,
    @Body() submitQuizDto: SubmitQuizDto,
  ): Promise<{ statusCode: number; message: string }> {
    const { userId, answers, completionTime } = submitQuizDto;

    // Validate input
    if (!Array.isArray(answers)) {
      throw new BadRequestException('Answers must be an array.');
    }

    const response = await this.quizService.submitQuiz(quizId, userId, answers, completionTime);

    return { statusCode: 200, ...response };
  }

  @Post('/generate-results/:quizId')
  @ApiOperation({ summary: 'Generate quiz results' })
  async generateResults(@Param('quizId') quizId: string): Promise<{ statusCode: number; data: any[] }> {
    const results = await this.quizService.generateResults(quizId);
    return { statusCode: 200, data: results };
  }
  

  // quiz.controller.ts
  @Post('join/:quizId')
  @ApiOperation({ summary: 'Join a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz joined successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  @ApiResponse({ status: 400, description: 'User already joined or invalid request' })
  async joinQuiz(
    @Param('quizId') quizId: string,
    @Body() body: { userId: Types.ObjectId }
  ): Promise<{ statusCode: number; message: string }> {
    const { userId } = body;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    const result = await this.quizService.joinQuiz(quizId, userId);
    return { statusCode: 200, message: result };
  }


  @Put('played-by/:quizId')
  @ApiOperation({ summary: 'Add a user to the playedBy array of a quiz' })
  async addPlayedBy(
    @Param('quizId') quizId: string,
    @Body() addPlayedByDto: AddPlayedByDto,
  ): Promise<{ statusCode: number; message: string; data: Quiz }> {
    const { userId } = addPlayedByDto;
    const updatedQuiz = await this.quizService.addPlayedBy(quizId, userId);
    return { statusCode: 200, message: 'User added to playedBy successfully.', data: updatedQuiz };
  }

  @Get('has-played/:quizId')
  @ApiOperation({ summary: 'Check if a user has played the quiz' })
  @ApiResponse({ status: 200, description: 'User has or has not played the quiz' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  async hasUserPlayedQuiz(
    @Param('quizId') quizId: string,
    @Body() body: { userId: string }, // Accept userId in the body
  ): Promise<{ hasPlayed: boolean }> {
    const { userId } = body;
    const hasPlayed = await this.quizService.isUserPlayedQuiz(quizId, userId);
    return { hasPlayed };
  }
  
  @Post('/review-quiz/:quizId')
  @ApiOperation({ summary: 'Review quiz answers and provide feedback' })
  async reviewQuiz(
    @Param('quizId') quizId: Types.ObjectId,
    @Body() body: { userId: Types.ObjectId } 
  ): Promise<{ statusCode: number; data: any }> {
    const { userId } = body;
    
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
  
    const reviewData = await this.quizService.reviewQuizAnswers(quizId, userId);
  
    return { statusCode: 200, data: reviewData };
  }
  


}
