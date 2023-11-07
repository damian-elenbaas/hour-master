import { Id } from "./id.type";

export interface ILocation {
  id: Id;
  adres: string;
  city: string;
  postalCode: string;
}

export type ICreateLocation = Pick<
  ILocation,
  'adres' | 'city' | 'postalCode'
>;

export type IUpdateLocation = Partial<Omit<ILocation, 'id'>>;
export type IUpsertLocation = ILocation;
