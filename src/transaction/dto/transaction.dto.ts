import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID of the wallet associated with the transaction',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  walletId: string;

  @ApiProperty({
    description: 'The transaction amount',
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The type of the transaction (credit or debit)',
    enum: ['credit', 'debit'],
    type: String,
  })
  @IsNotEmpty()
  @IsEnum(['credit', 'debit'], { message: 'Type must be either credit or debit' })
  type: 'credit' | 'debit';
}





export class FetchTransactionsDto {
  @ApiProperty({
    description: 'ID of the wallet to filter transactions by',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  walletId?: string;

  @ApiProperty({
    description: 'The page number for pagination',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'The number of transactions per page',
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
