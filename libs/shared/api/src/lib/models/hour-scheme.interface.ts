import { IHourSchemeRow } from "./hour-scheme-row.interface";
import { Id } from "./id.type";
import { IUser } from "./user.interface";

export interface IHourScheme {
  id: Id;
  date: Date;
  worker: IUser;
  rows?: IHourSchemeRow[];
}

export type ICreateHourScheme = Pick<
  IHourScheme,
  'date' | 'worker' | 'rows'
>;

export type IUpdateHourScheme = Partial<Omit<IHourScheme, 'id'>>;
export type IUpsertHourScheme = IHourScheme;