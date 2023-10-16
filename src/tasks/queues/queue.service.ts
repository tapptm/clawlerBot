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
  ) {
    this.progress = new ProgressBar('Extract')
  }
  
  async keywordsTask(data: any[]): Promise<KeywordsResponse[]> {
    const keywords = [];
    this.progress.start(data.length, 0);
    for (const item of data) {
      this.progress.increment();
      const job = await this.queue.add('keywordItem', item, { delay: 250 });
      const processedValue = await job.finished();
      keywords.push(...processedValue);
    }
    this.progress.stop();
    return keywords;
  }

  async insertKeywordTask(keywords: any[]) {
    let results;
    this.progress.start(keywords.length, 0);
    for (const keyword of keywords) {
      this.progress.increment();
      const job = await this.queue.add('insertKeywordItem', keyword, {
        delay: 3000,
      });
      const processedValue = await job.finished();
      results = processedValue;
    }
    this.progress.stop();
    return results;
  }

  async insertProjectTask(projects: any[]) {
    let results;
    this.progress.start(projects.length, 0);
    for (const project of projects) {
      this.progress.increment();
      const job = await this.queue.add('insertProjectItem', project, {
        delay: 3000,
      });
      const processedValue = await job.finished();
      results = processedValue;
    }
    this.progress.stop();
    return results;
  }
}
