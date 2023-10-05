import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorksModule } from './modules/datasets/datasets.module';
import { ExtractModule } from './modules/extracts/extracts.module';
import { DatabaseModule } from './config/database/database.module';
import { CronjobsModule } from './tasks/cronjobs/cronjobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueModule } from './tasks/queues/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    WorksModule,
    ExtractModule,
    CronjobsModule,
    QueueModule,
  ],
})
export class AppModule {}
