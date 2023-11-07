import { HourSchemeRow } from "./hourSchemeRow.interface";
import { Id } from "./id.type";
import { User } from "./user.interface";

export interface HourScheme {
  id: Id;
  date: Date;
  rows?: HourSchemeRow[];
  worker: User;
}
