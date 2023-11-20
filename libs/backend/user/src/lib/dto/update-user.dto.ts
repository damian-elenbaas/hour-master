import { IUpdateUser, UserRole } from "@hour-master/shared/api";
import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";

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
  @IsEnum(UserRole)
  role!: UserRole;
}
