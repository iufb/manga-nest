import { Module } from '@nestjs/common';
import { ComicController } from './comic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComicSchema } from './comic.model';
import { ComicService } from './comic.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'comic', schema: ComicSchema }]),
  ],
  controllers: [ComicController],
  providers: [ComicService],
})
export class ComicModule {}
