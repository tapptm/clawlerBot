import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { cleansing } from '../../common/constant';
import { AxiosError } from 'axios';
import { NlpResponse } from './interface/nlpmanager.interface';

@Injectable()
export class NlpManagerService {
  constructor(private readonly httpService: HttpService) {}

  async cleansingText(text: string): Promise<NlpResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post(cleansing, { text }).pipe(
        catchError((error: AxiosError) => {
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}
