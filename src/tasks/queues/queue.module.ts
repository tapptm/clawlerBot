import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { QueueProcessor } from './queue.processor';
import { NlpManagerModule } from 'src/utils/nlpmanager/nlpmanager.module';
import { ProgressBar } from 'src/config/progress';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
  providers: [QueueService, QueueProcessor, ProgressBar],
  exports: [QueueService],
})
export class QueueModule {}
