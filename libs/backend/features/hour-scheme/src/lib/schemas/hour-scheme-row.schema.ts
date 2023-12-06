import { IHourSchemeRow, IMachine, IProject } from '@hour-master/shared/api';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsMongoId } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type HourSchemaRowDocument = HydratedDocument<HourSchemeRow>;

export class HourSchemeRow implements IHourSchemeRow {
  @IsMongoId()
  _id!: string;

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'Project' })
  project!: IProject;

  @Prop({ required: true, type: Number })
  hours!: number;

  @Prop({ required: true, type: String })
  description!: string;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'Machine' })
  machine?: IMachine;
}

export const HourSchemaRowSchema = SchemaFactory.createForClass(HourSchemeRow);
