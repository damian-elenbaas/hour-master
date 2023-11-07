import { Id } from "./id.type";

export interface IMachine {
  id: Id;
  typeNumber: string;
  name: string;
}

export type ICreateMachine = Pick<
  IMachine,
  'typeNumber' | 'name'
>;

export type IUpdateMachine = Partial<Omit<IMachine, 'id'>>;
export type IUpsertMachine = IMachine;
