import { Id } from "./id.type";
import { Machine } from "./machine.interface";
import { Project } from "./project.interface";

export interface HourSchemeRow {
  id: Id;
  project: Project;
  hours: number;
  description: string;
  machine?: Machine;
}
