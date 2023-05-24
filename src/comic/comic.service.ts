import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ComicDocument, ComicModel } from './comic.model';
import { ComicDto } from './dto/Comic.dto';
import { COMIC_ALREADY_EXISTS_ERROR } from './comic.constants';
import { UpdateComicDto } from './dto/updateComic.dto';

const aggregationProps = (
  findBy: string,
  value: string,
  isObjectId?: boolean,
) => {
  return [
    {
      $match: {
        [findBy]: isObjectId ? new Types.ObjectId(value) : value,
      },
    },
    {
      $lookup: {
        from: 'chapters',
        localField: '_id',
        foreignField: 'comicId',
        as: 'chapters',
      },
    },
    {
      $addFields: {
        chaptersCount: { $size: '$chapters' },
      },
    },
    {
      $project: {
        chapters: 0,
      },
    },
  ];
};

@Injectable()
export class ComicService {
  constructor(@InjectModel('comic') private comicModel: Model<ComicModel>) {}
  async create(dto: ComicDto): Promise<ComicDocument> {
    const comic = await this.comicModel.findOne({
      alternativeTitle: dto.alternativeTitle,
    });
    if (comic) {
      throw new HttpException(COMIC_ALREADY_EXISTS_ERROR, HttpStatus.FORBIDDEN);
    }
    return this.comicModel.create(dto);
  }
  async findById(id: string) {
    return this.comicModel.aggregate(aggregationProps('_id', id, true)).exec();
  }
  async findByType(type: string): Promise<ComicDocument[] | null> {
    return this.comicModel.aggregate(aggregationProps('type', type)).exec();
  }
  async update(id: string, comicData: UpdateComicDto) {
    const comic = await this.comicModel.findOneAndUpdate(
      { _id: id },
      comicData,
      { new: true },
    );
    return comic;
  }
  async delete(id: string): Promise<ComicDocument | null> {
    return this.comicModel.findByIdAndDelete(id).exec();
  }
}
