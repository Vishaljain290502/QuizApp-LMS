import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuizService } from './quiz.service';
import { Logger } from '@nestjs/common';
import { StartQuizDto, SubmitAnswerDto } from './dto/dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Quizzes') // Tag for Swagger UI
@WebSocketGateway({ cors: true })
export class QuizGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('QuizGateway');

  // Class-level property to store participants' data
  private participants: Array<{ userId: string; correctAnswers: number }> = [];

  constructor(private readonly quizService: QuizService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @ApiOperation({ summary: 'Start a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz started successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  @SubscribeMessage('startQuiz')
  async handleQuizStart(@MessageBody() startQuizDto: StartQuizDto): Promise<void> {
    const { quizId } = startQuizDto;
    const quiz = await this.quizService.getQuizById(quizId);
    if (!quiz) {
      this.server.emit('quizError', { message: 'Quiz not found' });
      return;
    }

    // Schedule quiz based on startTime
    const now = new Date();
    const delay = new Date(quiz.startTime).getTime() - now.getTime();

    setTimeout(() => {
      this.logger.log('Quiz started!');
      this.server.emit('quizStarted', { message: 'Quiz has started!', quizId });

      let questionIndex = 0;

      const sendNextQuestion = () => {
        if (questionIndex < quiz.questions.length) {
          const currentQuestion = quiz.questions[questionIndex];
          const options = currentQuestion.options.map(option => ({
            value: option.value,
            type: option.type,
          }));

          // Emit the new question to all connected clients
          this.server.emit('newQuestion', {
            question: currentQuestion.question,
            options: options,
            questionIndex: questionIndex,
          });

          // Wait 30 seconds before sending the next question
          setTimeout(() => {
            questionIndex++;
            sendNextQuestion();
          }, 30000);
        } else {
          // Quiz finished, calculate and emit rankings
          const rankedParticipants = this.quizService.calculateRanks(this.participants);
          this.server.emit('quizFinished', { rankings: rankedParticipants });
        }
      };

      sendNextQuestion();
    }, delay);
  }

  @ApiOperation({ summary: 'Submit an answer to a quiz question' })
  @ApiResponse({ status: 200, description: 'Answer submitted successfully' })
  @ApiResponse({ status: 404, description: 'Invalid quiz or question index' })
  @SubscribeMessage('submitAnswer')
  async handleAnswerSubmission(
    @MessageBody() submitAnswerDto: SubmitAnswerDto,
  ): Promise<void> {
    const { userId, quizId, questionIndex, selectedOption } = submitAnswerDto;
    const quiz = await this.quizService.getQuizById(quizId);

    if (!quiz || !quiz.questions[questionIndex]) {
      this.server.emit('quizError', { message: 'Invalid quiz or question index' });
      return;
    }

    const question = quiz.questions[questionIndex];
    const correctOption = question.options.find(option => option.correctAnswer);

    // If no correct option found in the schema
    if (!correctOption) {
      this.server.emit('quizError', { message: 'No correct answer available' });
      return;
    }

    const isCorrect = selectedOption === correctOption.value;

    // Find or create participant entry
    let participant = this.participants.find((p) => p.userId === userId);
    if (!participant) {
      participant = { userId, correctAnswers: 0 };
      this.participants.push(participant);
    }

    // If the answer is correct, increase the correct answer count for the participant
    if (isCorrect) {
      participant.correctAnswers++;
    }

    // Emit the result of the submitted answer to all clients
    this.server.emit('answerSubmitted', {
      userId,
      isCorrect,
      correctAnswer: correctOption.value,
      questionIndex,
    });
  }
}
