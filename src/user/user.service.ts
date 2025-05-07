import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto, PaymentDetailsDto } from './dto/user.dto';
import { LoginUserDto } from 'src/auth/dto/auth-dto';
import { UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { WalletDocument } from '../wallet/wallet.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Wallet') private readonly walletModel: Model<WalletDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Step 1: Create the user
    const user = await this.userModel.create(createUserDto);
    await user.save();


    return user;
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async findUserByPhoneNumber(mobileNumber: string): Promise<User> {
    return this.userModel.findOne({ mobileNumber }).exec();
  }
  
  async findUserByOtp(otp: string): Promise<User | null> {
    return this.userModel.findOne({ otp }).exec();
  }
  
  async findUserById(userId: Types.ObjectId): Promise<User | null> {
    return this.userModel
      .findById(userId)
      .populate({ path: 'joinedQuizzes', model: 'Quiz' }) 
      .exec(); 
  }
  
  
   

  async finduserById(userId: Types.ObjectId): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }
  
  async findUserByIds(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).populate('joinedQuizzes').exec();
  }
  

  async saveResetToken(
    user: User,
    token: string,
    expirationDate: Date,
  ): Promise<void> {
    user.token = token;
    user.resetTokenExpiration = expirationDate;
    await user.save();
  }

  async updatePassword(user: User, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.token = null;
    user.resetTokenExpiration = null;
    await user.save();
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => user.toObject() as User);
  }

  
  async fetchUserById(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate({
        path: 'wallet',
        populate: {
          path: 'transactions', // Populate transactions within the wallet
          model: 'TransactionDocument',
        },
      })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  

  async updateUserById(id: Types.ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async deleteUserById(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId);

    if (!result) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }


  /**
   * ➕ Add Payment Details
   */
  async addPaymentDetails(id: Types.ObjectId, paymentDetailsDto: PaymentDetailsDto): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.bankName = paymentDetailsDto.bankName;
    user.accountHolderName = paymentDetailsDto.accountHolderName;
    user.accountNumber = paymentDetailsDto.accountNumber;
    user.ifscCode = paymentDetailsDto.ifscCode;
    user.upiIds = paymentDetailsDto.upiIds;

    return user.save();
  }

  /**
   * ✏️ Update Payment Details
   */
  async updatePaymentDetails(id: Types.ObjectId, paymentDetailsDto: PaymentDetailsDto): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.bankName = paymentDetailsDto.bankName ?? user.bankName;
    user.accountHolderName = paymentDetailsDto.accountHolderName ?? user.accountHolderName;
    user.accountNumber = paymentDetailsDto.accountNumber ?? user.accountNumber;
    user.ifscCode = paymentDetailsDto.ifscCode ?? user.ifscCode;
    user.upiIds = paymentDetailsDto.upiIds ?? user.upiIds;

    return user.save();
  }

  /**
   * ❌ Delete Payment Details
   */
  async deletePaymentDetails(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.bankName = null;
    user.accountHolderName = null;
    user.accountNumber = null;
    user.ifscCode = null;
    user.upiIds = [];

    return user.save();
  }



}
