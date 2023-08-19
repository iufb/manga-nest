import { IsString } from 'class-validator';

export class CreateListDto {
  @IsString()
  comic: string;
}
