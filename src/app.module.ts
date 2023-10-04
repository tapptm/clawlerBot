import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorksModule } from './modules/datasets/datasets.module';
import { ConceptProposal } from './modules/datasets/entity/concept.entity';
import { ExtractModule } from './modules/extracts/extracts.module';
import { ProposalProject } from './modules/datasets/entity/proposal.entity';
import { ConceptProposalKeyword } from './modules/datasets/entity/keyword.entity';
import { Keywords } from './modules/keywords/entity/keywords.entity';
import { Projects } from './modules/keywords/entity/projects.entity';
import { Automation } from './modules/keywords/entity/automation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '143.198.86.6',
      port: 13307,
      username: 'kilab',
      password: 'P@ssW0rd0',
      database: 'kminnovations',
      entities: [
        ConceptProposal,
        ProposalProject,
        ConceptProposalKeyword,
        Keywords,
        Projects,
        Automation,
      ],
      synchronize: false,
    }),
    WorksModule,
    ExtractModule,
  ],
})
export class AppModule {}
