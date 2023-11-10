import { Id } from "./id.type";

export enum UserRole {
  OFFICE = "OFFICE",
  ROADWORKER = "ROADWORKER"
}

export interface IUser {
  id: Id;
  username: string;
  email: string;
  password?: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}

export type ICreateUser = Pick<
  IUser,
  'username' | 'email' | 'password' | 'firstname' | 'lastname' | 'role'
>;

export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
