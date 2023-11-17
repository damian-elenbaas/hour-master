import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import {
  ICreateHourScheme,
  IUpsertHourScheme,
  IHourSchemeRow,
  IUser,
  Id,
  IUpdateHourScheme
} from '@hour-master/shared/api';

export class CreateHourSchemeDto implements ICreateHourScheme {
  @IsDateString()
  @IsNotEmpty()
  date!: Date;

  @IsNotEmpty()
  worker!: IUser;

  @IsOptional()
  rows?: IHourSchemeRow[];
}

export class UpsertHourSchemeDto implements IUpsertHourScheme {
  @IsString()
  @IsNotEmpty()
  id!: Id;

  @IsDateString()
  @IsNotEmpty()
  date!: Date;

  @IsNotEmpty()
  worker!: IUser;

  @IsOptional()
  rows?: IHourSchemeRow[];
}

export class UpdateHourSchemeDto implements IUpdateHourScheme {
  @IsDateString()
  @IsOptional()
  date!: Date;

  @IsOptional()
  worker!: IUser;

  @IsOptional()
  rows?: IHourSchemeRow[];
}
