import { Module } from '@nestjs/common';
import { WalletResourceService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
  controllers: [WalletController],
  providers: [WalletResourceService]
})
export class WalletModule {}
