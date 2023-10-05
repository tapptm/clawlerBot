import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { DatasetService } from 'src/modules/datasets/datasets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConceptProposal } from 'src/modules/datasets/entity/concept.entity';
import { ExtractService } from 'src/modules/extracts/extracts.service';
import { KeywordsService } from 'src/modules/keywords/keywords.service';
import { ProgressBar } from 'src/config/progress';
import { Keywords } from 'src/modules/keywords/entity/keywords.entity';
import { Projects } from 'src/modules/keywords/entity/projects.entity';
import { Automation } from 'src/modules/keywords/entity/automation.entity';
import { NlpManagerModule } from 'src/utils/nlpmanager/nlpmanager.module';
import { QueueModule } from '../queues/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConceptProposal, Keywords, Projects, Automation]),
    NlpManagerModule,
    QueueModule,
  ],
  providers: [
    CronjobsService,
    DatasetService,
    ExtractService,
    KeywordsService,
    ProgressBar,
  ],
})
export class CronjobsModule {}
