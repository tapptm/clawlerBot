import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processor';
import { NlpManagerModule } from 'src/utils/nlpmanager/nlpmanager.module';
import { ProgressBar } from 'src/config/progress';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeywordsService } from 'src/modules/keywords/keywords.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keywords } from 'src/modules/keywords/entity/keywords.entity';
import { Projects } from 'src/modules/keywords/entity/projects.entity';
import { Automation } from 'src/modules/keywords/entity/automation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Keywords, Projects, Automation]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: 'myQueue' }),
    NlpManagerModule,
  ],
  providers: [QueueService, QueueProcessor, ProgressBar, KeywordsService],
  exports: [QueueService],
})
export class QueueModule {}
