import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';
import { UserEmail } from 'src/decorators/user-email.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
