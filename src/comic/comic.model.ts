import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TypeArray } from './comic.constants';
export type ComicDocument = HydratedDocument<ComicModel>;
@Schema({ timestamps: true, id: true })
export class ComicModel {
  @Prop()
  imgCover: string;

  @Prop()
  title: string;

  @Prop({ unique: true })
  alternativeTitle: string;

  @Prop()
  description: string;

  @Prop({ type: TypeArray })
  type: string;

  @Prop([String])
  genres: string[];
}

export const ComicSchema = SchemaFactory.createForClass(ComicModel);
