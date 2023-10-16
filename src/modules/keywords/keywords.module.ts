import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keywords } from './entity/keywords.entity';
import { Projects } from './entity/projects.entity';
import { Automation } from './entity/automation.entity';
import { QueueModule } from 'src/tasks/queues/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Keywords, Projects, Automation]),
    QueueModule,
  ],
  providers: [KeywordsService],
})
export class KeywordsModule {}
