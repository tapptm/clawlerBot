import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConceptProposal } from './concept.entity.js';

@Entity('concept_proposal_keyword')
export class ConceptProposalKeyword {
  @PrimaryGeneratedColumn()
  concept_proposal_keyword_id: number;

  @Column()
  concept_proposal_keyword_th: string;

  @Column()
  concept_proposal_keyword_en: string;

  @Column()
  concept_proposal_id: number;

  @ManyToOne(() => ConceptProposal, (con) => con.concept_proposal_id)
  @JoinColumn({ name: 'concept_proposal_id' })
  concept_proposal: ConceptProposal;
}
