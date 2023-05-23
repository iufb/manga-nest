import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type ChapterDocument = HydratedDocument<ChapterModel>;
@Schema({ timestamps: true, id: true })
export class ChapterModel {
  @Prop()
  comicId: Types.ObjectId;

  @Prop()
  chapterNumber: number;

  @Prop()
  pages: string[];
}

export const ChapterSchema = SchemaFactory.createForClass(ChapterModel);
