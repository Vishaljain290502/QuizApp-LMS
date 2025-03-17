import { Body, Controller, Get, Param, Patch, HttpStatus, NotFoundException, Post, Put, Delete, Type } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { Types } from 'mongoose';
import { UpdateUserDto,PaymentDetailsDto } from './dto/user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
