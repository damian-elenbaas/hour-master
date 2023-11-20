import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser, UserRole } from '@hour-master/shared/api';
import { IsMongoId } from 'class-validator';

@Schema()
export class User implements IUser {

  @IsMongoId()
  id!: string;

  @Prop({ required: true, unique: true })
  username!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  password?: string | undefined;

  @Prop({ required: true })
  firstname!: string;

  @Prop({ required: true })
  lastname!: string;

  @Prop({ required: true, type: String, enum: UserRole })
  role!: UserRole;

  static schema = SchemaFactory.createForClass(User);
}
