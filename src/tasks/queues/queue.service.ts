import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { ProgressBar } from 'src/config/progress';
import { Queue } from 'bull';
import { KeywordsResponse } from 'src/common/interface/keyword.interface';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('myQueue') private readonly queue: Queue,
    private readonly progress: ProgressBar,
  ) {}

  async keywordsTask(data: any[]): Promise<KeywordsResponse[]> {
    const keywords = [];

    this.progress.start(data.length, 0);
    for (const item of data) {
      this.progress.increment();
      const job = await this.queue.add('keywordItem', item, { delay: 1000 });

      // Wait for the job to complete and collect the result
      const processedValue = await job.finished();

      // Store the processed value in the results array
      keywords.push(...processedValue);
    }

    this.progress.stop();
    return keywords;
  }
}
