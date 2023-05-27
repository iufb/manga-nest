import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type AuthDocument = HydratedDocument<AuthModel>;
@Schema({ timestamps: true })
export class AuthModel {
  @Prop({ unique: true })
  email: string;

  @Prop()
  passwordHash: string;
}
export const AuthSchema = SchemaFactory.createForClass(AuthModel);
