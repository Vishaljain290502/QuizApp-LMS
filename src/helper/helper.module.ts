import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
// import { RedisService } from './redis.service';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    HelperService,
    // RedisService,
    MailerService,
    CloudinaryService,
    ...[CloudinaryProvider], 
  ],
  exports: [HelperService, MailerService, CloudinaryService],
})
export class HelperModule {}
