import { Id } from "./id.type";

export interface IEntity {
  _id: Id;
  createdAt?: Date;
  updatedAt?: Date;
}
