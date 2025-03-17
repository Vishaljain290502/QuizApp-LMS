import { BadRequestException, Body, Controller, HttpStatus, InternalServerErrorException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { 
  LoginUserDto, 
  ForgotPasswordDto, 
  ResetPasswordDto, 
  VerifyPhoneDto, 
  VerifyEmailDto 
} from './dto/auth-dto';
import * as nodemailer from 'nodemailer';
import { MailerService } from 'src/helper/mailer.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { SmsService } from 'src/sms/sms.service';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
        private readonly smsService: SmsService,
    ) {}

    @Post('/register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully.' })
    @ApiResponse({ status: 400, description: 'User with Email already exists.' })
    async register(@Body() createUserDto: CreateUserDto) {
        let user = await this.userService.findUserByEmail(createUserDto.email);
        if (user) {
            throw new BadRequestException("User with Email already exists");
        }
        createUserDto.password = this.authService.hashedPassword(createUserDto.password);
        user = await this.userService.createUser(createUserDto);
        return { 
            statusCode: HttpStatus.CREATED, 
            data: user, 
            message: "User registered successfully" 
        };
    }

    @Post('/login')
    @ApiOperation({ summary: 'Login user and return JWT token' })
    @ApiResponse({ status: 200, description: 'Successfully logged in.' })
    @ApiResponse({ status: 400, description: 'Invalid credentials.' })
    async login(@Body() loginUserDto: LoginUserDto) {
        const user = await this.userService.findUserByEmail(loginUserDto.email);
        if (!user) {
            throw new BadRequestException("User Email not Found");
        }
    
        if (!this.authService.matchPassword(loginUserDto.password, user.password)) {
            throw new BadRequestException("Password Not Matched");
        }
    
        const token = this.authService.generateToken(user);
        await this.userService.updateUserById(user._id, { token });
    
        return {
            statusCode: HttpStatus.OK,
            user: this.authService.serializeUser(user),
            token: token,
            message: "User Logged in Successfully",
        };
    }
    
    @Post('/logout')
    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 200, description: 'User logged out successfully.' })
    @ApiResponse({ status: 400, description: 'User not found or already logged out.' })
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
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
      try {
        const user = await this.userService.findUserByPhoneNumber(forgotPasswordDto.mobileNumber);
        if (!user) {
          throw new BadRequestException('User not found');
        }
    
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
        // Store OTP in user database
        await this.userService.updateUserById(user._id, { otp });
    
        // Send OTP via SMS
        // const smsMessage = `Your OTP for password reset is: . Do not share it with anyone.`;
        const smsMessage = `${otp} is your One Time Password (OTP) for login/signup at Testmo. This OTP will only be valid for 10 minutes. Do not share with anyone - TESTMO`;
        await this.smsService.sendSms(user.mobileNumber, smsMessage);

        console.log("otpsendeeddd")
    
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
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
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
            message: 'Password reset successfully' 
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
    await this.userService.updateUserById(userId, { password: hashedNewPassword });

    // Return response
    return {
        statusCode: HttpStatus.OK,
        message: 'Password changed successfully',
    };
    }


    @Post('/verify-phone')
    @ApiOperation({ summary: 'Verify user phone number with OTP' })
    @ApiResponse({ status: 200, description: 'Phone number verified successfully.' })
    @ApiResponse({ status: 400, description: 'User not found or invalid OTP.' })
    async verifyPhone(@Body() verifyPhoneDto: VerifyPhoneDto): Promise<any> {
        const user = await this.userService.findUserByPhoneNumber(verifyPhoneDto.mobileNumber);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const isOtpValid = await this.authService.verifyOtp(user, verifyPhoneDto.otp);
        if (!isOtpValid) {
            throw new BadRequestException('Invalid OTP');
        }
        await this.userService.updateUserById(user._id, { isPhoneVerified: true });
        return { 
            statusCode: HttpStatus.CREATED, 
            message: 'Phone number verified successfully' 
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
        const isOtpValid = await this.authService.verifyOtp(user, verifyEmailDto.otp);
        if (!isOtpValid) {
            throw new BadRequestException('Invalid OTP');
        }
        await this.userService.updateUserById(user._id, { isEmailVerified: true });
        return { 
            statusCode: HttpStatus.CREATED, 
            message: 'Email verified successfully' 
        };
    }
}
