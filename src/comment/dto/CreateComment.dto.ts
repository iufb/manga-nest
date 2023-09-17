import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { commentTypeValues } from '../comment.constants';
class CommentFor {
  @IsString()
  comicId: string;

  @IsOptional()
  @IsNumber()
  chapterNumber?: string;

  @IsOptional()
  @IsNumber()
  page?: number;
}
export class CreateCommentDto {
  @IsString()
  userId: string;

  @IsString()
  comment: string;

  @IsString()
  @IsIn(commentTypeValues)
  type: 'comic' | 'page';

  @IsString()
  rootId: string;

  commentFor: CommentFor;

  @IsNumber()
  commentLevel: number;

  @IsString()
  parentComment: string;

  @IsNumber()
  votesUp: number;

  @IsNumber()
  votesDown: number;

  @IsOptional()
  sticky: boolean;
}
