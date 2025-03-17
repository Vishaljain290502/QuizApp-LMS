// src/controllers/withdrawal-request.controller.ts

import { Controller, Post, Get, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { WithdrawlsService } from './withdrawals.service';
import { Types } from 'mongoose';

@Controller('Withdrawls')
export class WithdrawlsController {
  constructor(private readonly Withdrawlservice: WithdrawlsService) {}

  @Post('request')
  createRequest(@Body('userId') userId: Types.ObjectId, @Body('amount') amount: number) {
    return this.Withdrawlservice.createRequest(userId, amount);
  }

  // Add admin role guard
  @Patch('approve/:id')
  approveRequest(@Param('id') requestId: string) {
    return this.Withdrawlservice.approveRequest(requestId);
  }

  // Add admin role guard
  @Patch('reject/:id')
  rejectRequest(@Param('id') requestId: string) {
    return this.Withdrawlservice.rejectRequest(requestId);
  }

  @Post('my-requests')
  getUserRequests(@Body('userId') userId: string) {
    return this.Withdrawlservice.getRequestsByUser(userId);
  }
  
  @Get('all')
  getAllRequests() {
    return this.Withdrawlservice.getAllRequests();
  }

  @Get(':id')
  getRequestById(@Param('id') requestId: string) {
    return this.Withdrawlservice.getRequestById(requestId);
  }

}
