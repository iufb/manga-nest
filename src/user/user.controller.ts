import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';
import { UserEmail } from 'src/decorators/user-email.decorator';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@UserEmail() email: string, @Body() dto: UserDto) {
    const user = await this.userService.create(dto, email);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@UserEmail() email: string) {
    return this.userService.findUser(email);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Patch()
  async patch(@UserEmail() email: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(email, dto);
  }
}
