import { Injectable, Param, Patch } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './user.model';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('user') private userModel: Model<UserModel>) {}
  async findUser(email: string) {
    const user = await this.userModel.find({ email }).exec();
    // Check if user credentials doesn't added returns only email.
    if (user.length == 0) {
      return { email };
    }
    return user[0];
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
