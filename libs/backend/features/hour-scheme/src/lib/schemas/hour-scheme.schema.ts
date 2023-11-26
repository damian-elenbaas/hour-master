import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { IHourScheme } from '@hour-master/shared/api';
import mongoose, { HydratedDocument } from 'mongoose';
import { HourSchemeRow } from './hour-scheme-row.schema';
import { User } from '@hour-master/backend/user';
import { IsMongoId } from 'class-validator';

export type HourSchemeDocument = HydratedDocument<HourScheme>;

@Schema()
export class HourScheme implements IHourScheme {
  @IsMongoId()
  _id!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  worker!: User;

  @Prop({ required: true, type: [HourSchemeRow] })
  rows?: HourSchemeRow[] | undefined;
}

export const HourSchemeSchema = SchemaFactory.createForClass(HourScheme);
