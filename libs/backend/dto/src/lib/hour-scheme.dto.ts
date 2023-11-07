import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import {
  ICreateHourScheme,
  IUpsertHourScheme,
  IHourSchemeRow,
  IUser,
  Id,
  IUpdateHourScheme
} from '@hour-master/shared/api';

export class CreateHourSchemeDto implements ICreateHourScheme {
  @IsDate()
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

  @IsDate()
  @IsNotEmpty()
  date!: Date;

  @IsNotEmpty()
  worker!: IUser;

  @IsOptional()
  rows?: IHourSchemeRow[];
}

export class UpdateHourSchemeDto implements IUpdateHourScheme {
  @IsDate()
  @IsOptional()
  date!: Date;

  @IsOptional()
  worker!: IUser;

  @IsOptional()
  rows?: IHourSchemeRow[];
}
