// src/modules/withdrawal-request.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Withdrawls, WithdrawlsSchema } from './withdrawls.schema';
import { WalletDocument, walletSchema } from '../wallet/wallet.schema';
import { WithdrawlsService  } from './withdrawals.service';
import { WithdrawlsController } from './Withdrawals.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Withdrawls', schema: WithdrawlsSchema },
      { name: 'Wallet', schema: walletSchema },
    ]),
  ],
  providers: [WithdrawlsService],
  controllers: [WithdrawlsController],
  exports: [WithdrawlsService]
})
export class WithdrawlsModule {}
