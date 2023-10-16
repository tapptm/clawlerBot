import { IsNotEmpty, IsArray, IsNumber } from 'class-validator';
export interface ExtractResponse {
  countNewKey: number;
}

export class ExtractPayload {
  @IsNotEmpty()
  @IsNumber()
  researchId: number;

  @IsNotEmpty()
  @IsArray()
  researchType: any[];
}
