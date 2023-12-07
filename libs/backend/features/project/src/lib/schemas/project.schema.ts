import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { IProject } from '@hour-master/shared/api';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '@hour-master/backend/user';
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

  @Prop({ required: true, type: mongoose.SchemaTypes.ObjectId, ref: 'User' })
  admin!: User;
}

const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.pre('findOneAndDelete', async function(next) {
  console.log('pre findOneAndDelete');
  // TODO: delete related hour schemes
  next();
});

export { ProjectSchema };
