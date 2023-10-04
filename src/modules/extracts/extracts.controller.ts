import { Body, Controller, Post, Res } from '@nestjs/common';
import { ExtractService } from './extracts.service';
import { Response } from 'express';

@Controller('extract')
export class ExtractController {
  constructor(private readonly extractService: ExtractService) {}

  @Post('keywords')
  scrapWord(@Body() body: any, @Res() res: Response) {
    const { conceptId } = body;
    this.extractService.findKeywordsConcept(conceptId, (error, data) => {
      res.json(data);
    });
  }
}
