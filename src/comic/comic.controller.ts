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
import { filterComic, sortDirectionType } from 'types';

@Controller('comic')
export class ComicController {
  constructor(private readonly comicService: ComicService) {}

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: ComicDto): Promise<ComicDocument> {
    return this.comicService.create(dto);
  }
  @Post('filter')
  async filterComic(@Body() data: filterComic) {
    const comics = await this.comicService.getFiltered(data);
    if (comics.length == 0) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return comics;
  }
  @Get()
  async getAll(
    @Query()
    {
      sortType,
      sortDirection,
    }: {
      sortType?: string;
      sortDirection?: sortDirectionType;
    },
  ) {
    const comics = await this.comicService.getAll(sortType, sortDirection);
    if (!comics) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return comics;
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const comic = await this.comicService.findById(id);
    if (!comic) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return comic[0];
  }

  @Get('/type/:type')
  async getByType(@Param('type', TypeValidationPipe) type: string) {
    const comics = await this.comicService.findByType(type);
    if (!comics) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    return comics;
  }

  @Get('search/:searchText')
  async getByText(@Param('searchText') searchText: string) {
    const comics = await this.comicService.findByText(searchText);
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
