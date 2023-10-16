import { Body, Controller, Post } from '@nestjs/common';
import { ExtractService } from './extracts.service';
import { ExtractPayload, ExtractResponse } from './interface/extract.interface';

@Controller('extract')
export class ExtractController {
  constructor(private readonly extractService: ExtractService) {}

  @Post('keywords')
  async scrapWord(@Body() body: ExtractPayload): Promise<ExtractResponse> {
    const results = await this.extractService.findResearchKeywords(body);
    return results;
  }
}
