import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

import { IHourScheme, IHourSchemeRow, IUser } from "@hour-master/shared/api";
import { IsMongoId } from "class-validator";
import mongoose from "mongoose";
import { HourSchemaRow } from "./hour-scheme-row.schema";

@Schema()
export class HourScheme implements IHourScheme {

  @IsMongoId()
  id!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  worker!: IUser;

  @Prop({ required: false, type: HourSchemaRow.scheme, ref: 'HourSchemeRow' })
  rows?: IHourSchemeRow[] | undefined;

  static schema = SchemaFactory.createForClass(HourScheme);
}
