import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keywords } from './entity/keywords.entity';
import { In, Repository } from 'typeorm';
import { Projects } from './entity/projects.entity';
import { Automation } from './entity/automation.entity';
import {
  KeywordsResponse,
  ProjectResponse,
} from 'src/common/interface/keyword.interface';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keywords)
    private readonly keywordRepository: Repository<Keywords>,
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
    @InjectRepository(Automation)
    private readonly automationRepository: Repository<Automation>,
  ) {}

  async upsertKeyword(keywords: KeywordsResponse[]) {
    const keywordList = keywords.map((key) => ({
      keyword_name: key.keyword,
      created_by: 'TAR_API',
      created_date: new Date(),
    }));
    await this.keywordRepository.upsert(keywordList, ['keyword_name']);
  }

  async getKeywords(name: string): Promise<Keywords[]> {
    return await this.keywordRepository.find({ where: { keyword_name: name } });
  }

  async upsertProject(projects: any) {
    const projectList = projects.map((p) => ({
      _concept_id: p._id,
      keyword_id: p.keyword,
      count_keyword: p.count,
      status: 0,
      created_by: 'TAR_API',
      created_date: new Date(),
    }));
    await this.projectRepository.upsert(projectList, [
      '_concept_id',
      'keyword_id',
    ]);
  }

  async getConceptProject(cid: number) {
    return await this.projectRepository.find({ where: { _concept_id: cid } });
  }
}
