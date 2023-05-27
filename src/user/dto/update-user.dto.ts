import { IsIn, IsOptional, IsString } from 'class-validator';
import { roleArray } from '../user.constants';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsIn(roleArray)
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString({ each: true })
  @IsOptional()
  readingComics?: string[];
}
