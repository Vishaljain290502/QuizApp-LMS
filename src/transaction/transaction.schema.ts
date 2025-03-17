import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, Types } from 'mongoose';
import { WalletDocument } from 'src/wallet/wallet.schema';

export @Schema()
class TransactionDocument {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'WalletDocument', 
  })
  wallet: Types.ObjectId; 

  @Prop({
    type: Number,
    required: true,
  })
  amount: number; 

  @Prop({
    type: String,
    enum: ['credit', 'debit'], 
    required: true,
  })
  type: string;

  @Prop({
    type: String,
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending',
  })
  status: string;


  @Prop({ required: true })
  razorpay_order_id: string;  

  @Prop()
  razorpay_payment_id: string; 

  @Prop()
  razorpay_signature: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date; 

  @Prop({
    type: Date,
  })
  updatedAt: Date; 
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDocument);