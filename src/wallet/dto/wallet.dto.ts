import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional } from 'class-validator';
import { WalletService } from '../wallet.service';
import { WalletDocument } from '../wallet.schema';

// DTOs for Wallet API

// DTO for Adding Balance
export class AddBalanceDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  type: 'deposit' | 'bonus' | 'winnings';
}

// DTO for Deducting Balance
export class DeductBalanceDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  type: 'deposit' | 'winnings' | 'quiz' | 'course';
}

// DTO for Create Wallet
export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  currency: string;
}