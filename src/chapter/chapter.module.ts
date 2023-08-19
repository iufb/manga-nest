import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from './chapter.model';
import { ChapterService } from './chapter.service';
import { ComicSchema } from 'src/comic/comic.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'chapter', schema: ChapterSchema },
      { name: 'comic', schema: ComicSchema },
    ]),
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
