import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { AuthModel } from './auth.model';
import { UserModel } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('auth') private authModel: Model<AuthModel>,
    @InjectModel('user') private userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: AuthDto): Promise<AuthModel> {
    const salt = await genSalt(10);
    const newUser = new this.authModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });
    await this.userModel.create({ email: dto.login, role: 'default' });
    return newUser.save();
  }
  async findUser(email: string): Promise<AuthModel> {
    const user = await this.authModel.findOne({ email }).exec();
    return user;
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<AuthModel, 'email'>> {
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
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
