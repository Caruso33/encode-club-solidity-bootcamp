import { Controller, Get, HttpException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletResourceService } from './wallet.service';

@Controller('wallet')
@ApiTags('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletResourceService) {}

  @Get('server-wallet')
  @ApiOperation({
    summary: 'Server account wallet address',
    description:
      'Gets the server account wallet address from the configured environment',
  })
  @ApiResponse({
    status: 200,
    description: 'Server account address',
    type: String,
  })
  @ApiResponse({
    status: 503,
    description: 'The account is not set up',
    type: HttpException,
  })
  async getServerWallet() {
    try {
      const result = this.walletService.walletAddress();
      return result;
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
  }
}
