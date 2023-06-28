import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
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
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Controller('chapter')
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: ChapterDto) {
    return this.chapterService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedChapter = await this.chapterService.deleteById(id);
    if (!deletedChapter) {
      throw new NotFoundException(CHAPTER_NOT_FOUND_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('byComic/:id')
  async deleteByComicId(@Param('id', IdValidationPipe) comicId: string) {
    return this.chapterService.deleteByComicId(comicId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('byComic/:comicId')
  async getByComicId(@Param('comicId', IdValidationPipe) comicId: string) {
    const chapters = await this.chapterService.findByComicId(comicId);
    if (chapters.length == 0) {
      throw new NotFoundException(CHAPTER_NOT_FOUND_ERROR);
    }
    return chapters;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id', IdValidationPipe) id: string) {
    const chapter = await this.chapterService.findById(id);
    if (!chapter) throw new NotFoundException(CHAPTER_NOT_FOUND_ERROR);
    return chapter[0];
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateChapterDto,
  ) {
    const chapter = await this.chapterService.update(id, dto);
    if (!chapter) {
      throw new NotFoundException(CHAPTER_NOT_FOUND_ERROR);
    }
    return chapter;
  }
}
