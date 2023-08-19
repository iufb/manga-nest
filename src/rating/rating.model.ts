import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type ListDocument = HydratedDocument<RatingModel>;

@Schema()
export class RatingModel {
  @Prop()
  comicId: Types.ObjectId;

  @Prop({ unique: true })
  userId: Types.ObjectId;

  @Prop()
  rate: number;
}

export const RatingSchema = SchemaFactory.createForClass(RatingModel);
