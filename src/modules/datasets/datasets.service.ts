import { Injectable } from '@nestjs/common';
import { ConceptProposal } from './entity/concept.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { DatesetResponse } from 'src/common/interface/datasets.interface.js';

@Injectable()
export class DatasetService {
  constructor(
    @InjectRepository(ConceptProposal)
    private readonly conceptRepository: Repository<ConceptProposal>,
  ) {}

  async findConcept(conceptId: number): Promise<DatesetResponse[]> {
    const data = await this.conceptRepository.find({
      where: {
        concept_proposal_id: conceptId ? conceptId : Not('concept_proposal_id'),
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
      const stripText = mergeText.replace( /<(.|\n)*?>|\n|\r|&nbsp;|&quot;|&rdquo;|&ldquo;|,/g,'')
      return {
        _id: list.concept_proposal_id,
        type: 'concept_proposal',
        text: stripText  
      }
    });
  }
}
