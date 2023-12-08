import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { IMachine } from '@hour-master/shared/api';
import { HydratedDocument } from 'mongoose';
import { IsMongoId } from 'class-validator';

export type MachineDocument = HydratedDocument<Machine>;

@Schema()
export class Machine implements IMachine {
  @IsMongoId()
  _id!: string;

  @Prop({ required: true, type: String })
  typeNumber!: string;

  @Prop({ required: true, type: String })
  name!: string;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
