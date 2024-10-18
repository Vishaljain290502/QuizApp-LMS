import { BadRequestException, Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
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

@ApiTags('Auth') // Group the API endpoints under the "Auth" tag
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
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
        return { status: HttpStatus.CREATED, data: user, message: "User registered successfully" };
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

        return {
            status: HttpStatus.CREATED,
            user: this.authService.serializeUser(user),
            token // Including the token in the response
        };
    }

    @Post('/forgot-password')
    @ApiOperation({ summary: 'Send OTP for password reset' })
    @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
    @ApiResponse({ status: 400, description: 'User not found.' })
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
        const user = await this.userService.findUserByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
    
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
        // Store OTP in user model or a separate OTP storage (recommended)
        user.otp = otp;
        await this.userService.updateUserById(user._id, { otp });
    
        // Send OTP to the user
        await this.mailerService.sendMail({ email: user.email, otp });
    
        return { status: HttpStatus.CREATED, message: 'OTP sent successfully', Otp: user.otp };
    }

    @Post('/reset-password')
    @ApiOperation({ summary: 'Reset user password using OTP' })
    @ApiResponse({ status: 200, description: 'Password reset successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid OTP.' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<any> {
        const { otp, password } = resetPasswordDto;

        // Ensure that the user is identified correctly
        const user = await this.userService.findUserByOtp(otp); // Assuming `findUserByOtp` is a method that finds a user by OTP
        if (!user) {
            throw new BadRequestException('Invalid OTP');
        }

        // Validate OTP
        if (user.otp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }

        // Update the user's password and clear the OTP
        await this.userService.updateUserById(user._id, {
            password: this.authService.hashedPassword(password),
            otp: null, 
        });

        return { status: HttpStatus.CREATED, message: 'Password reset successfully' };
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
        // Update user verification
        await this.userService.updateUserById(user._id, { isPhoneVerified: true });
        return { status: HttpStatus.CREATED, message: 'Phone number verified successfully' };
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
        // Update user verification status
        await this.userService.updateUserById(user._id, { isEmailVerified: true });
        return { status: HttpStatus.CREATED, message: 'Email verified successfully' };
    }
}
