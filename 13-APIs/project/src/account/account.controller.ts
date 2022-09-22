import { Controller, Get, HttpException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';

@Controller('account')
@ApiTags('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('server-balance')
  @ApiOperation({
    summary: 'Server account balance',
    description: 'Gets the server balance expressed in network tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'Server balance in network tokens',
    type: Number,
  })
  @ApiResponse({
    status: 503,
    description:
      'The server is not connected to a valid provider or server account is not set up',
    type: HttpException,
  })
  async getServerBalance() {
    try {
      const result = await this.accountService.getServerAccountBalance();
      return Number(result);
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
  }
}
