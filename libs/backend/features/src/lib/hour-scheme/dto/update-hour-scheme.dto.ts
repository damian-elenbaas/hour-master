import {
  IHourSchemeRow,
  IUpdateHourScheme,
  IUser,
} from '@hour-master/shared/api';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateHourSchemeDto implements IUpdateHourScheme {
  @IsDateString()
  @IsOptional()
  date!: Date;

  @IsOptional()
  worker!: IUser;

  @IsOptional()
  rows?: IHourSchemeRow[];
}
