import { IHourSchemeRow, IMachine, IProject } from "@hour-master/shared/api";
import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";

export class HourSchemaRow implements IHourSchemeRow {

  @IsMongoId()
  id!: string;

  @Prop({ required: true, type: String, ref: 'Project' })
  project!: IProject;

  @Prop({ required: true, type: Number })
  hours!: number;

  @Prop({ required: true, type: String })
  description!: string;

  @Prop({ required: true, type: String, ref: 'Machine' })
  machine?: IMachine | undefined;

  static scheme = SchemaFactory.createForClass(HourSchemaRow);

}
