import { Id } from './id.type';

export interface ILocation {
  _id: Id;
  address: string;
  city: string;
  postalCode: string;
}

export type ICreateLocation = Pick<
  ILocation,
  'address' | 'city' | 'postalCode'
>;

export type IUpdateLocation = Partial<Omit<ILocation, '_id'>>;
export type IUpsertLocation = ILocation;
