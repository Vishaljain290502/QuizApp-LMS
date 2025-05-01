import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerService } from 'src/helper/mailer.service';
import { UserModule } from '../user/user.module';
import { walletSchema } from '../wallet/wallet.schema';
import { SmsService } from '../sms/sms.service';
import { WalletModule } from '../wallet/wallet.module';


@Module({ 
  imports:[MongooseModule.forFeature([{name:"User",schema:userSchema}]),JwtModule.register({
    secret:"secretformecoceventmanagementsystem"}),
    MongooseModule.forFeature([{ name: 'Wallet', schema: walletSchema }]),
    UserModule,
    WalletModule
    ],
  controllers: [AuthController],
  providers: [AuthService,UserService,MailerService,SmsService],
})
export class AuthModule {}
