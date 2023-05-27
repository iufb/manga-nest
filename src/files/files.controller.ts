import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { UserEmail } from 'src/decorators/user-email.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileElementResponse } from './dto/file-element.response';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @UserEmail() email: string,
  ): Promise<FileElementResponse> {
    const name = email.split('@')[0];
    return this.filesService.saveAvatars(file, name);
  }
  @UseGuards(JwtAuthGuard)
  @Post('upload/chapter')
  @UseInterceptors(FileInterceptor('file'))
  async uploadChapter(
    @UploadedFile() file: Express.Multer.File,
    @Query() { comicName }: { comicName: string },
  ): Promise<FileElementResponse[]> {
    return this.filesService.unzipAndSave(file, comicName);
  }
}
