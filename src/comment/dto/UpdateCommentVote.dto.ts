import { IsBoolean, IsString } from 'class-validator';

export class UpdateCommentVoteDto {
  @IsString()
  commentId: string;
  @IsString()
  userId: string;
  @IsBoolean()
  liked: boolean;
}
