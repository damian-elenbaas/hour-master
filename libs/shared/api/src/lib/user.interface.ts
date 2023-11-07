export enum UserRole {
  OFFICE = "OFFICE",
  ROADWORKER = "ROADWORKER"
}

export interface User {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: UserRole;
}
