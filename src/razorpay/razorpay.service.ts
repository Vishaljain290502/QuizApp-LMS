import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WalletDocument } from '../wallet/wallet.schema';
import { TransactionDocument } from '../transaction/transaction.schema';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor(
    @InjectModel('Wallet') private readonly walletModel: Model<WalletDocument>,
    @InjectModel(TransactionDocument.name) private transactionModel: Model<TransactionDocument>,
  ) {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async createOrder(walletId: string, amount: number, currency: string = 'INR') {
    const options = {
      amount: amount * 100, 
      currency,
      receipt: `receipt_${new Date().getTime()}`, 
      partial_payment: false, 
      notes: {
        walletId: walletId, 
        transactionType: "wallet_topup",
      },
    };
  
    try {
      const order = await this.razorpay.orders.create(options);
      const transaction = new this.transactionModel({
        wallet: new Types.ObjectId(walletId),
        amount,
        type: 'credit',
        status: 'pending',
        razorpay_order_id: order.id,
      });
      await transaction.save();
      return { order, transactionId: transaction._id };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async storeSignature(razorpay_order_id: string, razorpay_signature: string) {
    return this.transactionModel.findOneAndUpdate(
      { razorpay_order_id },
      { razorpay_signature },
      { new: true }
    );
  }

  async verifyPayment(walletId: string, razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) {
    const transaction = await this.transactionModel.findOne({
      wallet: walletId,
      razorpay_order_id: razorpay_order_id,
      status: 'pending',
    });
  
    if (!transaction) {
      throw new Error('No pending transaction found for this wallet.');
    }
  
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
  
    if (generatedSignature !== razorpay_signature) {
      await this.transactionModel.findByIdAndUpdate(transaction._id, { status: 'failed' });
      throw new Error('Invalid signature');
    }
  
    // Update transaction details
    transaction.status = 'completed';
    transaction.razorpay_payment_id = razorpay_payment_id;
    transaction.razorpay_signature = razorpay_signature;
    await transaction.save();
  
    // Fetch and update wallet balance
    const wallet = await this.walletModel.findById(Types.ObjectId.createFromHexString(walletId));
    if (!wallet) throw new Error('Wallet not found');
  
    wallet.addDeposit(transaction.amount);
    await wallet.save();
  
    return { success: true, message: 'Payment verified and wallet updated' };
  }  
  
}
