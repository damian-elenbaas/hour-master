import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { IProject } from '@hour-master/shared/api';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { IsMongoId } from 'class-validator';
import { Location } from './location.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project implements IProject {
  @IsMongoId()
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, type: Location })
  location!: Location;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'User' })
  admin!: User;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
