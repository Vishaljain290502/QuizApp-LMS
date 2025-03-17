import { Controller, Post, Get, Param, Body, Patch, BadRequestException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletDocument } from './wallet.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * Create a new wallet
   */
  @Post()
  async createWallet(
    @Body() createWalletDto: { userId: string; currency: string },
  ): Promise<WalletDocument> {
    const { userId, currency } = createWalletDto;
    return this.walletService.createWallet(userId, currency);
  }

  /**
   * Get wallet by ID
   */
  @Get(':id')
  async getWallet(@Param('id') walletId: string): Promise<WalletDocument> {
    return this.walletService.getWallet(walletId);
  }

  /**
   * Add funds to the deposit balance
   */
  @Patch(':id/add-deposit')
  async addDeposit(
    @Param('id') walletId: string,
    @Body() addDepositDto: { amount: number },
  ): Promise<WalletDocument> {
    const { amount } = addDepositDto;
    return this.walletService.addDeposit(walletId, amount);
  }

  /**
   * Add bonus credits to the wallet
   */
  @Patch(':id/add-bonus')
  async addBonus(
    @Param('id') walletId: string,
    @Body() addBonusDto: { amount: number },
  ): Promise<WalletDocument> {
    const { amount } = addBonusDto;
    return this.walletService.addBonus(walletId, amount);
  }

  /**
   * Add winnings to the wallet
   */
  @Patch(':id/add-winnings')
  async addWinnings(
    @Param('id') walletId: string,
    @Body() addWinningsDto: { amount: number },
  ): Promise<WalletDocument> {
    const { amount } = addWinningsDto;
    return this.walletService.addWinnings(walletId, amount);
  }

  /**
   * Deduct funds from the deposit balance
   */
  @Patch(':id/deduct-deposit')
  async deductDeposit(
    @Param('id') walletId: string,
    @Body() deductDepositDto: { amount: number },
  ): Promise<WalletDocument> {
    const { amount } = deductDepositDto;
    return this.walletService.deductDeposit(walletId, amount);
  }

  /**
   * Deduct funds from the winnings balance
   */
  @Patch(':id/deduct-winnings')
  async deductWinnings(
    @Param('id') walletId: string,
    @Body() deductWinningsDto: { amount: number },
  ): Promise<WalletDocument> {
    const { amount } = deductWinningsDto;
    return this.walletService.deductWinnings(walletId, amount);
  }

  /**
   * Block the wallet
   */
  @Patch(':id/block-wallet')
  async blockWallet(@Param('id') walletId: string): Promise<WalletDocument> {
    return this.walletService.blockWallet(walletId);
  }

  /**
   * Unblock the wallet
   */
  @Patch(':id/unblock-wallet')
  async unblockWallet(@Param('id') walletId: string): Promise<WalletDocument> {
    return this.walletService.unblockWallet(walletId);
  }

  /**
 * Check balance and deduct amount if sufficient
 */
/**
 * Check total balance and deduct amount if sufficient
 */
/**
 * Add or Deduct amount from total balance
 */
@Patch('update-total-balance/:id')
async updateTotalBalance(
  @Param('id') walletId: string,
  @Body() updateBalanceDto: { amount: number; action: 'add' | 'deduct' }
): Promise<{ statusCode: number; message: string }> {
  const { amount, action } = updateBalanceDto;

  // Validate action and amount
  if (!['add', 'deduct'].includes(action)) {
    throw new BadRequestException('Action must be either "add" or "deduct".');
  }
  if (amount <= 0) {
    throw new BadRequestException('Amount must be greater than zero.');
  }

  const result = await this.walletService.updateTotalBalance(walletId, amount, action);
  return { statusCode: 200, message: result };
}



}
