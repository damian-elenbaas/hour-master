import {
  ICreateHourSchemeRow,
  IUpsertHourSchemeRow,
  IUpdateHourSchemeRow,
  IMachine,
  IProject,
  Id,
} from '@hour-master/shared/api';

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateHourSchemeRowDto implements ICreateHourSchemeRow {
  @IsNotEmpty()
  project!: IProject;

  @IsNotEmpty()
  @IsNumber()
  hours!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsOptional()
  machine?: IMachine;
}

export class UpsertHourSchemeRowDto implements IUpsertHourSchemeRow {
  @IsNotEmpty()
  id!: Id;

  @IsNotEmpty()
  project!: IProject;

  @IsNotEmpty()
  @IsNumber()
  hours!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsOptional()
  machine?: IMachine;
}

export class UpdateHourSchemeRowDto implements IUpdateHourSchemeRow {
  @IsOptional()
  @IsNumber()
  hours!: number;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  machine?: IMachine;
}
