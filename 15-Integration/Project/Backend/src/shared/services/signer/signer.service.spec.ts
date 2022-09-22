import { Test, TestingModule } from '@nestjs/testing';
import { SignerService } from './signer.service';

describe('SignerService', () => {
  let service: SignerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignerService],
    }).compile();

    service = module.get<SignerService>(SignerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
