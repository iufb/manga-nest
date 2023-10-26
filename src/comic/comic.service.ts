import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ComicDocument, ComicModel } from './comic.model';
import { ComicDto } from './dto/Comic.dto';
import { COMIC_ALREADY_EXISTS_ERROR } from './comic.constants';
import { UpdateComicDto } from './dto/updateComic.dto';
import { filterComic, sortDirectionType } from 'types';
const fullComicData = [
  {
    $lookup: {
      from: 'chapters',
      localField: '_id',
      foreignField: 'comicId',
      as: 'chapters',
    },
  },
  {
    $lookup: {
      from: 'ratings',
      localField: '_id',
      foreignField: 'comicId',
      as: 'ratings',
    },
  },

  {
    $addFields: {
      chaptersCount: { $size: '$chapters' },
      rateCount: { $size: '$ratings' },
      rate: {
        $ifNull: [{ $avg: '$ratings.rate' }, 0],
      },
    },
  },
  {
    $project: {
      chapters: 0,
      ratings: 0,
    },
  },
];
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
  async findByText(text: string): Promise<ComicDocument[] | null> {
    return this.comicModel.find({
      $text: { $search: text, $caseSensitive: false },
    });
  }
  async getAll(sortType?: string, sortDirection?: sortDirectionType) {
    const sort = sortType ? sortType : 'rate';
    const direction = sortDirection ? sortDirection : 'desc';
    return this.comicModel.aggregate([
      ...fullComicData,
      { $sort: { [sort]: direction == 'asc' ? 1 : -1 } },
    ]);
  }
  async getFiltered(data: filterComic) {
    const query: Record<string, unknown> = {};
    if (data.genres.length > 0) {
      query.genres = { $in: data.genres };
    }
    if (data.status && data.status.length > 0) {
      query.status = { $in: data.status };
    }
    if (data.type && data.type.length > 0) {
      query.type = { $in: data.type };
    }
    if (data.translateStatus && data.translateStatus.length > 1) {
      query.translateStatus = { $in: data.translateStatus };
    }
    const { sortType, sortDirection } = data;
    return this.comicModel.aggregate([
      { $match: { ...query } },
      ...fullComicData,
      {
        $sort: {
          [sortType]: sortDirection == 'asc' ? 1 : -1,
        },
      },
    ]);
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
