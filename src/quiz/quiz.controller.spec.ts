import { Test, TestingModule } from '@nestjs/testing';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Quiz } from './quiz.schema';
import { CreateQuizDto } from './dto/dto';
import { QuestionType, OptionType } from './quiz.schema';

describe('QuizController', () => {
  let controller: QuizController;
  let service: QuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizController],
      providers: [
        {
          provide: QuizService,
          useValue: {
            createQuiz: jest.fn().mockResolvedValue({ 
              title: 'Sample Quiz',
              startTime: new Date().toISOString(),  // Mock returning ISO string
              questions: [
                {
                  question: 'What is 2 + 2?',
                  type: QuestionType.Radio,
                  options: [
                    { value: '1', type: OptionType.Text, correctAnswer: false },
                    { value: '2', type: OptionType.Text, correctAnswer: false },
                    { value: '3', type: OptionType.Text, correctAnswer: false },
                    { value: '4', type: OptionType.Text, correctAnswer: true },
                  ],
                },
              ],
            }),
            getQuizById: jest.fn(),
            getAllQuizzes: jest.fn(),
            updateQuiz: jest.fn(),
            deleteQuiz: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<QuizController>(QuizController);
    service = module.get<QuizService>(QuizService);
  });

  it('should create a quiz', async () => {
    const createQuizDto: CreateQuizDto = {
      title: 'Sample Quiz',
      startTime: new Date().toISOString(), // Pass ISO string here
      questions: [
        {
          question: 'What is 2 + 2?',
          type: QuestionType.Radio,
          options: [
            { value: '1', type: OptionType.Text, correctAnswer: false },
            { value: '2', type: OptionType.Text, correctAnswer: false },
            { value: '3', type: OptionType.Text, correctAnswer: false },
            { value: '4', type: OptionType.Text, correctAnswer: true },
          ],
        },
      ],
    };

    const result = await controller.createQuiz(createQuizDto);

    expect(result).toHaveProperty('title', 'Sample Quiz');
    expect(result.questions[0].question).toBe('What is 2 + 2?');
    expect(result.questions[0].options[3].value).toBe('4');
    expect(result.questions[0].options[3].correctAnswer).toBe(true);
  });
});
