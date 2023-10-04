import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keywords } from './entity/keywords.entity';
import { Projects } from './entity/projects.entity';
import { Automation } from './entity/automation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Keywords]),
    TypeOrmModule.forFeature([Projects]),
    TypeOrmModule.forFeature([Automation]),
  ],
  providers: [KeywordsService],
})
export class KeywordsModule {}
