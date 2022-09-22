import { Injectable } from '@nestjs/common';
import { WalletService } from 'src/shared/services/wallet/wallet.service';

@Injectable()
export class WalletResourceService {
  constructor(private walletService: WalletService) {}

  walletAddress() {
    return this.walletService.walletAddress();
  }
}
