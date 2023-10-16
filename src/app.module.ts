import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorksModule } from './modules/datasets/datasets.module';
import { ExtractModule } from './modules/extracts/extracts.module';
import { DatabaseModule } from './config/database/database.module';
import { CronjobsModule } from './tasks/cronjobs/cronjobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueModule } from './tasks/queues/queue.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    WorksModule,
    ExtractModule,
    CronjobsModule,
    QueueModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
