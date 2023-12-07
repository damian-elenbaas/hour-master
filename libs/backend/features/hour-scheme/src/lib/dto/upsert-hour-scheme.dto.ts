import {
  IHourSchemeRow,
  IUpsertHourScheme,
  IUser,
  Id,
} from '@hour-master/shared/api';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertHourSchemeDto implements IUpsertHourScheme {
  @IsString()
  @IsNotEmpty()
  _id!: Id;

  @IsDateString()
  @IsNotEmpty()
  date!: Date;

  @IsNotEmpty()
  worker!: IUser;

  @IsOptional()
  rows?: IHourSchemeRow[];
}
