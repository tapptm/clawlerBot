import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProposalProject } from './proposal.entity';
import { ConceptProposalKeyword } from './keyword.entity';

@Entity('concept_proposal')
export class ConceptProposal {
  @PrimaryGeneratedColumn()
  concept_proposal_id: number | string;

  @Column()
  concept_proposal_name_th: string;

  @Column()
  concept_proposal_name_en: string;

  @Column()
  concept_proposal_objective: string;

  @Column()
  concept_proposal_status: number

  @Column()
  user_idcard: string

  @OneToMany(() => ProposalProject, (proposal) => proposal.concept_proposal)
  @JoinColumn()
  proposal_projects: ProposalProject[];

  @OneToMany( () => ConceptProposalKeyword,  (keyword) => keyword.concept_proposal)
  @JoinColumn()
  proposal_keywords: ConceptProposalKeyword[];
}
