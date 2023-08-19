import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateRatingDto {
  @IsString()
  userId: string;

  @IsString()
  comicId: string;

  @Min(1)
  @Max(5)
  @IsNumber()
  rate: number;
}
