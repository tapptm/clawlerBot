import { Injectable, BadRequestException } from '@nestjs/common';
import { DatasetService } from 'src/modules/datasets/datasets.service';
import { KeywordsService } from '../keywords/keywords.service';
import { QueueService } from 'src/tasks/queues/queue.service';
import { ExtractPayload, ExtractResponse } from './interface/extract.interface';
import { ProgressBar } from 'src/config/progress';
import { DatesetResponse } from 'src/common/interface/datasets.interface';
import { CustomLogger } from 'src/config/logger/logger.service';

@Injectable()
export class ExtractService {
  constructor(
    private readonly datasetService: DatasetService,
    private readonly keywordService: KeywordsService,
    private readonly queueService: QueueService,
    private readonly progress: ProgressBar,
    private readonly logger: CustomLogger,
  ) {
    this.progress = new ProgressBar('Extract');
    this.logger = new CustomLogger('Extract');
  }

  private datasetCcp: DatesetResponse[] = [];
  private datasetUsp: DatesetResponse[] = [];

  async findResearchKeywords(
    payloads: ExtractPayload,
  ): Promise<ExtractResponse> {
    try {
      const { researchId, researchType } = payloads;
      if(!researchType) throw new BadRequestException('Please Send Research Type');
      this.logger.debug('🔎 Searching for research from the database');
      if (researchType.includes('CCP')) {
        this.datasetCcp = await this.datasetService.findConcept(researchId);
      }
      if (researchType.includes('USP')) {
        this.datasetUsp = await this.datasetService.findUsProject(researchId);
      }
      const mergeResearch = [...this.datasetCcp, ...this.datasetUsp];

      // Queue task 1 sec per element from concept_proposal Data to Find keywords using NLP algorithm by pythianlp
      this.logger.debug(
        '🔎 Searching for keywords from research with NLP algorithm',
      );
      const keywords = await this.queueService.keywordsTask(mergeResearch);
      // console.log(keywords);

      // Upsert keywords into database and change keyword_name to keyword_id
      this.logger.debug(
        '🤖 Checking for duplicate keywords and adding new keywords to database',
      );
      await this.keywordService.createKeywordTask(keywords);
      // console.log(keywordResult);
      this.logger.debug('🤖 Mapping keywords to ID and then cleaning keywords');
      const mapKeywordId = await this.mappedKeyword(keywords);
      const cleanKeywords = mapKeywordId.filter(Boolean);

      // Find exist data from database
      this.logger.debug(
        '🔎 Searching for duplicate keywords from the database',
      );
      const existKeywords = await this.checkExistData(cleanKeywords, {
        functionCCP: 'getCpProject',
        functionUSP: 'getUSPProject',
      });

      // Compare Two Arrays for get no exist data
      this.logger.debug('🤖 Comparing two arrays to search for new keywords');
      const getNewData = await this.getNoExistData(
        cleanKeywords,
        existKeywords,
      );
      // console.log('noExistKeyword', getNewData);
      let countProject = getNewData.length;
      this.logger.debug('📄 New Keyword Total: ' + countProject);

      // Check new data has value then upsert new data into database and return it
      if (countProject > 0) {
        this.logger.debug(
          '🤖 New Keyword Founded. Adding new keywword into database',
        );
        await this.keywordService.createProjectTasks(getNewData);
        return { countNewKey: countProject };
      }

      // Return When new data was not found
      this.logger.debug('🤖 New keywords was not found');
      return { countNewKey: 0 };
    } catch (error) {
      this.logger.error(error.message, error);
      throw new BadRequestException(error.message);
    }
  }

  private async mappedKeyword(keywords: any[]) {
    this.progress.start(keywords.length, 0);
    const mappedKeyword = await Promise.all(
      keywords.map(async (key) => {
        this.progress.increment();
        const keywordsList = await this.keywordService.getKeywords(key.keyword);
        if (
          keywordsList.length &&
          keywordsList[0].keyword_name === key.keyword
        ) {
          return { ...key, keyword: keywordsList[0].id_keyword };
        }
      }),
    );
    this.progress.stop();
    return mappedKeyword;
  }

  private async checkExistData(
    arrayData: any[],
    opt: { functionCCP?: any; functionUSP?: any },
  ) {
    const unique = arrayData.filter((obj, index) => {
      return (
        index ===
        arrayData.findIndex((o) => obj._id === o._id && obj.type === o.type)
      );
    });
    this.progress.start(unique.length, 0);
    const cleanList = await Promise.all(
      unique.map(async (li) => {
        this.progress.increment();
        let existingList = [];
        if (li.type === 'CCP') {
          const oldData = await this.keywordService[opt.functionCCP](li._id);
          existingList.push(...oldData);
        }
        if (li.type === 'USP') {
          const oldData = await this.keywordService[opt.functionUSP](li._id);
          existingList.push(...oldData);
        }
        return [...existingList];
      }),
    );
    this.progress.stop();
    return cleanList.flat(1);
  }

  private async getNoExistData(arrfir: any[], arrSec: any[]) {
    const arrSecSet = new Set(
      arrSec.map((sobj) => `${sobj._id}-${sobj.keyword}-${sobj.type}`),
    );
    return arrfir.filter(
      (fobj) => !arrSecSet.has(`${fobj._id}-${fobj.keyword}-${fobj.type}`),
    );
  }
}
