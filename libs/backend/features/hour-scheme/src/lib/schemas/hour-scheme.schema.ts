import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { IHourScheme } from '@hour-master/shared/api';
import mongoose, { HydratedDocument } from 'mongoose';
import { HourSchemeRow } from './hour-scheme-row.schema';
import { User } from '@hour-master/backend/user';
import { IsMongoId } from 'class-validator';

export type HourSchemeDocument = HydratedDocument<HourScheme>;

@Schema({
  toJSON: {
    virtuals: true
  }
})
export class HourScheme implements IHourScheme {
  @IsMongoId()
  _id!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  worker!: User;

  @Prop({ type: [HourSchemeRow] })
  rows?: HourSchemeRow[] | undefined;

  totalHours?: number;
}

const s = SchemaFactory.createForClass(HourScheme);
s.virtual('totalHours').get(function (this: HourScheme) {
  return this.rows?.reduce((acc, curr) => acc + curr.hours, 0) ?? 0;
});

export const HourSchemeSchema = s;
