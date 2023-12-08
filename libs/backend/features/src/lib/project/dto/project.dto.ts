import {
  ICreateProject,
  ILocation,
  IUpdateProject,
  IUpsertProject,
  IUser,
  Id,
} from '@hour-master/shared/api';

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto implements ICreateProject {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  location!: ILocation;

  @IsNotEmpty()
  admin!: IUser;
}

export class UpsertProjectDto implements IUpsertProject {
  @IsNotEmpty()
  @IsString()
  _id!: Id;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  location!: ILocation;

  @IsNotEmpty()
  admin!: IUser;
}

export class UpdateProjectDto implements IUpdateProject {
  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  location!: ILocation;

  @IsOptional()
  admin!: IUser;
}
