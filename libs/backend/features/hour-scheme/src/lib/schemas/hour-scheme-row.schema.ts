import { Machine } from "@hour-master/backend/features/machine";
import { Project } from "@hour-master/backend/features/project";
import { IHourSchemeRow } from "@hour-master/shared/api";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type HourSchemaRowDocument = HydratedDocument<HourSchemeRow>;

@Schema()
export class HourSchemeRow implements IHourSchemeRow {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Project' })
  project!: Project;

  @Prop({ required: true, type: Number })
  hours!: number;

  @Prop({ required: true, type: String })
  description!: string;

  @Prop({ type: Types.ObjectId, ref: 'Machine' })
  machine?: Machine | undefined;
}

export const HourSchemaRowSchema = SchemaFactory.createForClass(HourSchemeRow);
