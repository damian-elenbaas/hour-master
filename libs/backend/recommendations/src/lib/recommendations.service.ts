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
    this.logger.log(`Creating new user: ${JSON.stringify(newUser)}`);

    const result = await this.neo4jService.write(`
      MERGE (u:User {mongoId: $id})
      SET u += $props
    `, {
      id: newUser._id,
      props: newUser
    });

    this.logger.log(`Result of creating new user: ${JSON.stringify(result)}`);

    return result;
  }

  async deleteUser(id: Id) {
    this.logger.log(`Deleting user: ${id}`);

    const result = await this.neo4jService.write(`
      MATCH (u:User {mongoId: $id})
      DETACH DELETE u
    `, {
      id
    });

    this.logger.log(`Deleted user: ${JSON.stringify(result)}`);

    return result;
  }
}
