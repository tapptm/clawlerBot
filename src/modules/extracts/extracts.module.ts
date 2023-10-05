import { Module } from '@nestjs/common';
import { ExtractService } from './extracts.service';
import { ExtractController } from './extracts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptProposal } from 'src/modules/datasets/entity/concept.entity';
import { DatasetService } from 'src/modules/datasets/datasets.service';
import { ProposalProject } from 'src/modules/datasets/entity/proposal.entity';
import { ConceptProposalKeyword } from 'src/modules/datasets/entity/keyword.entity';
import { NlpManagerModule } from 'src/utils/nlpmanager/nlpmanager.module';
import { ProgressBar } from 'src/config/progress';
import { KeywordsService } from '../keywords/keywords.service';
import { Keywords } from '../keywords/entity/keywords.entity';
import { Projects } from '../keywords/entity/projects.entity';
import { Automation } from '../keywords/entity/automation.entity';
import { QueueModule } from 'src/tasks/queues/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConceptProposal,
      ProposalProject,
      ConceptProposalKeyword,
      Keywords,
      Projects,
      Automation,
    ]),
    NlpManagerModule,
    QueueModule,
  ],
  providers: [ExtractService, DatasetService, KeywordsService, ProgressBar],
  controllers: [ExtractController],
})
export class ExtractModule {}
