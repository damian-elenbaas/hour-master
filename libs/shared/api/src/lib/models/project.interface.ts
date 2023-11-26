import { Id } from './id.type';
import { ILocation } from './location.interface';
import { IUser } from './user.interface';

export interface IProject {
  _id: Id;
  name: string;
  location: ILocation;
  admin: IUser;
}

export type ICreateProject = Pick<IProject, 'name' | 'location' | 'admin'>;

export type IUpdateProject = Partial<Omit<IProject, '_id'>>;
export type IUpsertProject = IProject;
