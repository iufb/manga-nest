import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() dto: AuthDto) {
    console.log(dto);
    return this.authService.create(dto);
  }
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {}
  @Get('findAll')
  async findAll() {
    const users = await this.authService.findAll();
    return users;
  }
}
