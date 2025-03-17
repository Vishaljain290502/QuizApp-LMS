// src/services/withdrawal-request.service.ts

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Withdrawls,WithdrawlsDocument } from './withdrawls.schema';
import { WalletDocument } from '../wallet/wallet.schema';

@Injectable()
export class WithdrawlsService {
  constructor(
    @InjectModel('Withdrawls') private withdrawalModel: Model<WithdrawlsDocument>,
    @InjectModel('Wallet') private walletModel: Model<WalletDocument>,
  ) {}

  async createRequest(userId: Types.ObjectId, amount: number) {
    const wallet = await this.walletModel.findOne({ user: userId });
    if (!wallet) throw new NotFoundException('Wallet not found.');
    if (amount > wallet.depositBalance) throw new BadRequestException('Insufficient deposit balance.');

    const withdrawalRequest = new this.withdrawalModel({
      user: userId,
      amount,
      status: 'Pending',
    });
    return withdrawalRequest.save();
  }

  async approveRequest(requestId: string) {
    const request = await this.withdrawalModel.findById(requestId);
    if (!request || request.status !== 'Pending') {
      throw new BadRequestException('Invalid or already processed request.');
    }

    const wallet = await this.walletModel.findOne({ user: request.user });
    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }

    // Check if the user has sufficient deposit balance
    if (request.amount > wallet.depositBalance) {
      throw new BadRequestException('Insufficient deposit balance.');
    }

    // Deduct the amount from deposit balance
    wallet.deductDeposit(request.amount);

    // Update the total balance
    wallet.updateTotalBalance();
    await wallet.save();

    // Update withdrawal request status to Approved
    request.status = 'Approved';
    request.approvedAt = new Date();
    return request.save();
  }
  

  async rejectRequest(requestId: string) {
    const request = await this.withdrawalModel.findById(requestId);
    if (!request || request.status !== 'Pending') throw new BadRequestException('Invalid request.');

    request.status = 'Rejected';
    request.rejectedAt = new Date();
    return request.save();
  }

  async getRequestsByUser(userId: string) {
    return this.withdrawalModel.find({ user: userId });
  }

  async getAllRequests() {
    return this.withdrawalModel.find().populate('user');
  }

  async getRequestById(requestId: string) {
    return await this.withdrawalModel.findById(requestId).populate('user').exec();
  }
  
  
}
