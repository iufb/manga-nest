import { IsArray, IsString } from 'class-validator';

export class ReadingComicsDto {
  @IsString({ each: true })
  @IsArray()
  readingComics: string[];
}
