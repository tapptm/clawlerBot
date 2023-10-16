import { Injectable } from '@nestjs/common';
import { ConceptProposal } from './entity/concept.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { DatesetResponse } from 'src/common/interface/datasets.interface.js';
import { UsProjects } from './entity/usproject.entity.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(ConceptProposal)
    private readonly conceptRepository: Repository<ConceptProposal>,
    @InjectRepository(UsProjects)
    private readonly usprojectRepository: Repository<UsProjects>,
    private readonly configService: ConfigService,
  ) {}

  private readonly secretKeyId: number = this.configService.get<number>('KEYWORDS_ID');

  async findConcept(conceptId: number): Promise<DatesetResponse[]> {
    const data = await this.conceptRepository.find({
      where: {
        concept_proposal_id: conceptId == this.secretKeyId ? Not('concept_proposal_id') : conceptId,
        concept_proposal_status: 2,
        user_idcard: Not(IsNull()),
      },
      relations: ['proposal_projects', 'proposal_keywords'],
    });

    return data.map((list) => {
      const cnameth = list.concept_proposal_name_th;
      const cnameen = list.concept_proposal_name_en;
      const cpobj = list.concept_proposal_objective;
      const cpkeyw = list.proposal_keywords;
      const cppro = list.proposal_projects;
      const keytext = cpkeyw.map((k) => k.concept_proposal_keyword_th + k.concept_proposal_keyword_en).join(' ');
      const protext = cppro.map((p) => p.objective).join(' ');
      const mergeText = `${cnameth} ${cnameen} ${cpobj} ${keytext} ${protext}`;
      const stripText = mergeText.replace(/<(.|\n)*?>|\n|\r|&nbsp;|&quot;|&rdquo;|&ldquo;|,/g, '');
      return {
        _id: list.concept_proposal_id,
        type: 'CCP',
        text: stripText,
      };
    });
  }

  async findUsProject(usproject_id: number): Promise<DatesetResponse[]> {
    const data = await this.usprojectRepository.find({
      where: {
        project_id: usproject_id == this.secretKeyId ? Not('project_id') : usproject_id,
        user_idcard: Not(IsNull()),
      },
    });

    return data.map((list) => {
      const mergeText = `${list.project_name_th} ${list.project_name_en}`;
      const stripText = mergeText.replace(/<(.|\n)*?>|\n|\r|&nbsp;|&quot;|&rdquo;|&ldquo;|,/g, '');
      return {
        _id: list.project_id,
        type: 'USP',
        text: stripText,
      };
    });
  }
}
