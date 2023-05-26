import { IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsOptional()
  readingComics?: string[];
}
