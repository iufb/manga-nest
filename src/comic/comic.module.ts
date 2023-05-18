import { Module } from '@nestjs/common';
import { ComicController } from './comic.controller';

@Module({
  controllers: [ComicController]
})
export class ComicModule {}
