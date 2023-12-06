import { Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";
import { IHourScheme, IMachine, IProject, IUser, Id } from '@hour-master/shared/api';

@Injectable()
export class RecommendationsService {
  private readonly logger: Logger = new Logger(RecommendationsService.name);

  constructor(
    private readonly neo4jService: Neo4jService
  ) { }

  async createOrUpdateUser(user: IUser) {
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
      id: user._id.toString(),
      username: user.username.toString(),
      firstname: user.firstname.toString(),
      lastname: user.lastname.toString(),
      email: user.email.toString(),
      role: user.role.toString(),
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

  async createOrUpdateProject(project: IProject) {
    this.logger.log(`Creating project`);

    const resultProject = await this.neo4jService.write(`
      MERGE (p:Project {
        mongoId: $id
      })
      on create set
        p.name = $name,
        p.address = $address,
        p.city = $city,
        p.postalCode = $postalCode
      on match set
        p.name = $name,
        p.address = $address,
        p.city = $city,
        p.postalCode = $postalCode
      return p
    `, {
      id: project._id.toString(),
      name: project.name.toString(),
      address: project.location.address.toString(),
      city: project.location.city.toString(),
      postalCode: project.location.postalCode.toString(),
    })

    if (!resultProject) {
      return null;
    }

    const resultRelation = await this.neo4jService.write(`
      MATCH (p:Project {mongoId: $id})
      MATCH (u:User {mongoId: $userId})
      MERGE (u)-[:CONTROLS_PROJECT]->(p)
    `, {
      id: project._id.toString(),
      userId: project.admin._id.toString(),
    });

    if (!resultRelation) {
      return null;
    }

    return resultProject;
  }

  async deleteProject(id: Id) {
    this.logger.log(`Deleting project`);

    const result = await this.neo4jService.write(`
      MATCH (p:Project {mongoId: $id})
      DETACH DELETE p
    `, {
      id
    });

    return result;
  }

  async createOrUpdateMachine(machine: IMachine) {
    this.logger.log(`Creating machine`);

    const result = await this.neo4jService.write(`
      MERGE (m:Machine {
        mongoId: $id
      })
      on create set
        m.typeNumber = $typeNumber,
        m.name = $name
      on match set
        m.typeNumber = $typeNumber,
        m.name = $name
      return m
    `, {
      id: machine._id.toString(),
      typeNumber: machine.typeNumber.toString(),
      name: machine.name.toString(),
    });

    return result;
  }

  async deleteMachine(id: Id) {
    this.logger.log(`Deleting machine`);

    const result = await this.neo4jService.write(`
      MATCH (m:Machine {mongoId: $id})
      DETACH DELETE m
    `, {
      id
    });

    return result;
  }

  async createOrUpdateHourScheme(hourScheme: IHourScheme) {
    this.logger.log(`Creating hour scheme`);

    const resultHS = await this.neo4jService.write(`
      MERGE (hs:HourScheme {
        mongoId: $id
      })
      on create set
        hs.date = $date
      on match set
        hs.date = $date
      return hs
    `, {
      id: hourScheme._id.toString(),
      date: hourScheme.date.toString(),
    });

    hourScheme.rows?.forEach(async (row) => {
      await this.neo4jService.write(`
        MATCH (hs:HourScheme {mongoId: $id})
        MATCH (p:Project {mongoId: $projectId})
        MERGE (hs)-[:ON_PROJECT {hours: $hours}]->(p)
        return hs
      `, {
        id: hourScheme._id.toString(),
        projectId: row.project._id.toString(),
        hours: row.hours,
      });

      if (row.machine) {
        await this.neo4jService.write(`
        MATCH (hs:HourScheme {mongoId: $id})
        MATCH (m:Machine {mongoId: $machineId})
        MERGE (hs)-[:USED_MACHINE {hours: $hours}]->(m)
        return hs
      `, {
          id: hourScheme._id.toString(),
          machineId: row.machine._id.toString(),
          hours: row.hours,
        });
      }
    });

    await this.neo4jService.write(`
      MATCH (hs:HourScheme {mongoId: $id})
      MATCH (u:User {mongoId: $userId})
      MERGE (u)-[:WORKED_ON]->(hs)
      return hs
    `, {
      id: hourScheme._id.toString(),
      userId: hourScheme.worker._id.toString(),
    });

    return resultHS;
  }

  async deleteHourScheme(id: Id) {
    this.logger.log(`Deleting hour scheme`);

    const result = await this.neo4jService.write(`
      MATCH (hs:HourScheme {mongoId: $id})
      DETACH DELETE hs
    `, {
      id
    });

    return result;
  }
}
