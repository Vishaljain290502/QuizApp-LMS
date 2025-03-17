import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionDocument } from './transaction.schema';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel('TransactionDocument') private transactionModel: Model<TransactionDocument>,
    private walletService: WalletService, // Inject Wallet Service
  ) {}

  // Create a transaction
  async createTransaction(walletId: string, amount: number, type: 'credit' | 'debit') {
    const wallet = await this.walletService.getWallet(walletId);
    if (!wallet) throw new Error('Wallet not found');

    const transaction = new this.transactionModel({ wallet: walletId, amount, type });

    // Update Wallet Balance
    if (type === 'credit') {
      wallet.totalBalance += amount;
    } else if (type === 'debit') {
      if (wallet.totalBalance < amount) throw new Error('Insufficient balance');
      wallet.totalBalance -= amount;
    }

    wallet.updatedAt = new Date();
    await wallet.save(); 
    transaction.status = 'completed';
    await transaction.save();

    return transaction;
  }

  // Get Transactions by Wallet
  async getTransactions(walletId: string): Promise<TransactionDocument[]> {
    return this.transactionModel.find({ wallet: walletId }).exec();
  }
}
