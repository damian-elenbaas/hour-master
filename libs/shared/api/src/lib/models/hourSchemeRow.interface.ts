import { Id } from "./id.type";
import { IMachine } from "./machine.interface";
import { IProject } from "./project.interface";

export interface IHourSchemeRow {
  id: Id;
  project: IProject;
  hours: number;
  description: string;
  machine?: IMachine;
}

export type ICreateHourSchemeRow = Pick<
  IHourSchemeRow,
  'project' | 'hours' | 'description' | 'machine'
>;

export type IUpdateHourSchemeRow = Partial<Omit<IHourSchemeRow, 'id'>>;
export type IUpsertHourSchemeRow = IHourSchemeRow;
