import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChapterDocument, ChapterModel } from './chapter.model';
import { ChapterDto } from './dto/chapter.dto';
import { CHAPTER_ALREADY_EXISTS_ERROR } from './chapter.constants';

@Injectable()
export class ChapterService {
  constructor(
    @InjectModel('chapter') private chapterModel: Model<ChapterModel>,
  ) {}
  async create(dto: ChapterDto) {
    const chapter = await this.chapterModel.find({
      comicId: dto.comicId,
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
  async delete(id: string): Promise<ChapterDocument | null> {
    return this.chapterModel.findByIdAndDelete(id).exec();
  }
}
