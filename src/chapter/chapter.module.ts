import { Module } from '@nestjs/common';
import { ChapterController } from './chapter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChapterSchema } from './chapter.model';
import { ChapterService } from './chapter.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'chapter', schema: ChapterSchema }]),
  ],
  controllers: [ChapterController],
  providers: [ChapterService],
})
export class ChapterModule {}
