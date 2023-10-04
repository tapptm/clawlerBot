import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorksModule } from './modules/datasets/datasets.module';
import { ExtractModule } from './modules/extracts/extracts.module';
import { DatabaseModule } from './config/orm/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    DatabaseModule,
    WorksModule,
    ExtractModule,
  ],
})
export class AppModule {}
