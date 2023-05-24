import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChapterDocument, ChapterModel } from './chapter.model';
import { ChapterDto } from './dto/chapter.dto';
import { CHAPTER_ALREADY_EXISTS_ERROR } from './chapter.constants';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel('chapter') private chapterModel: Model<ChapterModel>,
  ) {}
  async create(dto: ChapterDto) {
    const chapter = await this.chapterModel.find({
      comicId: new Types.ObjectId(dto.comicId),
      chapterNumber: dto.chapterNumber,
    });
    if (chapter.length > 0) {
      throw new ForbiddenException(CHAPTER_ALREADY_EXISTS_ERROR);
    }
    return this.chapterModel.create({
      ...dto,
      comicId: new Types.ObjectId(dto.comicId),
    });
  }
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
  async findById(id: string) {
    return this.chapterModel.findById(id).exec();
  }
  async findByComicId(comicId: string) {
    return this.chapterModel.find({
      comicId: new Types.ObjectId(comicId),
    });
  }
}
