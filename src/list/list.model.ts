import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { listType } from 'types';
export type ListDocument = HydratedDocument<ListModel>;
@Schema()
class LastChapter {
  chapter: number;
  page: number;
}
@Schema()
export class UserListModel {
  @Prop({ unique: true })
  userId: Types.ObjectId;

  @Prop()
  listType: listType;

  @Prop()
  lastChapter: LastChapter;
}

@Schema({ timestamps: true })
export class ListModel {
  @Prop({ unique: true })
  comic: Types.ObjectId;

  @Prop()
  users: UserListModel[];
}

export const ListSchema = SchemaFactory.createForClass(ListModel);
