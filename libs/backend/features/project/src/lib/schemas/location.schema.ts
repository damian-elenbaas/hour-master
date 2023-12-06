import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { ILocation } from '@hour-master/shared/api';
import { HydratedDocument } from 'mongoose';
import { IsMongoId } from 'class-validator';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location implements ILocation {
  @IsMongoId()
  _id!: string;

  @Prop({ required: true })
  address!: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ required: true })
  postalCode!: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
