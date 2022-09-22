import { Controller, Get, HttpException, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlockService } from './block.service';

@Controller('block')
@ApiTags('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Get('block')
  @ApiOperation({
    summary: 'Last Block',
    description: 'Gets the last block from the provider',
  })
  @ApiResponse({
    status: 200,
    description: 'Block Data',
  })
  @ApiResponse({
    status: 503,
    description: 'The server is not connected to a valid provider',
    type: HttpException,
  })
  async getLastBlock() {
    try {
      const result = await this.blockService.getLastBlock();
      return result;
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
  }

  @Get('block/:hash')
  @ApiOperation({
    summary: 'Block by hash',
    description: 'Search for a block that matches the provided hash',
  })
  @ApiResponse({
    status: 200,
    description: 'Block Data',
  })
  @ApiResponse({
    status: 404,
    description: 'Block not found',
    type: HttpException,
  })
  @ApiResponse({
    status: 503,
    description: 'The server is not connected to a valid provider',
    type: HttpException,
  })
  async getBlockByHash(@Param('hash') hash: string) {
    let result;
    try {
      result = await this.blockService.getBlockByHash(hash);
    } catch (error) {
      throw new HttpException(error.message, 503);
    }
    if (!result) throw new HttpException('Block not found', 404);
    return result;
  }
}
