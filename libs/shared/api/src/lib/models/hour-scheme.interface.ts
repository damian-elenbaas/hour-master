import { IHourSchemeRow } from './hour-scheme-row.interface';
import { Id } from './id.type';
import { IUser } from './user.interface';

export interface IHourScheme {
  _id: Id;
  date: Date;
  worker: IUser;
  rows?: IHourSchemeRow[];
  totalHours?: number;
}

export type ICreateHourScheme = Pick<IHourScheme, 'date' | 'worker' | 'rows'>;

export type IUpdateHourScheme = Partial<Omit<IHourScheme, '_id'>>;
export type IUpsertHourScheme = IHourScheme;
export type IAddHourSchemeRow = IHourSchemeRow;
