import { Id } from "./id.type";
import { Location } from "./location.interface";
import { User } from "./user.interface";

export interface Project {
  id: Id;
  name: string;
  location: Location;
  admin: User;
}
