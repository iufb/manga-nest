import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/createRating.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RATE_NOT_FOUND_ERROR } from './rate.constats';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async createRate(@Body() dto: CreateRatingDto) {
    return this.ratingService.addRateToComic(dto);
  }
  @Get('comic/:comicId')
  async getComicRate(@Param('comicId') comicId: string) {
    const comicRate = await this.ratingService.getTotalComicRating(comicId);
    if (!comicRate) {
      throw new NotFoundException(RATE_NOT_FOUND_ERROR);
    }
    console.log(comicRate);
    return comicRate;
  }
  @Get(':userId/:comicId')
  @UseGuards(JwtAuthGuard)
  async getUserRate(
    @Param('userId') userId: string,
    @Param('comicId') comicId: string,
  ) {
    const rate = await this.ratingService.findAddedRate(comicId, userId);
    if (!rate) {
      return new NotFoundException(RATE_NOT_FOUND_ERROR);
    }
    return rate;
  }
}
