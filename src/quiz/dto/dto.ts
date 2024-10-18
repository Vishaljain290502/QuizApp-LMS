import { IsString, IsNotEmpty, IsArray, IsEnum, IsBoolean, ValidateNested, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType, OptionType } from '../quiz.schema';

class CreateOptionDto {
  @IsEnum(OptionType)
  type: OptionType;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsBoolean()
  correctAnswer: boolean;
}

class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  startTime: string; // ISO date string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}

export class UpdateQuizDto {
  @IsString()
  title?: string;

  @IsDateString()
  startTime?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}



// dto.ts

export class StartQuizDto {
    @IsString()
    @IsNotEmpty()
    quizId: string;
  }
  
export class SubmitAnswerDto {
    @IsString()
    @IsNotEmpty()
    userId: string;
  
    @IsString()
    @IsNotEmpty()
    quizId: string;
  
    @IsNumber()
    @IsNotEmpty()
    questionIndex: number;
  
    @IsString()
    @IsNotEmpty()
    selectedOption: string;
  }
  
  