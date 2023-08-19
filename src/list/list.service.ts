import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ListModel, UserListModel } from './list.model';
import { AddComicToListDto } from './dto/addComicToList.dto';
import { listType } from 'types';
import { LIST_NOT_FOUND_ERROR } from './list.constants';
import { CreateListDto } from './dto/createList.dto';
import { NotFoundError } from 'rxjs';
import { COMIC_NOT_FOUND_ERROR } from 'src/comic/comic.constants';

@Injectable()
export class ListService {
  constructor(@InjectModel('list') private listModel: Model<ListModel>) {}

  //create

  async create({ comic }: CreateListDto) {
    const list = new this.listModel({
      comic: new Types.ObjectId(comic),
      users: [],
    });
    return list.save();
  }
  //find
  async findByComic(comicId: string) {
    const list = await this.listModel.findOne({
      comic: new Types.ObjectId(comicId),
    });
    return list;
  }
  async findUserIndexInList(list: ListModel, userId: string) {
    return list.users.findIndex(
      (l: UserListModel) => l.userId == new Types.ObjectId(userId),
    );
  }
  async changeListType(comicId: string, listType: listType, userIndex: number) {
    await this.listModel.updateOne(
      { comic: new Types.ObjectId(comicId) },
      {
        $set: {
          [`users.${userIndex}.listType`]: listType,
        },
      },
    );
  }
  //add
  async addUserToComicList(
    comicId: string,
    userId: string,
    lastChapter: number,
    listType: listType,
  ) {
    await this.listModel.updateOne(
      { comic: new Types.ObjectId(comicId) },
      {
        $push: {
          users: { userId, listType, lastChapter },
        },
      },
    );
  }
  async addComicToList(dto: AddComicToListDto) {
    const list = await this.findByComic(dto.comic);
    if (!list) {
      throw new NotFoundException(LIST_NOT_FOUND_ERROR);
    }
    const userIndex = await this.findUserIndexInList(list, dto.user);
    if (userIndex == -1) {
      return this.addUserToComicList(
        dto.comic,
        dto.user,
        dto.lastChapter,
        dto.listType,
      );
    }
    return this.changeListType(dto.comic, dto.listType, userIndex);
  }
  async getListType(comicId: string, userId: string) {
    const list = await this.findByComic(comicId);
    if (!list) {
      throw new NotFoundException(LIST_NOT_FOUND_ERROR);
    }
    const res = list.users.find((l) => l.userId == new Types.ObjectId(userId));
    if (!res) {
      return 'add to list';
    }
    return { listType: res.listType, lastChapter: res.lastChapter };
  }
  async getLastReadedChapter(userId: string, comicId: string) {
    const list = await this.findByComic(comicId);
    const user = list.users.find(
      (user) => user.userId == new Types.ObjectId(userId),
    );
    return user.lastChapter;
  }
  async updateLastReaderChapter(
    userId: string,
    comicId: string,
    lastChapter: number,
  ) {
    const list = await this.findByComic(comicId);
    const userIndex = await this.findUserIndexInList(list, userId);
    if (userIndex == -1) {
      await this.addUserToComicList(comicId, userId, lastChapter, 'reading');
    } else {
      await this.listModel.updateOne(
        { comic: new Types.ObjectId(comicId) },
        {
          $set: {
            [`users.${userIndex}.lastChapter`]: lastChapter,
          },
        },
      );
    }
  }
  async getComicsByListType(userId: string, listType: listType) {
    const comics = await this.listModel.aggregate([
      {
        $match: {
          users: {
            $elemMatch: {
              userId,
              listType,
            },
          },
        },
      },
      {
        $lookup: {
          from: 'comics',
          localField: 'comic',
          foreignField: '_id',
          as: 'comicData',
        },
      },
      {
        $lookup: {
          from: 'chapters',
          localField: 'comic',
          foreignField: 'comicId',
          as: 'chapters',
        },
      },
      {
        $addFields: {
          chaptersCount: { $size: '$chapters' },
        },
      },
      { $unwind: '$comicData' },
      {
        $project: {
          _id: 0,
          __v: 0,
          createdAt: 0,
          comicData: {
            _id: 0,
            comicBg: 0,
            list: 0,
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
    ]);
    if (comics.length == 0) {
      throw new NotFoundException(COMIC_NOT_FOUND_ERROR);
    }
    const result = comics.map((comic) => {
      const user = comic.users.find(
        (user: Record<string, string>) => user.userId == userId,
      );
      comic.lastChapter = user.lastChapter;
      delete comic.users;
      return comic;
    });
    return result;
  }
}
