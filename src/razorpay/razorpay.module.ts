import { Module } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { RazorpayController } from './razorpay.controller';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionModule,  } from 'src/transaction/transaction.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { walletSchema } from 'src/wallet/wallet.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from 'src/transaction/transaction.schema';

@Module({
   imports: [
    MongooseModule.forFeature([{ name: 'TransactionDocument', schema: TransactionSchema }]),
    MongooseModule.forFeature([{ name: 'Wallet', schema: walletSchema }]), 
      TransactionModule,
      WalletModule, 
    ],
  controllers: [RazorpayController],
  providers: [RazorpayService,TransactionService],
})
export class RazorpayModule {}
