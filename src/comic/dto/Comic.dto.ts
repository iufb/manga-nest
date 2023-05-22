import { ArrayMinSize, IsIn, IsString } from 'class-validator';
import { TypeArray } from '../comic.constants';

export class ComicDto {
  @IsString()
  imgCover: string;

  @IsString()
  title: string;

  @IsString()
  alternativeTitle: string;

  @IsString()
  description: string;

  @IsString()
  @IsIn(TypeArray)
  type: string;

  @ArrayMinSize(1, { message: 'At least one string is required' })
  @IsString({ each: true, message: 'All elements must be strings' })
  genres: string[];
}
