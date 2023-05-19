import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type AuthDocument = HydratedDocument<AuthModel>;
@Schema({ timestamps: true })
export class AuthModel {
  @Prop()
  email: string;

  @Prop()
  passwordHash: string;
}
export const AuthSchema = SchemaFactory.createForClass(AuthModel);
