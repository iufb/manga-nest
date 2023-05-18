import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.configService.get('TEST');
  }
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {}
}
