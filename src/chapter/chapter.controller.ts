import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChapterModel } from './chapter.model';

@Controller('chapter')
export class ChapterController {
  @Get(':comicId')
  async getByComicId(@Param('comicId') comicId: number) {}

  @Delete(':id')
  async delete(@Param('id') id: number) {}

  @Post('post')
  async post(@Body() dto: Omit<ChapterModel, 'id'>) {}
}
