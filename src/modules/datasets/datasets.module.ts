import { Module } from '@nestjs/common';
import { DatasetService } from './datasets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptProposal } from './entity/concept.entity';
import { ProposalProject } from './entity/proposal.entity';
import { ConceptProposalKeyword } from './entity/keyword.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConceptProposal]),
    TypeOrmModule.forFeature([ProposalProject]),
    TypeOrmModule.forFeature([ConceptProposalKeyword]),
  ],
  providers: [DatasetService],
})
export class WorksModule {}
