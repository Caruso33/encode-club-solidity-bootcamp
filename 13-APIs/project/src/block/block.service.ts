import { Injectable } from '@nestjs/common';
import { ProviderService } from 'src/shared/services/provider/provider.service';

@Injectable()
export class BlockService {
  constructor(private providerService: ProviderService) {}

  async getLastBlock() {
    return await this.providerService.getBlockData();
  }

  async getBlockByHash(hash: string) {
    return await this.providerService.getBlockData(hash);
  }
}
