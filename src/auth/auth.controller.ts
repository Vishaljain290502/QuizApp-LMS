import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import {
  LoginUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyPhoneDto,
  VerifyEmailDto,
} from './dto/auth-dto';
import * as nodemailer from 'nodemailer';
import { MailerService } from 'src/helper/mailer.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { SmsService } from 'src/sms/sms.service';
import { WalletService } from '../wallet/wallet.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    private readonly smsService: SmsService,
    private readonly walletService: WalletService,
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({
    status: 400,
    description: 'User with this mobile number already exists.',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findUserByPhoneNumber(
      createUserDto.mobileNumber,
    );
    const emailUser =  await this.userService.findUserByEmail(createUserDto.email);
    if(emailUser){
      throw new BadRequestException(
        'User with this email already exists',
      );
    }
    if (user) {
      throw new BadRequestException(
        'User with this mobile number already exists',
      );
    }

    createUserDto.password = this.authService.hashedPassword(
      createUserDto.password,
    );

    // Create user
    const newUser = await this.userService.createUser(createUserDto);

    try {
      // Create wallet
      const wallet = await this.walletService.createWallet(
        newUser._id.toString(),
        'USD',
      );

      // Update user with wallet ID
      await this.userService.updateUserById(newUser._id, {
        wallet: (wallet as any)._id.toString(),
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: {
          ...newUser.toObject(),
          wallet: (wallet as any)._id.toString(),
        },
        message: 'User registered successfully',
      };
    } catch (err) {
      // Rollback: delete the user if wallet creation fails
      await this.userService.deleteUserById(newUser._id.toString());
      throw new InternalServerErrorException(
        'Wallet creation failed. User creation rolled back.',
      );
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login user and return JWT token' })
  @ApiResponse({ status: 200, description: 'Successfully logged in.' })
  @ApiResponse({ status: 400, description: 'Invalid credentials.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.findUserByEmail(loginUserDto.email);
    if (!user) {
      throw new BadRequestException('User Email not Found');
    }

    if (!this.authService.matchPassword(loginUserDto.password, user.password)) {
      throw new BadRequestException('Password Not Matched');
    }

    const token = this.authService.generateToken(user);
    await this.userService.updateUserById(user._id, { token });

    if (loginUserDto.notificationToken) {
      user.notificationToken = loginUserDto.notificationToken;
    }

    await user.save();

    return {
      statusCode: HttpStatus.OK,
      user: this.authService.serializeUser(user),
      token: token,
      message: 'User Logged in Successfully',
    };
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  @ApiResponse({
    status: 400,
    description: 'User not found or already logged out.',
  })
  async logout(@Body('userId') userId: Types.ObjectId) {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.token) {
      throw new BadRequestException('User is already logged out');
    }

    await this.userService.updateUserById(userId, { token: null });

    return {
      statusCode: HttpStatus.OK,
      message: 'User logged out successfully',
    };
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Send OTP for password reset' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    try {
      const user = await this.userService.findUserByPhoneNumber(
        forgotPasswordDto.mobileNumber,
      );
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP in user database with optional expiry
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await this.userService.updateUserById(user._id, { otp });

      // Build message
      const smsMessage = `Hello ${user.name}, You have requested to reset your password. Your OTP (One-Time Password) is:${otp} This OTP is valid for **10 minutes**. Please do not share it with anyone. If you didn't request this, please ignore this email. Best Regards, Testmo Support Team`;

      // Template ID for forgot-password OTP
      const templateId = '987456574357890';

      // Send SMS
      await this.smsService.sendSms(user.mobileNumber, smsMessage, templateId);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'OTP sent successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to send OTP');
    }
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset user password using OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP.' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    const { otp, password } = resetPasswordDto;
    const user = await this.userService.findUserByOtp(otp);
    if (!user || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.userService.updateUserById(user._id, {
      password: this.authService.hashedPassword(password),
      otp: null,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Password reset successfully',
    };
  }

  @Post('/change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid current password.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async changePassword(
    @Body('userId') userId: Types.ObjectId,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<any> {
    // Step 1: Find the user by ID
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Step 2: Check if the current password is correct
    const isPasswordMatched = this.authService.matchPassword(
      currentPassword,
      user.password,
    );
    if (!isPasswordMatched) {
      throw new BadRequestException('Invalid current password');
    }

    // Step 3: Hash the new password
    const hashedNewPassword = this.authService.hashedPassword(newPassword);

    // Step 4: Update the user's password
    await this.userService.updateUserById(userId, {
      password: hashedNewPassword,
    });

    // Return response
    return {
      statusCode: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }

  @Post('/send-otp')
  @ApiOperation({ summary: 'Send OTP for login via mobile number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mobileNumber: { type: 'string', example: '9876543210' },
      },
    },
  })
  async sendOtp(@Body() body: { mobileNumber: string }) {
    const { mobileNumber } = body;

    const user = await this.userService.findUserByPhoneNumber(mobileNumber);
    
    if (!user) throw new BadRequestException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.userService.updateUserById(user._id, { otp });

    const sms = `${otp} is your One Time Password (OTP) for login/signup at Testmo. This OTP will only be valid for 10 minutes. Do not share with anyone - TESTMO`;

    const otpTemplateId = '1707173590027424849';

    await this.smsService.sendSms(mobileNumber, sms, otpTemplateId);

    return { message: 'OTP sent successfully' };
  }

  @Post('/verify-otp')
  @ApiOperation({ summary: 'Verify OTP and log in the user' })
  @ApiResponse({ status: 200, description: 'OTP verified and user logged in.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or expired.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        mobileNumber: { type: 'string', example: '9876543210' },
        otp: { type: 'string', example: '123456' },
        notificationToken: { type: 'string' },
      },
    },
  })
  async verifyOtp(
    @Body()
    body: {
      mobileNumber: string;
      otp: string;
      notificationToken: string;
    },
  ) {
    const { mobileNumber, otp, notificationToken } = body;
    const user = await this.userService.findUserByPhoneNumber(mobileNumber);
    if (!user || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    await this.userService.updateUserById(user._id, { otp: null });
    const token = this.authService.generateToken(user);
    await this.userService.updateUserById(user._id, { token });
    if (notificationToken) {
      user.notificationToken = notificationToken;
    }
    await user.save();
    return {
      statusCode: HttpStatus.OK,
      message: 'OTP verified successfully',
      token,
      user: this.authService.serializeUser(user),
    };
  }

  @Post('/verify-email')
  @ApiOperation({ summary: 'Verify user email with OTP' })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'User not found or invalid OTP.' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const user = await this.userService.findUserByEmail(verifyEmailDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isOtpValid = await this.authService.verifyOtp(
      user,
      verifyEmailDto.otp,
    );
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }
    await this.userService.updateUserById(user._id, { isEmailVerified: true });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Email verified successfully',
    };
  }
}
