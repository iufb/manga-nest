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

  //Get
  @Get('byComic/:comicId')
  async getByComicId(@Param('comicId', IdValidationPipe) comicId: string) {
    return this.chapterService.findByComicId(comicId);
  }
  @Get('reader/:comicId')
  async getReaderHeaderInfo(
    @Param('comicId', IdValidationPipe) comicId: string,
  ) {
    return this.chapterService.getReaderHeaderInfo(comicId);
  }

  @Get('popular')
  async getLatestPopularUploads() {
    const latestPopular = await this.chapterService.findLatestPopular();
    if (latestPopular.length == 0) {
      throw new NotFoundException(CHAPTER_NOT_FOUND_ERROR);
    }
    return latestPopular;
  }
  @Get('latest')
  async getLatestUploadChapters() {
    const latestChapters = await this.chapterService.findLatest();
    if (latestChapters.length == 0) {
      throw new NotFoundException(CHAPTER_NOT_FOUND_ERROR);
    }
    return latestChapters;
  }

  @Get(':comicId/:chapterNumber')
  async getChapterPage(
    @Param('comicId', IdValidationPipe) comicId: string,
    @Param('chapterNumber')
    chapterNumber: number,
  ) {
    return this.chapterService.getChapterPage(comicId, chapterNumber);
  }

  //Modify
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
}
