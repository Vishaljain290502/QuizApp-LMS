import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletDocument, walletSchema } from './wallet.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Wallet', schema: walletSchema }])],
  controllers: [WalletController],
  providers: [WalletService,WalletDocument],
  exports: [WalletService,WalletDocument], 
})
export class WalletModule {}
