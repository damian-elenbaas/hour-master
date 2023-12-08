import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

import {
  ICreateHourScheme,
  IHourSchemeRow,
  IUser,
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
