import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { listArray } from '../list.constants';

export class AddComicToListDto {
  @IsString()
  comic: string;

  @IsString()
  user: string;

  @IsString()
  @IsIn(listArray)
  listType: 'reading' | 'planned' | 'dropped' | 'finished';

  @IsOptional()
  @IsNumber()
  lastChapter?: number;
}
