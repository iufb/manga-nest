import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/CreateComment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateCommentVoteDto } from './dto/UpdateCommentVote.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post('create')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  async createComment(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Get('chapter')
  async getCommentsForChapter(
    @Query()
    {
      comic,
      type,
      chapter,
      page,
    }: {
      comic: string;
      type: 'comic' | 'page';
      chapter: number;
      page: number;
    },
  ) {
    return this.commentService.getComments(comic, type, chapter, page);
  }
  @Get('comic')
  async getCommentsForComic(
    @Query() { comic, type }: { comic: string; type: 'comic' | 'page' },
  ) {
    return this.commentService.getComments(comic, type);
  }

  @Get('vote/user')
  async getUserVote(
    @Query() { commentId, userId }: { commentId: string; userId: string },
  ) {
    return this.commentService.getUserVote(userId, commentId);
  }

  @Patch('vote')
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  async changeCommentVote(@Body() dto: UpdateCommentVoteDto) {
    return this.commentService.changeCommentVote(dto);
  }
}
