import { IsIn, IsOptional, IsString } from 'class-validator';
import { roleArray } from '../user.constants';

export class UserDto {
  @IsString()
  name: string;

  @IsIn(roleArray)
  @IsString()
  role: string;

  @IsString()
  avatar: string;

  @IsString()
  @IsOptional()
  readingComics?: string[];
}
