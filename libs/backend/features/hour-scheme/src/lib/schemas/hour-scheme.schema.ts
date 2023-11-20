import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

import { IHourScheme, IHourSchemeRow, IUser } from "@hour-master/shared/api";
import mongoose, { HydratedDocument } from "mongoose";
import { HourSchemaRow } from "./hour-scheme-row.schema";

export type HourSchemeDocument = HydratedDocument<HourScheme>;

@Schema()
export class HourScheme implements IHourScheme {

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId })
  _id!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  worker!: IUser;

  @Prop({ required: false, type: HourSchemaRow.scheme, ref: 'HourSchemeRow' })
  rows?: IHourSchemeRow[] | undefined;

  static schema = SchemaFactory.createForClass(HourScheme);
}
