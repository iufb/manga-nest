import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type ListDocument = HydratedDocument<CommentModel>;
@Schema()
class VotedUser {
  userId: string;
  liked: boolean;
}
@Schema()
class CommentFor {
  @Prop()
  comicId: Types.ObjectId;

  @Prop()
  chapterNumber?: number;

  @Prop()
  page?: number;
}
@Schema({ id: true, timestamps: true })
export class CommentModel {
  @Prop()
  userId: Types.ObjectId;

  @Prop()
  comment: string;

  @Prop()
  type: 'comic' | 'page';

  @Prop()
  commentFor: CommentFor;

  @Prop()
  votedUsers: VotedUser[];

  @Prop()
  commentLevel: number;

  @Prop()
  parentComment: string;

  @Prop()
  rootId: string;

  @Prop()
  votesUp: number;

  @Prop()
  votesDown: number;

  @Prop()
  sticky?: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(CommentModel);
