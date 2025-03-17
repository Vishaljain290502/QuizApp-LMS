import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionSchema } from './transaction.schema';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TransactionDocument', schema: TransactionSchema }]),
    WalletModule, 
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
