import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExtractService } from 'src/modules/extracts/extracts.service';

@Injectable()
export class CronjobsService {
  constructor(
    private readonly extractService: ExtractService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clawlerTasks() {
    const results = await this.extractService.findKeywordsConcept(null);
    console.log(results);
  }
}
