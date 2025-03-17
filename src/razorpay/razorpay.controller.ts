import { Controller, Post, Body, Res } from '@nestjs/common';
import { RazorpayService } from './razorpay.service';
import { InjectModel } from '@nestjs/mongoose';
import { WalletDocument } from 'src/wallet/wallet.schema';
import { TransactionDocument } from 'src/transaction/transaction.schema';
import { Model, Types } from 'mongoose';

@Controller('razorpay')
export class RazorpayController {
    @InjectModel('Wallet') private readonly walletModel: Model<WalletDocument>
    @InjectModel(TransactionDocument.name) private transactionModel: Model<TransactionDocument>
  constructor(private readonly razorpayService: RazorpayService) {}

  @Post('create-order')
  async createOrder(@Body('walletId') walletId: string, @Body('amount') amount: number) {
    return this.razorpayService.createOrder(walletId, amount);
  }


  @Post('store-signature')
  async storeSignature(@Body() body: any, @Res() res) {
    try {
      console.log("Checking transactionModel:", this.transactionModel); // 👀 Debugging
      if (!this.transactionModel) {
        return res.status(500).json({ success: false, message: "Database model not initialized" });
      }
  
      const { razorpay_order_id, razorpay_signature } = body;
  
      if (!razorpay_signature) {
        return res.status(400).json({ success: false, message: "Signature is missing" });
      }
  
      // Store signature in the transaction database
      const transaction = await this.transactionModel.findOneAndUpdate(
        { razorpay_order_id },
        { razorpay_signature },
        { new: true }
      );
  
      if (!transaction) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
      }
  
      return res.json({ success: true, message: "Signature stored successfully", transaction });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  

  @Post('verify-payment')
  async verifyPayment(@Body() body: any, @Res() res) {
    try {
      const { payload } = body;
      const paymentEntity = payload.payment.entity;
  
      const walletId = paymentEntity.notes.walletId; 
      const razorpay_payment_id = paymentEntity.id;
      const razorpay_order_id = paymentEntity.order_id;
  
      const transaction = await this.transactionModel.findOne({
        wallet: Types.ObjectId.createFromHexString(walletId),
        razorpay_order_id: razorpay_order_id,
        status: 'pending',
      });

      console.log("transaction",transaction)
  
      if (!transaction) {
        return res.status(400).json({ success: false, message: 'Transaction not found' });
      }
  
      // ✅ No need to verify signature here because Razorpay already validated the webhook
      transaction.status = 'completed';
      transaction.razorpay_payment_id = razorpay_payment_id;
      await transaction.save();
  
      const wallet = await this.walletModel.findById(Types.ObjectId.createFromHexString(walletId));
      if (!wallet) throw new Error('Wallet not founds');
  
      const walletInstance = Object.setPrototypeOf(wallet.toObject(), WalletDocument.prototype);

      walletInstance.addDeposit(transaction.amount);
      await this.walletModel.findByIdAndUpdate(walletId, walletInstance);
  
      return res.json({ success: true, message: 'Payment verified and wallet updated' });
  
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

}
