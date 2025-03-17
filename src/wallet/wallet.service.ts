import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from './wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('Wallet') private walletModel: Model<Wallet>,
  ) {}

  // Create Wallet
  async createWallet(userId: string, currency: string): Promise<WalletDocument> {
    const wallet = new this.walletModel({ currency });
    await wallet.save();
    return wallet;
  }

  // Add funds to the deposit balance
  async addDeposit(walletId: string, amount: number): Promise<WalletDocument> {
    const wallet = await this.walletModel.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    wallet.addDeposit(amount);
    await wallet.save();
    return wallet;
  }

  // Add bonus to the wallet
  async addBonus(walletId: string, amount: number): Promise<WalletDocument> {
    const wallet = await this.walletModel.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    wallet.addBonus(amount);
    await wallet.save();
    return wallet;
  }

  // Add winnings to the wallet
  async addWinnings(walletId: string, amount: number): Promise<WalletDocument> {
    const wallet = await this.walletModel.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    wallet.addWinnings(amount);
    await wallet.save();
    return wallet;
  }

  // Deduct funds from the deposit balance
  async deductDeposit(walletId: string, amount: number): Promise<WalletDocument> {
    const wallet = await this.walletModel.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    wallet.deductDeposit(amount);
    await wallet.save();
    return wallet;
  }

  // Deduct funds from the winnings balance
  async deductWinnings(walletId: string, amount: number): Promise<WalletDocument> {
    const wallet = await this.walletModel.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    wallet.deductWinnings(amount);
    await wallet.save();
    return wallet;
  }

  // Block Wallet
  async blockWallet(walletId: string): Promise<WalletDocument> {
    const wallet = await this.walletModel.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    wallet.isBlocked = true;
    await wallet.save();
    return wallet;
  }

  // Unblock Wallet
  async unblockWallet(walletId: string): Promise<WalletDocument> {
    const wallet = await this.walletModel.findById(walletId);
    if (!wallet) throw new Error('Wallet not found');
    wallet.isBlocked = false;
    await wallet.save();
    return wallet;
  }

  // Get Wallet
  async getWallet(walletId: string): Promise<Wallet> {
    return this.walletModel.findById(walletId).exec();
  }

  async updateTotalBalance(
    walletId: string, 
    amount: number, 
    action: 'add' | 'deduct'
  ): Promise<string> {
    // Find the wallet by ID
    const wallet = await this.walletModel.findById(walletId).exec();
    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }
  
    // Check if the wallet is blocked
    if (wallet.isBlocked) {
      throw new BadRequestException('Wallet is blocked.');
    }
  
    // Handle addition
    if (action === 'add') {
      wallet.totalBalance += amount;
    } 
    // Handle deduction
    else if (action === 'deduct') {
      if (amount > wallet.totalBalance) {
        throw new BadRequestException('Insufficient total balance.');
      }
      wallet.totalBalance -= amount;
    }
  
    // Save the updated wallet
    await wallet.save();
  
    return `Amount ${action}ed successfully from total balance.`;
  }
  
  
  
}
