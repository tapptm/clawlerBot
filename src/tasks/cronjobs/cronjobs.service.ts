import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExtractService } from 'src/modules/extracts/extracts.service';

@Injectable()
export class CronjobsService {
  constructor(
    private readonly extractService: ExtractService,
    private readonly configService: ConfigService,
  ) {}

  private readonly secretKeyId: number = this.configService.get<number>('KEYWORDS_ID');

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clawlerTasks() {
    const results = await this.extractService.findResearchKeywords({
      researchId: this.secretKeyId,
      researchType: ['CCP', 'USP'],
    });
    console.log(results);
    return results;
  }
}
