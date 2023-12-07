import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IHourScheme } from '@hour-master/shared/api';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '@hour-master/backend/user';
import { IsMongoId } from 'class-validator';
import { HourSchemeRow } from './hour-scheme-row.schema';


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

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
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
