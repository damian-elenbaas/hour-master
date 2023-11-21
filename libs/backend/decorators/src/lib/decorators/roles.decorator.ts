
import { UserRole } from "@hour-master/shared/api";
import { Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<UserRole[]>();
