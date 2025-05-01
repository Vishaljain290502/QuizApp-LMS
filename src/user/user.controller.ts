import { Body, Controller, Get, Param, Patch, HttpStatus, NotFoundException, Post, Put, Delete, Type, InternalServerErrorException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { Types } from 'mongoose';
import { UpdateUserDto,PaymentDetailsDto } from './dto/user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../helper/cloudinary.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file')) 
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new InternalServerErrorException('No image uploaded'); 
    }
    const image = await this.cloudinaryService.uploadFile(file, 'user', 'image');
    return  {
      status:HttpStatus.OK,
      message:"Image uploaded successfullly",
      url:image
    }
  }

  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved all users', type: '[User]' })
  @ApiResponse({ status: 404, description: 'No users found' })
  @Get('/getAllUsers')
  async getAllUsers(): Promise<{ statusCode: number; message: string; data: User[] }> {
    const users = await this.userService.getAllUsers();
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved all users',
      data: users,
    };
  }

  @ApiOperation({ summary: 'Fetch a user by ID' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved user', type: 'User' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('fetchUserById/:id')
  async fetchUserById(@Param('id') id: Types.ObjectId): Promise<{ statusCode: number; message: string; data: User }> {
    const user = await this.userService.fetchUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved user',
      data: user,
    };
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'Successfully updated user', type: 'User' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch('updateUserById/:id')
  async updateUserById(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<{ statusCode: number; message: string; data: User }> {
    const updatedUser = await this.userService.updateUserById(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully updated user',
      data: updatedUser,
    };
  }

  @Get('joined/:userId')
  @ApiOperation({ summary: 'Get quizzes joined by the user' })
  @ApiResponse({ status: 200, description: 'List of joined quizzes' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getJoinedQuizzes(@Param('userId') userId: string) {
    const user = await this.userService.findUserById(Types.ObjectId.createFromHexString(userId));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log(user.joinedQuizzes); 
    return { statusCode: 200, quizzes: user.joinedQuizzes };
  }
  

  @Get('completed/:userId')
  @ApiOperation({ summary: 'Get quizzes completed by the user' })
  @ApiResponse({ status: 200, description: 'List of completed quizzes' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getCompletedQuizzes(@Param('userId') userId: Types.ObjectId) {
    const user = await (await this.userService.findUserById(userId)).populate('quizzesCompleted');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { statusCode: 200, quizzes: user.quizzesCompleted };
  }

  @Get('all/:userId')
  @ApiOperation({ summary: 'Get all quizzes the user has interacted with' })
  @ApiResponse({ status: 200, description: 'List of all quizzes' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getAllQuizzes(@Param('userId') userId: Types.ObjectId) {
    const user = await this.userService.findUserById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.populate('joinedQuizzes');
    await user.populate('quizzesCompleted');

    // Merge joined and completed quizzes, avoiding duplicates
    const quizMap = new Map();
    user.joinedQuizzes.forEach((quiz) => quizMap.set(quiz._id.toString(), quiz));
    user.quizzesCompleted.forEach((quiz) => quizMap.set(quiz._id.toString(), quiz));

    return { statusCode: 200, quizzes: Array.from(quizMap.values()) };
  }




  
    /**
     * ➕ Add Payment Details
     */
    @Post('payment-details/:id')
    addPaymentDetails(
      @Param('id') id: Types.ObjectId,
      @Body() paymentDetailsDto: PaymentDetailsDto,
    ) {
      return this.userService.addPaymentDetails(id, paymentDetailsDto);
    }
  
    /**
     * ✏️ Update Payment Details
     */
    @Put('payment-details/:id')
    updatePaymentDetails(
      @Param('id') id: Types.ObjectId,
      @Body() paymentDetailsDto: PaymentDetailsDto,
    ) {
      return this.userService.updatePaymentDetails(id, paymentDetailsDto);
    }
  
    /**
     * ❌ Delete Payment Details
     */
    @Delete('payment-details/:id')
    deletePaymentDetails(@Param('id') id: Types.ObjectId) {
      return this.userService.deletePaymentDetails(id);
    }

}
