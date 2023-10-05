import { Process, Processor } from '@nestjs/bull';
import { NlpManagerService } from 'src/utils/nlpmanager/nlpmanager.service';
import { Job } from 'bull';

@Processor('myQueue')
export class QueueProcessor {
  constructor(private readonly nlpService: NlpManagerService) {}
  private stored: any[] = [];

  @Process('keywordItem')
  async processItem(job: Job<any>): Promise<any> {
    try {
      const { _id, text } = job.data;
      const { tokens } = await this.nlpService.cleansingText(text);
      const words = tokens.filter((w) => w.length > 1);
      const tfidfValue = this.nlpService.tfidf(words);
      tfidfValue.map((item) => this.stored.push({ _id, ...item }));

      // Return the processed value
      return this.stored;
    } catch (error) {
      // Handle errors if needed
      console.error(`Job ID ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}
