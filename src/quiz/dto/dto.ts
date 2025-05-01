import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsDateString,
  IsNumber,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, OptionType } from '../quiz.schema';
import { ApiProperty } from '@nestjs/swagger';

// Option DTO
export class CreateOptionDto {
  @ApiProperty({ enum: OptionType, description: 'The type of the option (e.g., text or image).' })
  @IsEnum(OptionType)
  type: OptionType;

  @ApiProperty({ description: 'The value of the option.', example: 'Option A' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Indicates if this option is the correct answer.', example: true })
  @IsBoolean()
  correctAnswer: boolean;
}

// Question DTO
export class CreateQuestionDto {
  @ApiProperty({ description: 'The question text.', example: 'What is the capital of France?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ enum: QuestionType, description: 'The type of the question (e.g., radio, checkbox).' })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiProperty({ type: [CreateOptionDto], description: 'The list of options for this question.' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image?:string;
}

// Quiz Creation DTO
export class CreateQuizDto {
  @ApiProperty({ description: 'The title of the quiz.', example: 'General Knowledge Quiz' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'The start time of the quiz in ISO format.', example: '2024-10-21T10:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'The end time of the quiz in ISO format.', example: '2024-10-21T12:00:00Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ description: 'The main topic ID associated with the quiz.', example: '605c73b2f6a7c2b6d8b8e9a1' })
  @IsMongoId()
  @IsNotEmpty()
  mainTopic: string;

  @ApiProperty({ description: 'List of sub-topic IDs associated with the quiz.' })
  @IsArray()
  @IsMongoId({ each: true })
  subTopics: string[];

  @ApiProperty({ description: 'The price of the quiz.', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: [CreateQuestionDto], description: 'The list of questions in the quiz.' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

// Quiz Update DTO
export class UpdateQuizDto {
  @ApiProperty({ description: 'The title of the quiz.', required: false, example: 'Updated Quiz Title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'The start time of the quiz in ISO format.', required: false, example: '2024-10-21T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ description: 'The end time of the quiz in ISO format.', required: false, example: '2024-10-21T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ description: 'The main topic ID for the quiz.', required: false, example: '605c73b2f6a7c2b6d8b8e9a1' })
  @IsOptional()
  @IsMongoId()
  mainTopic?: string;

  @ApiProperty({ description: 'List of sub-topic IDs for the quiz.', required: false })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  subTopics?: string[];

  @ApiProperty({ description: 'The price of the quiz.', required: false, example: 10 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ type: [CreateQuestionDto], description: 'The list of questions to update in the quiz.', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}

// Start Quiz DTO
export class StartQuizDto {
  @ApiProperty({ description: 'The ID of the quiz to start.', example: '605c73b2f6a7c2b6d8b8e9a1' })
  @IsMongoId()
  @IsNotEmpty()
  quizId: string;
}

// Submit Answer DTO
export class SubmitAnswerDto {
  @ApiProperty({ description: 'The ID of the user submitting the answer.', example: 'user-789' })
  @IsMongoId()
  @IsNotEmpty()
  userId: string; 

  @ApiProperty({ description: 'The ID of the quiz.', example: '605c73b2f6a7c2b6d8b8e9a1' })
  @IsMongoId()
  @IsNotEmpty()
  quizId: string;

  @ApiProperty({ description: 'The index of the question being answered.', example: 0 })
  @IsNumber()
  @IsNotEmpty()
  questionIndex: number;

  @ApiProperty({ description: 'The selected option for the answer.', example: 'Option A' })
  @IsString()
  @IsNotEmpty()
  selectedOption: string;
}

export class SubmitQuizDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  answers: string[];

  @IsNumber()
  @IsNotEmpty()
  completionTime: number; 
}

export class AddPlayedByDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class JoinQuizDto {
  @IsString()
  readonly userId: string;
}

