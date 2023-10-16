import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Keywords } from './entity/keywords.entity';
import { Repository } from 'typeorm';
import { Projects } from './entity/projects.entity';
import { Automation } from './entity/automation.entity';
import { KeywordsResponse } from 'src/common/interface/keyword.interface';
import { ProgressBar } from 'src/config/progress';
import { QueueService } from 'src/tasks/queues/queue.service';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(Keywords)
    private readonly keywordRepository: Repository<Keywords>,
    @InjectRepository(Projects)
    private readonly projectRepository: Repository<Projects>,
    @InjectRepository(Automation)
    private readonly automationRepository: Repository<Automation>,
    private readonly queueService: QueueService,
  ) {}

  async upsertKeywords(keyword: any) {
    await this.keywordRepository.upsert(keyword, ['keyword_name']);
  }

  async insertProjects(project: any) {
   await this.projectRepository.insert(project);
  }

  async createKeywordTask(keywords: KeywordsResponse[]) {
    const keywordList = keywords.map((key) => ({
      keyword_name: key.keyword,
      created_by: 'TAR_API',
      created_date: new Date(),
    }));

    const chunkSize = 1000;
    const result = [];
    for (let i = 0; i < keywordList.length; i += chunkSize) {
      result.push(keywordList.slice(i, i + chunkSize));
    }

    return await this.queueService.insertKeywordTask(result);
  }

  async getKeywords(name: string): Promise<Keywords[]> {
    return await this.keywordRepository.find({ where: { keyword_name: name } });
  }

  async createProjectTasks(projects: any) {
    const projectList = projects.map((p) => ({
      _concept_id: p.type === 'CCP' ? p._id : null,
      _project_id: p.type === 'USP' ? p._id : null,
      keyword_id: p.keyword,
      count_keyword: p.count,
      status: 0,
      created_by: 'TAR_API',
      created_date: new Date(),
    }));

    const chunkSize = 1000;
    const result = [];
    for (let i = 0; i < projectList.length; i += chunkSize) {
      result.push(projectList.slice(i, i + chunkSize));
    }

    return await this.queueService.insertProjectTask(result);
  }

  async getCpProject(cid: number) {
    const data = await this.projectRepository.find({
      where: { _concept_id: cid },
    });
    return data.map((obj) => ({
      _id: obj._concept_id,
      type: 'CCP',
      keyword: obj.keyword_id,
    }));
  }

  async getUSPProject(pid: number) {
    const data = await this.projectRepository.find({
      where: { _project_id: pid },
    });
    return data.map((obj) => ({
      _id: obj._project_id,
      type: 'USP',
      keyword: obj.keyword_id,
    }));
  }
}
