import {
  Body,
  Controller,
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
import { ListService } from './list.service';
import { AddComicToListDto } from './dto/addComicToList.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateListDto } from './dto/createList.dto';
import { listType } from 'types';
import { LASTCHAPTER_NOT_FOUND_ERROR } from './list.constants';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createComicList(@Body() dto: CreateListDto) {
    return this.listService.create(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async addComicToList(@Body() dto: AddComicToListDto) {
    return this.listService.addComicToList(dto);
  }

  @Get(':comicId/:userId')
  @UseGuards(JwtAuthGuard)
  async getListType(
    @Param('comicId') comicId: string,
    @Param('userId') userId: string,
  ) {
    return this.listService.getListType(comicId, userId);
  }
  @Get('/listType')
  @UseGuards(JwtAuthGuard)
  async getComicsByListType(
    @Query() { userId, listType }: { userId: string; listType: listType },
  ) {
    return this.listService.getComicsByListType(userId, listType);
  }
  @Get('/lastChapter/:userId/:comicId')
  @UseGuards(JwtAuthGuard)
  async getLastReadedChapter(
    @Param('userId') userId: string,
    @Param('comicId') comicId: string,
  ) {
    const lastChapter = await this.listService.getLastReadedChapter(
      userId,
      comicId,
    );
    if (!lastChapter) {
      throw new NotFoundException(LASTCHAPTER_NOT_FOUND_ERROR);
    }
    return lastChapter;
  }
  @Patch('/lastChapter/:userId/:comicId/')
  @UseGuards(JwtAuthGuard)
  async updateLastChapter(
    @Param('userId') userId: string,
    @Param('comicId') comicId: string,
    @Body() lastChapter: { chapterNumber: number; page: number },
  ) {
    return this.listService.updateLastReadedChapter(
      userId,
      comicId,
      lastChapter.chapterNumber,
      lastChapter.page,
    );
  }
}
