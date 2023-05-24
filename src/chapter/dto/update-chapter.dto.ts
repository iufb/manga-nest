import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class UpdateChapterDto {
  @IsOptional()
  @IsNumber()
  chapterNumber?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  pages?: string[];
}
