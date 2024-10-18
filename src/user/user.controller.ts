import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema'; 
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update.user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users') 
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Fetch all users' }) 
  @ApiResponse({ status: 200, description: 'Successfully retrieved all users', type: '[User]' })
  @ApiResponse({ status: 404, description: 'No users found' }) 
  @Get('/getAllUsers')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @ApiOperation({ summary: 'Fetch a user by ID' }) 
  @ApiResponse({ status: 200, description: 'Successfully retrieved user', type: 'User' }) 
  @ApiResponse({ status: 404, description: 'User not found' }) 
  @Get('fetchUserById/:id')
  async fetchUserById(@Param('id') id: Types.ObjectId): Promise<User> {
    return this.userService.fetchUserById(id);
  }

  @ApiOperation({ summary: 'Update user by ID' }) 
  @ApiResponse({ status: 200, description: 'Successfully updated user', type: 'User' }) 
  @ApiResponse({ status: 404, description: 'User not found' }) 
  @Patch('updateUserById/:id')
  async updateUserById(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUserById(id, updateUserDto);
  }
}
