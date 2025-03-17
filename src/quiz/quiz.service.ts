import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Quiz, QuizDocument, QuizStatus } from './quiz.schema';
import { Result, ResultDocument } from './result.schema';
import { CreateQuizDto, UpdateQuizDto, SubmitAnswerDto } from './dto/dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Wallet, WalletDocument } from '../wallet/wallet.schema';

@Injectable()
export class QuizService {
  calculateRanks(participants: { userId: string; correctAnswers: number; }[]) {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(QuizService.name);

  constructor(
    @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
    @InjectModel('Wallet') private walletModel: Model<Wallet>,
  ) {}

  async createQuiz(createQuizDto: CreateQuizDto): Promise<Quiz> {
    try {
      const newQuiz = new this.quizModel(createQuizDto);
      return await newQuiz.save();
    } catch (error) {
      this.logger.error('Error creating quiz', error.stack);
      throw new BadRequestException('Failed to create quiz.');
    }
  }

  async getQuizById(quizId: string): Promise<Quiz> {
    try {
      return await this.quizModel.findById(quizId).exec();
    } catch (error) {
      this.logger.error('Error fetching quiz by ID', error.stack);
      throw new BadRequestException('Quiz not found.');
    }
  }
  
  async findQuizzesByMainTopic(mainTopicId: string): Promise<Quiz[]> {
    try {
      return await this.quizModel
        .find({ mainTopic: mainTopicId })
        .populate('mainTopic') // Populate mainTopic details
        .populate('subTopics') // Populate subTopics details
        .populate({
          path: 'questions', // Populate questions and nested options
          populate: {
            path: 'options',
          },
        })
        .exec();
    } catch (error) {
      this.logger.error(
        `Error fetching quizzes by main topic ID: ${mainTopicId}`,
        error.stack,
      );
      throw new BadRequestException('Failed to fetch quizzes by main topic.');
    }
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      return await this.quizModel
        .find()
        .populate('mainTopic') 
        .populate('subTopics') 
        .populate({
          path: 'questions', 
          populate: {
            path: 'options',
          },
        })
        .exec();
    } catch (error) {
      this.logger.error('Error fetching all quizzes', error.stack);
      throw new BadRequestException('Failed to fetch quizzes.');
    }
  }

  async updateQuiz(quizId: string, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    try {
      return await this.quizModel.findByIdAndUpdate(quizId, updateQuizDto, { new: true }).exec();
    } catch (error) {
      this.logger.error('Error updating quiz', error.stack);
      throw new BadRequestException('Failed to update quiz.');
    }
  }

  async deleteQuiz(quizId: string): Promise<Quiz> {
    try {
      return await this.quizModel.findByIdAndDelete(quizId).exec();
    } catch (error) {
      this.logger.error('Error deleting quiz', error.stack);
      throw new BadRequestException('Failed to delete quiz.');
    }
  }

  
  async joinQuiz(quizId: string, userId: Types.ObjectId): Promise<string> {
    // Check if the quiz exists and is published
    const quiz = await this.quizModel.findOne({ _id: quizId, status: QuizStatus.Published }).exec();
    if (!quiz) {
        throw new NotFoundException('Quiz not found or not published.');
    }

    // Check if the user already joined the quiz
    if (quiz.playedBy.includes(userId)) {
        throw new BadRequestException('User already joined the quiz.');
    }

    // Fetch the user's wallet
    const wallet = await this.walletModel.findOne({ user: userId }).exec();
    if (!wallet) {
        throw new NotFoundException('Wallet not found.');
    }

    // Check if user has enough balance
    if (wallet.totalBalance < quiz.price) {
        throw new BadRequestException('Insufficient balance to join the quiz.');
    }

    // Deduct balance from the deposit or winnings balance
    if (wallet.depositBalance >= quiz.price) {
        wallet.deductDeposit(quiz.price);
    } else {
        wallet.deductWinnings(quiz.price);
    }

    // Save wallet update
    await wallet.save();

    // Add user to the playedBy array
    quiz.playedBy.push(userId);
    await quiz.save();

    return 'User joined the quiz successfully.';
}
 
