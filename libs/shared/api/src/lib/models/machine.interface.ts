import { Id } from './id.type';

export interface IMachine {
  _id: Id;
  typeNumber: string;
  name: string;
}

export type ICreateMachine = Pick<IMachine, 'typeNumber' | 'name'>;

export type IUpdateMachine = Partial<Omit<IMachine, '_id'>>;
export type IUpsertMachine = IMachine;
