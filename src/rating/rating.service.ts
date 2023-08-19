import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RatingModel } from './rating.model';
import { CreateRatingDto } from './dto/createRating.dto';
import { ComicDto } from 'src/comic/dto/Comic.dto';

@Injectable()
export class RatingService {
  constructor(@InjectModel('rating') private ratingModel: Model<RatingModel>) {}

  async create(dto: CreateRatingDto) {
    return this.ratingModel.create(dto);
  }
  async findAddedRate(comicId: string, userId: string) {
    return this.ratingModel.findOne({
      userId,
      comicId,
    });
  }
  async changeRate({ userId, comicId, rate }: CreateRatingDto) {
    return this.ratingModel.updateOne(
      {
        comicId,
        userId,
      },
      {
        $set: {
          rate,
        },
      },
    );
  }
  async addRateToComic(dto: CreateRatingDto) {
    const addedRate = await this.findAddedRate(dto.comicId, dto.userId);
    if (!addedRate) {
      return this.create(dto);
    } else {
      return this.changeRate(dto);
    }
  }
  async getTotalComicRating(comicId: string) {
    const comicRate = await this.ratingModel
      .aggregate([
        {
          $match: {
            comicId,
          },
        },
        {
          $group: {
            _id: comicId,
            averageRate: { $avg: '$rate' },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ])
      .exec();
    const rateNumber = await this.ratingModel
      .aggregate([
        {
          $match: {
            comicId,
          },
        },
        { $count: 'rateNumber' },
      ])
      .exec();
    return { ...comicRate[0], ...rateNumber[0] };
  }
}
