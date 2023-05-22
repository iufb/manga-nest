import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ComicDocument, ComicModel } from './comic.model';
import { ComicDto } from './dto/Comic.dto';
import { COMIC_ALREADY_EXISTS_ERROR } from './comic.constants';

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
  async findById(id: string): Promise<ComicDocument | null> {
    return this.comicModel.findById(id).exec();
  }
  async findByType(type: string): Promise<ComicDocument[] | null> {
    return this.comicModel.find({ type }).exec();
  }
  async delete(id: string): Promise<ComicDocument | null> {
    return this.comicModel.findByIdAndDelete(id).exec();
  }
}
