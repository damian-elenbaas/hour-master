import { IHourSchemeRow } from "./hourSchemeRow.interface";
import { Id } from "./id.type";
import { IUser } from "./user.interface";

export interface IHourScheme {
  id: Id;
  date: Date;
  rows?: IHourSchemeRow[];
  worker: IUser;
}

export type ICreateHourScheme = Pick<
  IHourScheme,
  'date' | 'worker'
>;

export type IUpdateHourScheme = Partial<Omit<IHourScheme, 'id'>>;
export type IUpsertHourScheme = IHourScheme;
