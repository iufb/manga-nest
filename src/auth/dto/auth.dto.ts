import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  login: string;

  @Length(6)
  @IsString()
  password: string;
}
