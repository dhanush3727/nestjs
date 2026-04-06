// This is the user schema file, in express we create user.model.ts but in nestjs we create user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose'; // This is the type of the document that we will be working with

// This is the user schema, it defines the structure of the user document in the database
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  userName!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    index: true,
  })
  email!: string;

  @Prop({ required: true, minLength: 6, select: false })
  password!: string;

  @Prop({ default: '' })
  imgID!: string;

  @Prop({ default: '' })
  imgURL!: string;

  @Prop({ default: '', select: false })
  otp!: string;

  @Prop({ select: false })
  otpExpiresAt!: Date;

  @Prop({ default: '', select: false })
  tempToken!: string;

  @Prop({ select: false })
  tempTokenExpires!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
