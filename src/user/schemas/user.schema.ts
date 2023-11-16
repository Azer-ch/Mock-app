import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.ObjectId;

  @Prop({
    type: String,
  })
  name: string;
  @Prop({
    type: 'Number',
  })
  age: number;
  @Prop({
    type: String,
  })
  email: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
