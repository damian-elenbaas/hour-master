import { Id } from './id.type';
import { IUser } from './user.interface';
import { IMachine } from './machine.interface';
import { IProject } from './project.interface';

export interface IHourScheme {
  _id: Id;
  date: Date;
  worker: IUser;
  rows?: IHourSchemeRow[];
  totalHours?: number;
}

export interface IHourSchemeRow {
  _id: Id;
  project: IProject;
  hours: number;
  description: string;
  machine?: IMachine;
}

export type ICreateHourScheme = Pick<IHourScheme, 'date' | 'worker' | 'rows'>;

export type IUpdateHourScheme = Partial<Omit<IHourScheme, '_id'>>;
export type IUpsertHourScheme = IHourScheme;
export type IAddHourSchemeRow = IHourSchemeRow;
