import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type AuthDocument = HydratedDocument<UserModel>;
@Schema({ timestamps: true })
export class UserModel {
  @Prop({ unique: true })
  email: string;

  @Prop()
  name?: string;

  @Prop()
  role?: string;

  @Prop()
  avatar?: string;

  @Prop({ type: [String], default: undefined })
  readingComics?: string[];
}
export const UserSchema = SchemaFactory.createForClass(UserModel);
