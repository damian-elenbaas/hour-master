import {
  ICreateUser,
  IUpdateUser,
  IUpsertUser,
  UserRole
} from "@hour-master/shared/api";

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword
} from "class-validator";

export class CreateUserDto implements ICreateUser {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  firstname!: string;

  @IsNotEmpty()
  @IsString()
  lastname!: string;

  @IsNotEmpty()
  role!: UserRole;
}

export class UpsertUserDto implements IUpsertUser {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  firstname!: string;

  @IsNotEmpty()
  @IsString()
  lastname!: string;

  @IsNotEmpty()
  role!: UserRole;
}

export class UpdateUserDto implements IUpdateUser {
  @IsOptional()
  @IsString()
  username!: string;

  @IsOptional()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password!: string;

  @IsOptional()
  @IsString()
  firstname!: string;

  @IsOptional()
  @IsString()
  lastname!: string;

  @IsOptional()
  role!: UserRole;
}

