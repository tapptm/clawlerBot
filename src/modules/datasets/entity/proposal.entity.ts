import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ConceptProposal } from './concept.entity.js';

@Entity('proposal_project')
export class ProposalProject {
  @PrimaryGeneratedColumn()
  proposal_project_id: number;

  @Column()
  objective: string;

  @Column()
  concept_proposal_id: number;

  @ManyToOne(() => ConceptProposal, (con) => con.concept_proposal_id)
  @JoinColumn({ name: 'concept_proposal_id' })
  concept_proposal: ConceptProposal;
}
