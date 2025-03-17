// src/schemas/withdrawal-request.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type WithdrawlsDocument = Withdrawls & Document;

@Schema()
export class Withdrawls {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  amount: number;

  @Prop({ type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  requestedAt: Date;

  @Prop({ type: Date, default: null })
  approvedAt: Date;

  @Prop({ type: Date, default: null })
  rejectedAt: Date;
}

export const WithdrawlsSchema = SchemaFactory.createForClass(Withdrawls);
