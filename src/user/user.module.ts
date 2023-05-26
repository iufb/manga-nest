import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from 'src/auth/user.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserModel }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
