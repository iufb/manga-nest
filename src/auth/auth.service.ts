import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from './user.model';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('user') private authModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUser: AuthDto): Promise<UserModel> {
    const salt = await genSalt(10);
    const newUser = new this.authModel({
      email: createUser.login,
      passwordHash: await hash(createUser.password, salt),
    });
    return newUser.save();
  }

  async findUser(email: string): Promise<UserModel> {
    const user = await this.authModel.findOne({ email }).exec();
    return user;
  }
  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isValidPassword = await compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { email };
  }
  async login(email: string) {
    const payload = { email };
    return {
      access_toket: await this.jwtService.signAsync(payload),
    };
  }
}
