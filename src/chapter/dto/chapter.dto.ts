import { ArrayNotEmpty, IsArray, IsNumber, IsString } from 'class-validator';

export class ChapterDto {
  @IsString()
  comicId: string;

  @IsNumber()
  chapterNumber: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  pages: string[];
}
