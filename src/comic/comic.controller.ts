import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ComicModel } from './comic.model';

@Controller('comic')
export class ComicController {
  @Post('create')
  async create(@Body() dto: Omit<ComicModel, 'id'>) {}
  @Get(':id')
  async get(@Param('id') id: number) {}

  @Delete(':id')
  async delete(@Param('id') id: number) {}
  @Patch(':id')
  async patch(@Param('id') id: number, @Body() dto: ComicModel) {}
}
