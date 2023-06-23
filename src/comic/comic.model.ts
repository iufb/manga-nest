import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ComicDocument = HydratedDocument<ComicModel>;
@Schema({ timestamps: true, id: true })
export class ComicModel {
  @Prop()
  comicCover: string;

  @Prop()
  comicBg: string;

  @Prop()
  title: string;

  @Prop({ unique: true })
  alternativeTitle: string;

  @Prop()
  description: string;

  @Prop()
  type: string;

  @Prop([String])
  genres: string[];

  @Prop()
  status: string;

  @Prop()
  translateStatus: string;

  @Prop()
  author: string;

  @Prop()
  artist: string;

  @Prop()
  publishingCompany: string;
}

export const ComicSchema = SchemaFactory.createForClass(ComicModel);
ComicSchema.index({
  title: 'text',
  alternativeTitle: 'text',
  description: 'text',
});
