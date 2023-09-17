import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChapterDocument, ChapterModel } from './chapter.model';
import { ChapterDto } from './dto/chapter.dto';
import { CHAPTER_ALREADY_EXISTS_ERROR } from './chapter.constants';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { path } from 'app-root-path';
import { rename } from 'fs-extra';
import { CHAPTER_NOT_FOUND_ERROR } from './chapter.constants';
import { ComicModel } from 'src/comic/comic.model';
import { chapterType, updateLatestChapters } from 'types';
const latestAggregationProps = [
  {
    $lookup: {
      from: 'comics',
      localField: 'comicId',
      foreignField: '_id',
      as: 'comic',
    },
  },
  {
    $unwind: '$comic',
  },
  {
    $project: {
      pages: 0,
      comic: {
        _id: 0,
        description: 0,
        type: 0,
        genres: 0,
        status: 0,
        translateStatus: 0,
        author: 0,
        artist: 0,
        publishingCompany: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  },
];
@Injectable()
export class ChapterService {
  constructor(
    @InjectModel('chapter') private chapterModel: Model<ChapterModel>,
    @InjectModel('comic') private comicModel: Model<ComicModel>,
  ) {}
  //Create
  async create(dto: ChapterDto) {
    const chapter = await this.chapterModel.find({
      comicId: new Types.ObjectId(dto.comicId),
      chapterNumber: dto.chapterNumber,
    });

    if (chapter.length > 0) {
      throw new ForbiddenException(CHAPTER_ALREADY_EXISTS_ERROR);
    }
    const pagesFolderPath = `${path}/uploads/comics/${dto.comicId}`;
    await rename(
      `${pagesFolderPath}/chapters`,
      `${pagesFolderPath}/${dto.chapterNumber}`,
    );
    const pages = dto.pages.map((page) =>
      page.replace('chapters', `${dto.chapterNumber}`),
    );
    return this.chapterModel.create({
      ...dto,
      pages,
      comicId: new Types.ObjectId(dto.comicId),
    });
  }

  //Find
  async findLatest() {
    const chapters: updateLatestChapters[] = await this.chapterModel.aggregate([
      ...latestAggregationProps,
      {
        $addFields: {
          chapterNumbers: [
            {
              chapter: `$chapterNumber`,
              name: '$name',
            },
          ],
        },
      },
      {
        $project: {
          chapterNumber: 0,
          name: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      { $limit: 10 },
    ]);
    return chapters;
  }
  async findLatestPopular() {
    return this.chapterModel.aggregate([
      ...latestAggregationProps,
      {
        $lookup: {
          from: 'ratings',
          localField: 'comicId',
          foreignField: 'comicId',
          as: 'rating',
        },
      },
      {
        $addFields: {
          avgRating: {
            $ifNull: [{ $avg: '$rating.rate' }, 0],
          },
        },
      },

      {
        $project: {
          rating: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      { $limit: 7 },
    ]);
  }
  async findByComicId(comicId: string) {
    const chapters = await this.chapterModel.find({
      comicId: new Types.ObjectId(comicId),
    });
    if (chapters.length == 0) {
      throw new NotFoundException(CHAPTER_NOT_FOUND_ERROR);
    }
    return chapters;
  }
  async getReaderHeaderInfo(comicId: string) {
    const chapters = await this.findByComicId(comicId);
    const comic = await this.comicModel.findOne({ _id: comicId });
    return {
      chaptersQuantity: chapters.length,
      comicName: comic.title,
    };
  }
  async getChapterPage(comicId: string, chapterNumber: number) {
    const chapter: chapterType = await this.chapterModel.findOne({
      comicId: new Types.ObjectId(comicId),
      chapterNumber,
    });
    if (!chapter) {
      throw new NotFoundException(CHAPTER_NOT_FOUND_ERROR);
    }
    let previosChapter: chapterType;
    if (chapterNumber !== 1) {
      previosChapter = await this.chapterModel.findOne({
        comicId: new Types.ObjectId(comicId),
        chapterNumber: chapterNumber - 1,
      });
    }
    const url = chapter.pages[0];
    const index = url.lastIndexOf('/');
    const baseUrl = url.slice(0, index + 1);
    return {
      chapterId: chapter._id,
      baseUrl,
      pagesQuantity: chapter.pages.length,
      prevChapterPageQuantity: previosChapter
        ? previosChapter.pages.length
        : null,
    };
  }
  // Modify
  async update(id: string, dto: UpdateChapterDto) {
    const chapter = await this.chapterModel.findByIdAndUpdate(
      { _id: id },
      dto,
      { new: true },
    );
    return chapter;
  }
  async deleteById(id: string): Promise<ChapterDocument | null> {
    return this.chapterModel.findByIdAndDelete(id).exec();
  }
  async deleteByComicId(comicId: string) {
    return this.chapterModel
      .deleteMany({ comicId: new Types.ObjectId(comicId) })
      .exec();
  }
}
