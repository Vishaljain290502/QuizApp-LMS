import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';


export interface IWalletDocument extends Document {
  user: mongoose.Types.ObjectId;
  depositBalance: number;
  bonusBalance: number;
  winningsBalance: number;
  totalBalance: number;
  currency: string;
  updatedAt: Date;
  isBlocked: boolean;
  participatedQuizzes: mongoose.Types.ObjectId[];
  purchasedCourses: mongoose.Types.ObjectId[];

  // Method Signatures
  updateTotalBalance(): void;
  addDeposit(amount: number): void;
  addBonus(amount: number): void;
  addWinnings(amount: number): void;
  deductDeposit(amount: number): void;
  deductWinnings(amount: number): void;
}
export interface IWalletDocument extends Document {
  user: mongoose.Types.ObjectId;
  depositBalance: number;
  bonusBalance: number;
  winningsBalance: number;
  totalBalance: number;
  currency: string;
  updatedAt: Date;
  isBlocked: boolean;
  participatedQuizzes: mongoose.Types.ObjectId[];
  purchasedCourses: mongoose.Types.ObjectId[];

  // Method Signatures
  updateTotalBalance(): void;
  addDeposit(amount: number): void;
  addBonus(amount: number): void;
  addWinnings(amount: number): void;
  deductDeposit(amount: number): void;
  deductWinnings(amount: number): void;
}


export type Wallet = HydratedDocument<WalletDocument>;

@Schema()
export class WalletDocument {
  
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true, 
  })
  user: mongoose.Types.ObjectId;
  
  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  depositBalance: number; 

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  bonusBalance: number; 

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  winningsBalance: number; 

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  totalBalance: number; 

  @Prop({
    type: String,
    required: true,
    default: '$',
  })
  currency: string; 

  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date; 

  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isBlocked: boolean; 

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    default: [],
  })
  participatedQuizzes: mongoose.Types.ObjectId[]; 

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    default: [],
  })
  purchasedCourses: mongoose.Types.ObjectId[]; 

  /**
   * Updates the wallet's total balance.
   * Ensures totalBalance reflects the sum of depositBalance, bonusBalance, and winningsBalance.
   */
  updateTotalBalance() {
    this.totalBalance = this.depositBalance + this.bonusBalance + this.winningsBalance;
    this.updatedAt = new Date();
  }

  /**
   * Adds funds to the deposit balance.
   * @param amount - The amount to add.
   */
  addDeposit(amount: number) {
    if (amount <= 0) throw new Error('Amount must be positive.');
    this.depositBalance += amount;
    this.updateTotalBalance();
  }

  /**
   * Adds bonus credits to the bonus balance.
   * @param amount - The amount to add.
   */
  addBonus(amount: number) {
    if (amount <= 0) throw new Error('Amount must be positive.');
    this.bonusBalance += amount;
    this.updateTotalBalance();
  }

  /**
   * Adds winnings to the winnings balance.
   * @param amount - The amount to add.
   */
  addWinnings(amount: number) {
    if (amount <= 0) throw new Error('Amount must be positive.');
    this.winningsBalance += amount;
    this.updateTotalBalance();
  }

  /**
   * Deducts funds from the deposit balance.
   * @param amount - The amount to deduct.
   */
  deductDeposit(amount: number) {
    if (amount <= 0 || amount > this.depositBalance) {
      throw new Error('Invalid amount.');
    }
    this.depositBalance -= amount;
    this.updateTotalBalance();
  }

  /**
   * Deducts funds from the winnings balance.
   * @param amount - The amount to deduct.
   */
  deductWinnings(amount: number) {
    if (amount <= 0 || amount > this.winningsBalance) {
      throw new Error('Invalid amount.');
    }
    this.winningsBalance -= amount;
    this.updateTotalBalance();
  }
}

export const walletSchema = SchemaFactory.createForClass(WalletDocument);


// Add Methods to the Schema
walletSchema.methods.updateTotalBalance = function () {
  this.totalBalance = this.depositBalance + this.bonusBalance + this.winningsBalance;
  this.updatedAt = new Date();
};

walletSchema.methods.addDeposit = function (amount: number) {
  if (amount <= 0) throw new Error('Amount must be positive.');
  this.depositBalance += amount;
  this.updateTotalBalance();
};

walletSchema.methods.addBonus = function (amount: number) {
  if (amount <= 0) throw new Error('Amount must be positive.');
  this.bonusBalance += amount;
  this.updateTotalBalance();
};

walletSchema.methods.addWinnings = function (amount: number) {
  if (amount <= 0) throw new Error('Amount must be positive.');
  this.winningsBalance += amount;
  this.updateTotalBalance();
};

walletSchema.methods.deductDeposit = function (amount: number) {
  if (amount <= 0 || amount > this.depositBalance) {
    throw new Error('Invalid amount.');
  }
  this.depositBalance -= amount;
  this.updateTotalBalance();
};

walletSchema.methods.deductWinnings = function (amount: number) {
  if (amount <= 0 || amount > this.winningsBalance) {
    throw new Error('Invalid amount.');
  }
  this.winningsBalance -= amount;
  this.updateTotalBalance();
};


walletSchema.virtual('transactions', {
  ref: 'TransactionDocument',   
  localField: '_id',            
  foreignField: 'wallet',       
});

walletSchema.set('toJSON', { virtuals: true });
walletSchema.set('toObject', { virtuals: true });
