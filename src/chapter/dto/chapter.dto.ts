import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ChapterDto {
  @IsString()
  comicId: string;

  @IsNumber()
  chapterNumber: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  pages: string[];
}
