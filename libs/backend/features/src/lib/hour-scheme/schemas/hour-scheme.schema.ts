import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IHourScheme } from '@hour-master/shared/api';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
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

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
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
