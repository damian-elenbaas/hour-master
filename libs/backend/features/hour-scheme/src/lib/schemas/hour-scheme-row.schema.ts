import { Machine } from "@hour-master/backend/features/machine";
import { Project } from "@hour-master/backend/features/project";
import { IHourSchemeRow, Id } from "@hour-master/shared/api";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";
import { HydratedDocument, SchemaTypes } from "mongoose";

export type HourSchemaRowDocument = HydratedDocument<HourSchemeRow>;

@Schema()
export class HourSchemeRow implements IHourSchemeRow {
  @IsMongoId()
  _id!: Id;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Project' })
  project!: Project;

  @Prop({ required: true, type: Number })
  hours!: number;

  @Prop({ required: true, type: String })
  description!: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Machine' })
  machine?: Machine | undefined;
}

export const HourSchemaRowSchema = SchemaFactory.createForClass(HourSchemeRow);
