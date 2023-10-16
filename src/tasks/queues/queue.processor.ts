import { Process, Processor } from '@nestjs/bull';
import { NlpManagerService } from 'src/utils/nlpmanager/nlpmanager.service';
import { Job } from 'bull';
import { KeywordsService } from 'src/modules/keywords/keywords.service';

@Processor('myQueue')
export class QueueProcessor {
  constructor(
    private readonly nlpService: NlpManagerService,
    private readonly keywordService: KeywordsService,
  ) {}

  @Process('keywordItem')
  async processItem(job: Job<any>): Promise<any> {
    try {
      const { _id, type, text } = job.data;
      const { tokens } = await this.nlpService.cleansingText(text);
      const words = tokens.filter((w) => w.length > 1);
      const tfidfValue = this.nlpService.tfidf(words);
      const mappedKey = tfidfValue.map((item) => ({ _id, type, ...item }));
      return mappedKey;
    } catch (error) {
      console.error(`Job ID ${job.id} failed: ${error.message}`);
      throw error;
    }
  }

  @Process('insertKeywordItem')
  async processKeywordItem(job: Job<any>): Promise<any> {
    try {
      await this.keywordService.upsertKeywords(job.data);
      return true;
    } catch (error) {
      console.error(`Job ID ${job.id} failed: ${error.message}`);
      throw error;
    }
  }

  @Process('insertProjectItem')
  async processProjectItem(job: Job<any>): Promise<any> {
    try {
      await this.keywordService.insertProjects(job.data);
      return true;
    } catch (error) {
      console.error(`Job ID ${job.id} failed: ${error.message}`);
      throw error;
    }
  }
}
