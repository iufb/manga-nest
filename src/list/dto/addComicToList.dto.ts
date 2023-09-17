import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { listArray } from '../list.constants';
import { lastChapterType } from 'types';

export class AddComicToListDto {
  @IsString()
  comic: string;

  @IsString()
  user: string;

  @IsString()
  @IsIn(listArray)
  listType: 'reading' | 'planned' | 'dropped' | 'finished';

  @IsOptional()
  lastChapter?: lastChapterType;
}
