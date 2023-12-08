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
        _id: $id
      })
      ON CREATE SET
        u.username = $username,
        u.firstname = $firstname,
        u.lastname = $lastname,
        u.email = $email,
        u.role = $role
      ON MATCH SET
        u.username = $username,
        u.firstname = $firstname,
        u.lastname = $lastname,
        u.email = $email,
        u.role = $role
      RETURN u
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
      MATCH (u:User {_id: $id})
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
        _id: $id
      })
      ON CREATE SET
        p.name = $name,
        p.address = $address,
        p.city = $city,
        p.postalCode = $postalCode
      ON MATCH SET
        p.name = $name,
        p.address = $address,
        p.city = $city,
        p.postalCode = $postalCode
      RETURN p
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
      MATCH (p:Project {_id: $id})
      MATCH (u:User {_id: $userId})
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
      MATCH (p:Project {_id: $id})
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
        _id: $id
      })
      ON CREATE SET
        m.typeNumber = $typeNumber,
        m.name = $name
      ON MATCH SET
        m.typeNumber = $typeNumber,
        m.name = $name
      RETURN m
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
      MATCH (m:Machine {_id: $id})
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
        _id: $id
      })
      ON CREATE SET
        hs.date = $date
      ON MATCH SET
        hs.date = $date
      RETURN hs
    `, {
      id: hourScheme._id.toString(),
      date: hourScheme.date.toISOString(),
    });

    hourScheme.rows?.forEach(async (row) => {
      await this.neo4jService.write(`
        MATCH (hs:HourScheme {_id: $id})
        MATCH (p:Project {_id: $projectId})
        MERGE (hs)-[:ON_PROJECT {hours: $hours, description: $description}]->(p)
        RETURN hs
      `, {
        id: hourScheme._id.toString(),
        projectId: row.project._id.toString(),
        hours: row.hours,
        description: row.description,
      });

      if (row.machine) {
        await this.neo4jService.write(`
        MATCH (hs:HourScheme {_id: $id})
        MATCH (m:Machine {_id: $machineId})
        MERGE (hs)-[:USED_MACHINE {hours: $hours, description: $description}]->(m)
        RETURN hs
      `, {
          id: hourScheme._id.toString(),
          machineId: row.machine._id.toString(),
          hours: row.hours,
          description: row.description,
        });
      }
    });

    await this.neo4jService.write(`
      MATCH (hs:HourScheme {_id: $id})
      MATCH (u:User {_id: $userId})
      MERGE (u)-[:WORKED_ON]->(hs)
      RETURN hs
    `, {
      id: hourScheme._id.toString(),
      userId: hourScheme.worker._id.toString(),
    });

    return resultHS;
  }

  async deleteHourScheme(id: Id) {
    this.logger.log(`Deleting hour scheme`);

    const result = await this.neo4jService.write(`
      MATCH (hs:HourScheme {_id: $id})
      DETACH DELETE hs
    `, {
      id
    });

    return result;
  }

  async deleteHourSchemes(ids: Id[]) {
    this.logger.log(`Deleting hour schemes`);

    const result = await this.neo4jService.write(`
      MATCH (hs:HourScheme)
      WHERE hs._id IN $ids
      DETACH DELETE hs
    `, {
      ids
    });

    return result;
  }

  async getAllWorkersFromProject(projectId: Id) {
    this.logger.log(`Getting all workers from project`);

    const result = await this.neo4jService.read(`
      MATCH ((p:Project {_id: $id})<-[:ON_PROJECT]-(hs:HourScheme)<-[:WORKED_ON]-(u:User))
      RETURN DISTINCT u
    `, {
      id: projectId
    });

    const workers: IUser[] = [];
    result.records.forEach((record) => {
      workers.push(record.get('u').properties as IUser);
    });

    return workers;
  }

  async getTotalHoursOnProject(projectId: Id) {
    this.logger.log(`Getting total hours on project`);

    const result = await this.neo4jService.read(`
      MATCH ((p:Project {_id: $id})<-[r:ON_PROJECT]-(hs:HourScheme))
      RETURN sum(r.hours) AS totalHours
    `, {
      id: projectId
    });

    return result.records[0].get('totalHours');
  }

  async getAllUsedMachinesFromProject(projectId: Id) {
    this.logger.log(`Getting all used machines from project`);

    const result = await this.neo4jService.read(`
      MATCH ((p:Project {_id: $id})<-[:ON_PROJECT]-(hs:HourScheme)-[:USED_MACHINE]->(m:Machine))
      RETURN DISTINCT m
    `, {
      id: projectId
    });

    const machines: IMachine[] = [];
    result.records.forEach((record) => {
      machines.push(record.get('m').properties as IMachine);
    });

    return machines;
  }

  async getMostWorkedOnProject() {
    this.logger.log(`Getting most worked on project`);

    const result = await this.neo4jService.read(`
      MATCH ((p:Project)<-[r:ON_PROJECT]-(hs:HourScheme))
      RETURN p, sum(r.hours) AS totalHours
      ORDER BY totalHours DESC
      LIMIT 1
    `);

    return result.records[0].get('p').properties as IProject;
  }
}
