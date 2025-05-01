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
  NotFoundException,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { UserService } from '../user/user.service';
import {
  CreateQuizDto,
  UpdateQuizDto,
  SubmitAnswerDto,
  SubmitQuizDto,
  AddPlayedByDto,
} from './dto/dto';
import { Quiz } from './quiz.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import * as multer from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly userService: UserService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new quiz' })
  async createQuiz(@Body() createQuizDto: CreateQuizDto) {
    try {
      const quiz = await this.quizService.createQuiz(createQuizDto);
      return {
        statusCode: 201,
        message: 'Quiz successfully created',
        data: quiz,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create quiz.');
    }
  }

  @Get('getQuizById/:id')
  @ApiOperation({ summary: 'Get a quiz by ID' })
  async getQuizById(@Param('id') quizId: string) {
    const quiz = await this.quizService.getQuizById(quizId);
    return {
      statusCode: 200,
      message: 'Quiz fetched successfully',
      data: quiz,
    };
  }

  @Get('by-topic/:mainTopicId')
  @ApiOperation({ summary: 'Fetch quizzes by main topic' })
  async getQuizzesByMainTopic(@Param('mainTopicId') mainTopicId: string) {
    const quizzes = await this.quizService.findQuizzesByMainTopic(mainTopicId);
    if (!quizzes.length)
      throw new NotFoundException('No quizzes found for the given topic');
    return {
      statusCode: 200,
      message: 'Quizzes fetched successfully',
      data: quizzes,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all quizzes with pagination' })
  async getAllQuizzes() {
    const quizzes = await this.quizService.getAllQuizzes();
    return {
      statusCode: 200,
      message: 'All quizzes fetched successfully',
      data: quizzes,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a quiz' })
  async updateQuiz(
    @Param('id') quizId: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ) {
    const quiz = await this.quizService.updateQuiz(quizId, updateQuizDto);
    return {
      statusCode: 200,
      message: 'Quiz updated successfully',
      data: quiz,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quiz' })
  async deleteQuiz(@Param('id') quizId: string) {
    const quiz = await this.quizService.deleteQuiz(quizId);
    return {
      statusCode: 200,
      message: 'Quiz deleted successfully',
      data: quiz,
    };
  }

  @Post('/upload')
  @ApiOperation({ summary: 'Upload a quiz file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadQuizFile(@UploadedFile() file: Express.Multer.File) {
    return {
      statusCode: 201,
      message: 'File uploaded successfully',
      data: { filePath: file.path },
    };
  }

  @Post('/submit-quiz/:quizId')
  @ApiOperation({ summary: 'Submit quiz answers' })
  async submitQuiz(
    @Param('quizId') quizId: string,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    const { userId, answers, completionTime } = submitQuizDto;
    if (!Array.isArray(answers))
      throw new BadRequestException('Answers must be an array.');
    const response = await this.quizService.submitQuiz(
      new Types.ObjectId(quizId),
      userId,
      answers,
      completionTime,
    );
    return {
      statusCode: 200,
      message: 'Quiz submitted successfully',
      data: response,
    };
  }

  @Post('/generate-results/:quizId')
  @ApiOperation({ summary: 'Generate quiz results' })
  async generateResults(@Param('quizId') quizId: Types.ObjectId) {
    const results = await this.quizService.generateResults(quizId);
    return {
      statusCode: 200,
      message: 'Quiz results generated successfully',
      data: results,
    };
  }

  @Post('join/:quizId')
  @ApiOperation({ summary: 'Join a quiz' })
  async joinQuiz(
    @Param('quizId') quizId: string,
    @Body() body: { userId: Types.ObjectId },
  ) {
    const { userId } = body;
    if (!userId) throw new BadRequestException('User ID is required');

    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.joinedQuizzes.includes(new Types.ObjectId(quizId))) {
      throw new BadRequestException('User has already joined this quiz');
    }

    user.joinedQuizzes.push(new Types.ObjectId(quizId));
    await user.save();

    return { statusCode: 200, message: 'Quiz joined successfully', data: user };
  }

  @Put('played-by/:quizId')
  @ApiOperation({ summary: 'Add a user to the playedBy array of a quiz' })
  async addPlayedBy(
    @Param('quizId') quizId: string,
    @Body() addPlayedByDto: AddPlayedByDto,
  ) {
    const { userId } = addPlayedByDto;
    const updatedQuiz = await this.quizService.addPlayedBy(quizId, userId);
    return {
      statusCode: 200,
      message: 'User added to playedBy successfully',
      data: updatedQuiz,
    };
  }

  @Post('has-played/:quizId')
  @ApiOperation({ summary: 'Check if a user has played the quiz' })
  async hasUserPlayedQuiz(
    @Param('quizId') quizId: string,
    @Body() body: { userId: string },
  ) {
    const { userId } = body;
    const hasPlayed = await this.quizService.isUserPlayedQuiz(quizId, userId);
    return {
      statusCode: 200,
      message: 'Checked user play status',
      data: { hasPlayed },
    };
  }

  @Post('/review-quiz/:quizId')
  @ApiOperation({ summary: 'Review quiz answers and provide feedback' })
  async reviewQuiz(
    @Param('quizId') quizId: string,
    @Body() body: { userId: string },
  ) {
    const { userId } = body;

    console.log('user', userId, quizId);
    if (!userId) throw new BadRequestException('User ID is required');

    const reviewData = await this.quizService.reviewQuizAnswers(quizId, userId);
    return {
      statusCode: 200,
      message: 'Quiz reviewed successfully',
      data: reviewData,
    };
  }

  @Get('completed-winners')
  async getCompletedQuizzesWithWinners() {
    const result = await this.quizService.getCompletedQuizzesWithWinners();
    return {
      statusCode: 200,
      message: 'Completed quizzes with winners fetched',
      data: result,
    };
  }
}
