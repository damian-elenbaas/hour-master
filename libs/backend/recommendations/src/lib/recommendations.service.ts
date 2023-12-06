import { Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";
import { IUser, Id } from '@hour-master/shared/api';

@Injectable()
export class RecommendationsService {
  private readonly logger: Logger = new Logger(RecommendationsService.name);

  constructor(
    private readonly neo4jService: Neo4jService
  ) { }

  async createOrUpdateUser(newUser: IUser) {
    this.logger.log(`Creating user`);

    const result = await this.neo4jService.write(`
      MERGE (u:User {
        mongoId: $id
      })
      on create set
        u.username = $username,
        u.firstname = $firstname,
        u.lastname = $lastname,
        u.email = $email,
        u.role = $role
      on match set
        u.username = $username,
        u.firstname = $firstname,
        u.lastname = $lastname,
        u.email = $email,
        u.role = $role
      return u
    `, {
      id: newUser._id.toString(),
      username: newUser.username.toString(),
      firstname: newUser.firstname.toString(),
      lastname: newUser.lastname.toString(),
      email: newUser.email.toString(),
      role: newUser.role.toString(),
    });

    return result;
  }

  async deleteUser(id: Id) {
    this.logger.log(`Deleting user`);

    const result = await this.neo4jService.write(`
      MATCH (u:User {mongoId: $id})
      DETACH DELETE u
    `, {
      id
    });

    return result;
  }
}
