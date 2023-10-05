import { Body, Controller, Post } from '@nestjs/common';
import { ExtractService } from './extracts.service';
import { ExtractResponse } from './interface/extract.interface';

@Controller('extract')
export class ExtractController {
  constructor(private readonly extractService: ExtractService) {}

  @Post('keywords')
  async scrapWord(@Body() body: any): Promise<ExtractResponse> {
    const { conceptId } = body;
    const results = await this.extractService.findKeywordsConcept(conceptId);
    return results;
  }
}
