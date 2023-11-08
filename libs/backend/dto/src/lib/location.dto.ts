import {
  ICreateLocation,
  IUpsertLocation,
  IUpdateLocation,
  Id
} from "@hour-master/shared/api";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateLocationDto implements ICreateLocation {
  @IsNotEmpty()
  @IsString()
  adres!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  postalCode!: string;
}

export class UpsertLocationDto implements IUpsertLocation {
  @IsNotEmpty()
  @IsString()
  id!: Id;

  @IsNotEmpty()
  @IsString()
  adres!: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  postalCode!: string;
}

export class UpdateLocationDto implements IUpdateLocation {
  @IsOptional()
  @IsString()
  adres!: string;

  @IsOptional()
  @IsString()
  city!: string;

  @IsOptional()
  @IsString()
  postalCode!: string;
}
