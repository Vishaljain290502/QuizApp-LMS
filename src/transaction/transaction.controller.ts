import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body('walletId') walletId: string,
    @Body('amount') amount: number,
    @Body('type') type: 'credit' | 'debit',
  ) {
    return this.transactionService.createTransaction(walletId, amount, type);
  }

  @Get(':walletId')
  async getTransactions(@Param('walletId') walletId: string) {
    return this.transactionService.getTransactions(walletId);
  }
}
