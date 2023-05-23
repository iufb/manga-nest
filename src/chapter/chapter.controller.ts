import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChapterModel } from './chapter.model';
import { ChapterService } from './chapter.service';
import { ChapterDto } from './dto/chapter.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CHAPTER_NOT_FOUND_ERROR } from './chapter.constants';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: ChapterDto) {
    return this.chapterService.create(dto);
  }

  @Get(':comicId')
  async getByComicId(@Param('comicId') comicId: string) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedChapter = await this.chapterService.delete(id);
    if (!deletedChapter) {
      throw new NotFoundException(CHAPTER_NOT_FOUND_ERROR);
    }
  }

  @Post('post')
  async post(@Body() dto: Omit<ChapterModel, 'id'>) {}
}
