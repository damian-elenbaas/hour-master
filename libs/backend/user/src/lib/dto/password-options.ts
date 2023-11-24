import { IsStrongPasswordOptions } from 'class-validator';

export const StrongPasswordOptions: IsStrongPasswordOptions = {
  // TODO: change to better values
  minLength: 4,
  minNumbers: 0,
  minSymbols: 0,
  minLowercase: 0,
  minUppercase: 0,
};
