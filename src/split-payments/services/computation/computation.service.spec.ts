import { Test, TestingModule } from '@nestjs/testing';
import { ComputationService } from './computation.service';

describe('ComputationService', () => {
  let service: ComputationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComputationService],
    }).compile();

    service = module.get<ComputationService>(ComputationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
