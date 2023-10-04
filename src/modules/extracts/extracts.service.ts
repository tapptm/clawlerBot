import { Injectable } from '@nestjs/common';
import { NlpManagerService } from 'src/utils/nlpmanager/nlpmanager.service';
import { DatasetService } from 'src/modules/datasets/datasets.service';
import { Callback } from 'src/common/type/callback.type';
import { ProgressBar } from 'src/config/progress';
import {
  KeywordsResponse,
  ProjectKeyword,
} from 'src/common/interface/keyword.interface';
import { KeywordsService } from '../keywords/keywords.service';

@Injectable()
export class ExtractService {
  constructor(
    private readonly datasetService: DatasetService,
    private readonly keywordService: KeywordsService,
    private readonly nlpService: NlpManagerService,
    private readonly progress: ProgressBar,
  ) {}

  async findKeywordsConcept(conceptId: number, response: Callback) {
    const keywords: ProjectKeyword[] = [];
    const conceptdata = await this.datasetService.findConcept(conceptId);
    const promise = this.queueTasks(conceptdata, keywords, 4).catch(err=> console.log(err))
    promise
      .then(async () => {
        this.progress.stop();
        await this.keywordService.upsertKeyword(keywords);
        const mapKeywordId = await this.mappedKeyword(keywords);
        const cleanData = mapKeywordId.filter(Boolean);
        const cleanList = await this.getOldData(cleanData, {
          keyProject: '_id',
          keyFunction: 'getConceptProject',
        });
        const findNewData = this.getNewData(cleanData, cleanList, {
          keyProject: '_concept_id',
          keyKeyword: 'keyword_id',
        });
        if (findNewData.length > 0) {
          await this.keywordService.upsertProject(findNewData);
          return response(null, { countNewKey: findNewData.length });
        }
        return response(null, { countNewKey: 0 });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  queueTasks(dataArr: any, stored: any, rounds: number) {
    return new Promise<void>((resolve, reject) => {
      this.progress.start(rounds, 0);
      dataArr.slice(0, rounds).forEach((el, idx, arr) => {
        if (el.text) {
          setTimeout(async () => {
            this.progress.increment();
            const text = el.text;
            const { tokens } = await this.nlpService.cleansingText(text);
            const words = tokens.filter((w) => w.length > 1);
            const keyword_count: KeywordsResponse[] = Array.from(
              words.reduce((r, c) => r.set(c, (r.get(c) || 0) + 1), new Map()),
              ([keyword, count]) => ({ keyword, count }),
            );
            keyword_count.map((kco) => stored.push({ _id: el._id, ...kco }));
            if (idx === arr.length - 1) resolve();
          }, idx * 800);
        }
      });
    })
  }

  async mappedKeyword(keywordArr: any) {
    return await Promise.all(
      keywordArr.map(async (key) => {
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

  async getOldData(
    newArr: any,
    options: {
      keyProject?: string;
      keyFunction?: any;
    },
  ) {
    const cidList = [...new Set(newArr.map((val) => val[options.keyProject]))];
    const cleanList = await Promise.all(
      cidList.map(async (li: number) => {
        const oldData = await this.keywordService[options.keyFunction](li);
        return [...oldData];
      }),
    );
    return cleanList.flat(1);
  }

  getNewData(
    newArr: any,
    oldArr: any,
    options: {
      keyProject?: string;
      keyKeyword?: string;
    },
  ) {
    oldArr = oldArr.map((oldObj) => ({
      _id: oldObj[options.keyProject],
      keyword: oldObj[options.keyKeyword],
    }));
    return newArr.filter(
      (newObj) =>
        !oldArr.some(
          (oldObj) =>
            oldObj._id === newObj._id && oldObj.keyword === newObj.keyword,
        ),
    );
  }
}
