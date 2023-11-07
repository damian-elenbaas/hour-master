import {
  IsNotEmpty,
  IsString,
  IsOptional
} from 'class-validator';

import {
  ICreateMachine,
  IUpsertMachine,
  IUpdateMachine
} from '@hour-master/shared/api';

export class CreateMachineDto implements ICreateMachine {
  @IsString()
  @IsNotEmpty()
  typeNumber!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpsertMachineDto implements IUpsertMachine {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  typeNumber!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateMachineDto implements IUpdateMachine {
  @IsString()
  @IsOptional()
  typeNumber!: string;

  @IsString()
  @IsOptional()
  name!: string;
}
