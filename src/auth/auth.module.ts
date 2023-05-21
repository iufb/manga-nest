import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/configs/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'user',
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
