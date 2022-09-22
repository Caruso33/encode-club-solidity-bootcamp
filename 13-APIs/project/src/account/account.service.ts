import { Injectable } from '@nestjs/common';
import { ProviderService } from 'src/shared/services/provider/provider.service';
import { WalletService } from 'src/shared/services/wallet/wallet.service';

@Injectable()
export class AccountService {
  constructor(
    private providerService: ProviderService,
    private walletService: WalletService,
  ) {}

  async getServerAccountBalance() {
    const serverAddress = this.walletService.walletAddress();
    const serverWalletBalance = await this.providerService.getBalance(
      serverAddress,
    );
    return serverWalletBalance;
  }
}
