import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule'; // Import ScheduleModule
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Quiz, QuizSchema } from './quiz.schema';
import { QuizGateway } from './quiz.gateway';
import { HelperModule } from 'src/helper/helper.module';
import { MainTopicSchema } from 'src/topics/main.topic.schema';
import { SubTopicSchema } from 'src/topics/sub.topic.schema';
import { Result, ResultSchema } from './result.schema';
import { WalletDocument, walletSchema } from '../wallet/wallet.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Add ScheduleModule to enable cron jobs
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: Result.name, schema: ResultSchema },
      { name: 'Wallet', schema: walletSchema },
      { name: 'MainTopic', schema: MainTopicSchema },
      { name: 'SubTopic', schema: SubTopicSchema },
    ]),
    HelperModule
  ],
  controllers: [QuizController],
  providers: [QuizService, QuizGateway],
  exports: [QuizService],
})
export class QuizModule {}
