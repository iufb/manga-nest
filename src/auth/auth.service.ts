import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthModel } from './auth.model';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel('auth') private authModel: Model<AuthModel>) {}

  async create(createUser: AuthDto): Promise<AuthModel> {
    console.log(createUser, 'service');
    const user = await this.authModel.create(createUser);
    return user.save();
  }

  async findAll(): Promise<AuthModel[]> {
    return this.authModel.find().exec();
  }
}
