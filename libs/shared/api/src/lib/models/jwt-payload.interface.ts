import { Id } from "./id.type";

export interface IJWTPayload {
  sub: Id;
  username: string;
}
