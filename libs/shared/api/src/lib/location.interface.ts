import { Id } from "./id.type";

export interface Location {
  id: Id;
  adres: string;
  city: string;
  postalCode: string;
}
