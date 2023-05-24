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
import { ComicDocument } from './comic.model';
import { ComicDto } from './dto/Comic.dto';
import { ComicService } from './comic.service';
import { COMIC_NOT_FOUND_ERROR } from './comic.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateComicDto } from './dto/updateComic.dto';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { TypeValidationPipe } from 'src/pipes/type-validation.pipe';

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
  async get(@Param('id', IdValidationPipe) id: string) {
    const comic = await this.comicService.findById(id);
    if (!comic) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return comic;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getByType(@Query(TypeValidationPipe) { type }: { type: string }) {
    const comics = await this.comicService.findByType(type);
    if (!comics) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return comics;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedComic = await this.comicService.delete(id);
    if (!deletedComic) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return {
      message: `Comic ${deletedComic.title} deleted.`,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateComicDto,
  ) {
    const comic = await this.comicService.update(id, dto);
    if (!comic) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return comic;
  }
}
