import { ArrayMinSize, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { titleStatus, typeArray } from '../comic.constants';

export class ComicDto {
  @IsNotEmpty()
  @IsString()
  comicCover: string;

  @IsNotEmpty()
  @IsString()
  comicBg: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  alternativeTitle: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(typeArray)
  type: string;

  @ArrayMinSize(1, { message: 'At least one string is required' })
  @IsString({ each: true, message: 'All elements must be strings' })
  @IsNotEmpty()
  genres: string[];

  @IsString()
  @IsIn(titleStatus)
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsIn(titleStatus)
  @IsNotEmpty()
  translateStatus: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  artist: string;

  @IsString()
  @IsNotEmpty()
  publishingCompany: string;
}
