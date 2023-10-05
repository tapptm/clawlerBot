import { Injectable, BadRequestException } from '@nestjs/common';
import { DatasetService } from 'src/modules/datasets/datasets.service';
import { KeywordsService } from '../keywords/keywords.service';
import { QueueService } from 'src/tasks/queues/queue.service';
import { ExtractResponse } from './interface/extract.interface';

@Injectable()
export class ExtractService {
  constructor(
    private readonly datasetService: DatasetService,
    private readonly keywordService: KeywordsService,
    private readonly queueService: QueueService,
  ) {}

  async findKeywordsConcept(conceptId: number): Promise<ExtractResponse> {
    try {
      // Find concept_proposal from database
      const conceptData = await this.datasetService.findConcept(conceptId);

      // Queue task 1 sec per element from concept_proposal Data to Find keywords using NLP algorithm by pythianlp
      const keywords = await this.queueService.keywordsTask(conceptData.slice(11,16));

      // Upsert keywords into database and mapped keyword name to id
      await this.keywordService.upsertKeyword(keywords);
      const mapKeywordId = await this.mappedKeyword(keywords);
      const cleanKeywords = mapKeywordId.filter(Boolean);

      // Find exist data from database
      const existKeywords = await this.checkExistData(cleanKeywords, 'getCpProject');

      // Compare Two Arrays for get no exist data
      const getNewData = await this.getNoExistData(cleanKeywords, existKeywords);

      // Check new data has value then upsert new data into database and return it
      if (getNewData.length > 0) {
        await this.keywordService.upsertProject(getNewData);
        return { countNewKey: getNewData.length };
      }

      // Return When new data was not found
      return { countNewKey: 0 };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async mappedKeyword(keywords: any[]) {
    return await Promise.all(
      keywords.map(async (key) => {
        const keywordsList = await this.keywordService.getKeywords(key.keyword);
        if (
          keywordsList.length &&
          keywordsList[0].keyword_name === key.keyword
        ) {
          return { ...key, keyword: keywordsList[0].id_keyword };
        }
      }),
    );
  }

  private async checkExistData(arrayData: any[], functionName?: any) {
    const idList = [...new Set(arrayData.map((val) => val._id))];
    const cleanList = await Promise.all(
      idList.map(async (li: number) => {
        const oldData = await this.keywordService[functionName](li);
        return [...oldData];
      }),
    );
    return cleanList.flat(1);
  }

  private async getNoExistData(arrfir: any[], arrSec: any[]) {
    return arrfir.filter(
      (fobj) =>
        !arrSec.some(
          (sobj) => sobj._id === fobj._id && sobj.keyword === fobj.keyword,
        ),
    );
  }
}
