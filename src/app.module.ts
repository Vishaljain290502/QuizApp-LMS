import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperModule } from './helper/helper.module';
import { QuizModule } from './quiz/quiz.module';
import { CourseModule } from './course/course.module';
import { QuizGateway } from './quiz/quiz.gateway';
import { QuizService } from './quiz/quiz.service';
import { TopicsModule } from './topics/topics.module';
import { WalletModule } from './wallet/wallet.module'; 
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { TransactionModule } from './transaction/transaction.module';
import { RazorpayModule } from './razorpay/razorpay.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SmsService } from './sms/sms.service';
import * as dotenv from 'dotenv';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WithdrawlsModule } from './withdrawals/withdrawals.module';
import { BannerModule } from './banner/banner.module';



dotenv.config(); 

@Module({
  imports: [
    UserModule,
    AuthModule,
    CourseModule,
    QuizModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    TopicsModule,
    WalletModule, 
    TransactionModule,
    RazorpayModule,
    ScheduleModule.forRoot(),
    WithdrawlsModule,
    BannerModule,
  ],
  controllers: [
    AppController,  
  ],
  providers: [
    AppService, 
    QuizGateway, SmsService, 
  ],
})
export class AppModule {}