  @Cron('*/1 * * * *')
  async handleQuizStatus(): Promise<void> {
    const currentTime = new Date();
  
    try {
      // Find quizzes that should start
      const quizzesToStart = await this.quizModel.find({
        status: QuizStatus.Draft,
        startTime: { $lte: currentTime },
      });
  
      for (const quiz of quizzesToStart) {
        quiz.status = QuizStatus.Published;
        await quiz.save();
        this.logger.log(`Quiz "${quiz.title}" has started.`);
      }
  
      // Find quizzes that should end
      const quizzesToEnd = await this.quizModel.find({
        status: QuizStatus.Published,
        endTime: { $lte: currentTime },
      });
  
      for (const quiz of quizzesToEnd) {
        quiz.status = QuizStatus.Archived;
        await quiz.save();
  
        // Ensure quiz is of type QuizDocument, which includes the _id field
        await this.processQuizResults(quiz._id as string); // Cast _id to string
        this.logger.log(`Quiz "${quiz.title}" has ended.`);
      }
    } catch (error) {
      this.logger.error('Error handling quiz status', error.stack);
    }
  }
  
  async processQuizResults(quizId: string): Promise<void> {
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) throw new BadRequestException('Quiz not found.');

    // Mock: Fetch user responses (replace with actual logic)
    const userResponses = []; // Replace with actual responses from your database

    const userScores = userResponses.map((response) => {
      let correctAnswers = 0;
      quiz.questions.forEach((question, index) => {
        const userAnswer = response.answers[index];
        const correctOption = question.options.find(option => option.correctAnswer);
        if (correctOption && correctOption.value === userAnswer) correctAnswers++;
      });
      return { userId: response.userId, score: correctAnswers };
    });

    const rankedUsers = userScores.sort((a, b) => b.score - a.score).map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    for (const user of rankedUsers) {
      await this.resultModel.create({
        quizId,
        userId: user.userId,
        score: user.score,
        rank: user.rank,
      });
    }

