import { ICreateUser, UserRole } from "@hour-master/shared/api";
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { StrongPasswordOptions } from "./password-options";

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
  @IsEnum(UserRole)
  role!: UserRole;
}
