import { ArrayMinSize, IsIn, IsOptional, IsString } from 'class-validator';
import { titleStatus, typeArray } from '../comic.constants';
import { Exclude } from 'class-transformer';

export class UpdateComicDto {
  @IsOptional()
  @Exclude()
  _id?: string;

  @IsOptional()
  @IsString()
  comicCover?: string;

  @IsOptional()
  @IsString()
  comicBg?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  alternativeTitle?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(typeArray)
  type?: string;

  @ArrayMinSize(1, { message: 'At least one string is required' })
  @IsString({ each: true, message: 'All elements must be strings' })
  @IsOptional()
  genres?: string[];

  @IsString()
  @IsOptional()
  @IsIn(titleStatus)
  status?: string;

  @IsString()
  @IsOptional()
  @IsIn(titleStatus)
  translateStatus?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  artist?: string;

  @IsString()
  @IsOptional()
  publishingCompany?: string;
}
