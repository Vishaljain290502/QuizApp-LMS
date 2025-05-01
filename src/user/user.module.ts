import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userSchema } from './user.schema';
import { walletSchema } from '../wallet/wallet.schema';
import { TransactionSchema } from '../transaction/transaction.schema';
import { HelperModule } from '../helper/helper.module';
import { QuizSchema } from '../quiz/quiz.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'Wallet', schema: walletSchema },
      { name: 'Transaction', schema: TransactionSchema },
      { name: 'Quiz', schema: QuizSchema },
    ]),
    HelperModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
