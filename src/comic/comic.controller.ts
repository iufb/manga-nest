import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ComicDocument, ComicModel } from './comic.model';
import { ComicDto } from './dto/Comic.dto';
import { ComicService } from './comic.service';
import { COMIC_NOT_FOUND_ERROR } from './comic.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('comic')
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: ComicDto): Promise<ComicDocument> {
    return this.comicService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(@Param('id') id: string) {
    const comic = await this.comicService.findById(id);
    if (!comic) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return comic;
  }

  @Get()
  async getByType(@Query() { type }: { type: string }) {
    const comics = await this.comicService.findByType(type);
    console.log(comics);
    if (!comics) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return comics;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedComic = await this.comicService.delete(id);
    if (!deletedComic) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return {
      message: `Comic ${deletedComic.title} deleted.`,
    };
  }

  @Patch(':id')
  async patch(@Param('id') id: number, @Body() dto: ComicModel) {}
}
