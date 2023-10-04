import { Module } from '@nestjs/common';
import { NlpManagerService } from './nlpmanager.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [NlpManagerService],
  exports: [NlpManagerService],
})
export class NlpManagerModule {}