    this.logger.log(`Results for quiz "${quiz.title}" have been processed.`);
  }

  async submitQuiz(
    quizId: string,
    userId: string,
    answers: string[] | undefined,
    completionTime: number,
  ): Promise<{ message: string }> {
    // Fetch the quiz details
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new BadRequestException('Quiz not found.');
    }
  
    // Ensure the answers array exists
    if (!Array.isArray(answers)) {
      throw new BadRequestException('Answers must be provided as an array.');
    }
  
    // Ensure the number of answers matches the number of questions
    if (answers.length !== quiz.questions.length) {
      throw new BadRequestException(
        `Answer count mismatch. Expected ${quiz.questions.length}, got ${answers.length}.`,
      );
    }
  
    // Check if the user has already submitted the quiz
    const existingResult = await this.resultModel.findOne({ quizId, userId }).exec();
    if (existingResult) {
      throw new BadRequestException('You have already submitted this quiz.');
    }
  
    // Convert empty strings to null
    const processedAnswers = answers.map((answer) =>
      answer.trim() === '' ? null : answer
    );
  
    // Save the submitted answers and completion time
    await this.resultModel.create({
      quizId,
      userId,
      answers: processedAnswers,
      completionTime,
      score: 0, 
      rank: 0,  
    });
  
    return { message: 'Quiz submitted successfully.' };
  }
  
  
  async generateResults(quizId: string): Promise<any[]> {
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new BadRequestException('Quiz not found.');
    }
  
    // Fetch all results for the quiz
    const results = await this.resultModel.find({ quizId }).populate('userId').exec();
  
    // Check if there are any participants
    if (results.length === 0) {
      throw new BadRequestException('No participants found for this quiz.');
    }
  
    // Calculate scores and correct/incorrect answers for each participant
    const scoredResults = results.map((result) => {
      let score = 0;
      let correctAnswers = 0;
      let incorrectAnswers = 0;
  
      // Compare submitted answers with correct answers
      quiz.questions.forEach((question, index) => {
        const correctOption = question.options.find((option) => option.correctAnswer);
        const userAnswer = result.answers[index];
  
        // If the user's answer matches the correct option
        if (correctOption && correctOption.value === userAnswer) {
          score += 4; // Correct answer, +4 points
          correctAnswers += 1; // Increment correct answers count
        } else if (userAnswer) {
          score -= 1; // Incorrect answer, -1 point
          incorrectAnswers += 1; // Increment incorrect answers count
        }
        // No points for unanswered questions (0 score)
      });
  
      return {
        ...result.toObject(),
        score, // Final calculated score with positive/negative marking
        correctAnswers, // Number of correct answers
        incorrectAnswers, // Number of incorrect answers
      };
    });
  
    // Sort participants by score (descending) and completion time (ascending)
    const rankedResults = scoredResults
      .sort((a, b) => {
        if (b.score === a.score) {
          return a.completionTime - b.completionTime; // If scores are the same, prioritize completion time
        }
        return b.score - a.score; // Otherwise, sort by score in descending order
      })
      .map((result, index) => ({
        ...result,
        rank: index + 1, // Assign rank based on sorted order
      }));
  
    // Distribute prizes based on the winningAmounts array
    const distributedResults = rankedResults.map((result) => {
      const prizeEntry = quiz.winningAmounts.find((entry) => entry.place === result.rank);
      const prize = prizeEntry ? prizeEntry.amount : 0; // Get the prize amount for the rank, if available
  
      return {
        ...result,
        prize,
      };
    });
  
    // Update the results in the database with calculated scores, correct/incorrect answers, ranks, and prizes
    for (const result of distributedResults) {
      await this.resultModel.findByIdAndUpdate(result._id, {
        score: result.score,
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.incorrectAnswers,
        rank: result.rank,
        prize: result.prize, // Update prize in the result model
      });
    }
  
    this.logger.log(`Results and prizes for quiz "${quiz.title}" have been generated.`);
  
    return distributedResults;
  }
  

  @Cron(CronExpression.EVERY_MINUTE)
  async updateQuizStatuses() {
    this.logger.log('Running cron job to update quiz statuses');
    const currentTime = new Date();

    // console.log("ku", {
    //   startTime: { $gt: currentTime },
    //   status: { $ne: QuizStatus.Draft },
    // },)
    try {
      // await this.quizModel.updateMany(
      //   {
      //     startTime: { $gt: currentTime },
      //     status: { $ne: QuizStatus.Draft },
      //   },
      //   { status: QuizStatus.Draft }
      // );
      await this.quizModel.updateMany(
        {
          startTime: { $lte: currentTime },
          endTime: { $gt: currentTime },
          status: { $ne: QuizStatus.Published },
        },
        { status: QuizStatus.Published }
      );

      await this.quizModel.updateMany(
        {
          endTime: { $lte: currentTime },
          status: { $ne: QuizStatus.Archived },
        },
        { status: QuizStatus.Archived }
      );
      this.logger.log('Quiz statuses updated successfully');
    } catch (error) {
      this.logger.error('Error updating quiz statuses', error.message);
    }
  }

  async addPlayedBy(quizId: string, userId: string): Promise<Quiz> {
    // Validate if the `quizId` is valid
    const quiz = await this.quizModel.findById(quizId);
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
    }

    // Check if the userId is already in the playedBy array
    if (quiz.playedBy.includes(new Types.ObjectId(userId))) {
      throw new BadRequestException('User already added to playedBy');
    }
    quiz.playedBy.push(new Types.ObjectId(userId));
    await quiz.save();

    return quiz;
  }

  async isUserPlayedQuiz(quizId: string, userId: string): Promise<boolean> {
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    // Check if the userId exists in the playedBy array
    return quiz.playedBy.includes(new Types.ObjectId(userId));
  } 

  async reviewQuizAnswers(quizId: Types.ObjectId, userId: Types.ObjectId) {
    // Fetch the stored result
    const result = await this.resultModel.findOne({ quizId, userId });
    if (!result) {
      throw new NotFoundException('Result not found for this user');
    }
  
    // Fetch the quiz details along with questions and options
    const quiz = await this.quizModel.findById(quizId).populate('questions');
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }
  
    // Generate feedback
    const feedback = quiz.questions.map((question: any, index: number) => {
      const userAnswer = result.answers[index]; // Fetch user's submitted answer
      const correctOptions = question.options.filter((opt) => opt.correctAnswer).map((opt) => opt.value);
  
      return {
        questionId: question._id,
        question: question.question,
        userAnswer: userAnswer || null,
        correctAnswer: correctOptions,
        isCorrect: correctOptions.includes(userAnswer),
        description: question.description || 'No description available',
      };
    });
  
    return { 
      score: result.score,
      correctAnswers: result.correctAnswers,
      incorrectAnswers: result.incorrectAnswers,
      feedback 
    };
  }
  

}
