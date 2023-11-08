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
  IsStrongPassword,
  IsStrongPasswordOptions
} from "class-validator";

export const StrongPasswordOptions: IsStrongPasswordOptions = {
  minLength: 8,
  minNumbers: 1,
  minSymbols: 1,
  minLowercase: 1,
  minUppercase: 1
}

export class CreateUserDto implements ICreateUser {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(StrongPasswordOptions)
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
  @IsStrongPassword(StrongPasswordOptions)
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
  @IsStrongPassword(StrongPasswordOptions)
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

