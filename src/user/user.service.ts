import { Injectable, Patch } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './user.model';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private userModel: Model<UserModel>) {}
  async create(dto: UserDto, email: string) {
    const user = new this.userModel({
      email,
      ...dto,
    });
    return user.save();
  }
  async findUser(email: string): Promise<UserModel> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }
  async update(email: string, dto: UpdateUserDto) {
    await this.userModel.findOneAndUpdate(
      { email },
      {
        $set: {
          name: dto.name,
          role: dto.role,
          avatar: dto.avatar,
        },
        $push: {
          readingComics: dto.readingComics,
        },
      },
      { new: true },
    );
    return this.userModel.findOne({ email }, { passwordHash: 0 });
  }
}
