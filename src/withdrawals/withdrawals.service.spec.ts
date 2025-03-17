import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawlsService } from './withdrawals.service';

describe('WithdrawalsService', () => {
  let service: WithdrawlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawlsService],
    }).compile();

    service = module.get<WithdrawlsService>(WithdrawlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
