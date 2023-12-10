import { Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";
import { IHourScheme, IHourSchemeRow, IMachine, IProject, IUser, Id } from '@hour-master/shared/api';

interface CreateHourSchemeCypherParams {
  id: string,
  projectId: string,
  hours: number,
  description: string,
  machineId?: string,
}

@Injectable()
export class RecommendationsService {
  private readonly logger: Logger = new Logger(RecommendationsService.name);

  constructor(
    private readonly neo4jService: Neo4jService
  ) { }

  async deleteAndDetachAll() {
    this.logger.log(`Deleting and detaching all`);

    const result = await this.neo4jService.write(`
      MATCH (n)
      DETACH DELETE n
    `);

    return result;
  }

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
      OPTIONAL MATCH (u)-[:WORKED_ON]->(hs:HourScheme)-[:HAS_DONE]-(w:Work)
      OPTIONAL MATCH (u)-[:CONTROLS_PROJECT]->(p:Project)
      OPTIONAL MATCH (p)<-[:ON_PROJECT]-(w2:Work)
      DETACH DELETE u, hs, w, w2, p
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
      MATCH (p)<-[:ON_PROJECT]-(w:Work)-[:HAS_DONE]-(hs:HourScheme)
      DETACH DELETE p, w
      WITH hs
      WHERE NOT (hs)-[:HAS_DONE]->()
      DETACH DELETE hs
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
      let cypher = `
        CREATE (work: Work {
          description: $description,
          hours: $hours
        })
        WITH work
        MATCH (hs:HourScheme {_id: $id})
        MATCH (p:Project {_id: $projectId})
        MERGE (hs)-[:HAS_DONE]-(work)-[:ON_PROJECT]->(p)
      `;

      let params: CreateHourSchemeCypherParams = {
        id: hourScheme._id.toString(),
        projectId: row.project._id.toString(),
        hours: row.hours,
        description: row.description,
      }

      if (row.machine) {
        cypher += `
          WITH work
          MATCH (m:Machine {_id: $machineId})
          MERGE (work)-[:WITH_MACHINE]->(m)
        `;

        params = {
          ...params,
          machineId: row.machine._id.toString(),
        }
      }

      await this.neo4jService.write(cypher, params);
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
      MATCH ((hs:HourScheme {_id: $id})-[:HAS_DONE]-(work:Work))
      DETACH DELETE hs, work
    `, {
      id
    });

    return result;
  }

  async deleteHourSchemes(ids: Id[]) {
    this.logger.log(`Deleting hour schemes`);

    const result = await this.neo4jService.write(`
      MATCH ((hs:HourScheme)-[:HAS_DONE]-(work:Work))
      WHERE hs._id IN $ids
      DETACH DELETE hs, work
    `, {
      ids
    });

    return result;
  }

  async getAllWorkersFromProject(projectId: Id) {
    this.logger.log(`Getting all workers from project`);

    const result = await this.neo4jService.read(`
      MATCH ((p:Project {_id: $id})<-[:ON_PROJECT]-(work)-[:HAS_DONE]-(hs:HourScheme)<-[:WORKED_ON]-(u:User))
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
      MATCH ((p:Project {_id: $id})<-[:ON_PROJECT]-(work:Work))
      RETURN sum(work.hours) AS totalHours
    `, {
      id: projectId
    });

    return result.records[0].get('totalHours');
  }

  async getAllUsedMachinesFromProject(projectId: Id) {
    this.logger.log(`Getting all used machines from project`);

    const result = await this.neo4jService.read(`
      MATCH ((p:Project {_id: $id})<-[:ON_PROJECT]-(work:Work)-[:WITH_MACHINE]->(m:Machine))
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
      MATCH ((p:Project)<-[:ON_PROJECT]-(work:Work))
      RETURN p, sum(work.hours) AS totalHours
      ORDER BY totalHours DESC
      LIMIT 1
    `);

    return result.records[0].get('p').properties as IProject;
  }

  async getHourSchemeRowsRelatedToProject(projectId: Id) {
    this.logger.log(`Getting hour scheme rows related to project`);

    const result = await this.neo4jService.read(`
      MATCH ((:Project {_id: $id})<-[:ON_PROJECT]-(work:Work))
      OPTIONAL MATCH ((work)-[:WITH_MACHINE]->(m:Machine))
      RETURN work, m
    `, {
      id: projectId
    });

    const rows: IHourSchemeRow[] = [];
    result.records.forEach((record) => {
      const row = record.get('work').properties as IHourSchemeRow;
      const machine = record.get('m')
      if(machine) {
        row.machine = machine.properties as IMachine;
      }
      rows.push(row);
    });

    return rows;
  }

  async getTotalHoursOnMachine(machineId: Id) {
    this.logger.log(`Getting total hours on machine`);

    const result = await this.neo4jService.read(`
      MATCH ((m:Machine {_id: $id})<-[:WITH_MACHINE]-(work:Work))
      RETURN sum(work.hours) AS totalHours
    `, {
      id: machineId
    });

    return result.records[0].get('totalHours');
  }

  async getRelatedWorkersFromMachine(machineId: Id) {
    this.logger.log(`Getting related workers from machine`);

    const result = await this.neo4jService.read(`
      MATCH (u:User)-[:WORKED_ON]->(hs:HourScheme)-[:HAS_DONE]-(work:Work)-[:WITH_MACHINE]->(m:Machine {_id: $id})
      RETURN DISTINCT u
    `, {
      id: machineId
    });

    const workers: IUser[] = [];
    result.records.forEach((record) => {
      workers.push(record.get('u').properties as IUser);
    });

    return workers;
  }

  async getRelatedProjectsFromMachine(machineId: Id) {
    this.logger.log(`Getting related projects from machine`);

    const result = await this.neo4jService.read(`
      MATCH (p:Project)<-[:ON_PROJECT]-(work:Work)-[:WITH_MACHINE]->(m:Machine {_id: $id})
      RETURN DISTINCT p
    `, {
      id: machineId
    });

    const projects: IProject[] = [];
    result.records.forEach((record) => {
      projects.push(record.get('p').properties as IProject);
    });

    return projects;
  }

  async getHourSchemeRowsRelatedToMachine(machineId: Id) {
    this.logger.log(`Getting hour scheme rows related to machine`);

    const result = await this.neo4jService.read(`
      MATCH ((:Machine {_id: $id})<-[:WITH_MACHINE]-(work:Work)-[:ON_PROJECT]->(p:Project))
      RETURN work, p
    `, {
      id: machineId
    });

    const rows: IHourSchemeRow[] = [];
    result.records.forEach((record) => {
      const row = record.get('work').properties as IHourSchemeRow;
      const p = record.get('p').properties;
      const project = {
        location: {
          address: p.address as string,
          city: p.city as string,
          postalCode: p.postalCode as string,
        },
        name: p.name as string,
        _id: p._id as string,
      } as IProject;

      row.project = project;
      rows.push(row);
    });

    return rows;
  }

  async getRelatedWorkersFromWorker(userId: Id) {
    this.logger.log(`Getting related workers from worker`);

    const result = await this.neo4jService.read(`
      MATCH (u:User {_id: $id})-[:WORKED_ON]->(hs:HourScheme)-[:HAS_DONE]-(work:Work)
      -[:ON_PROJECT]->(p:Project)<-[:ON_PROJECT]-
      (:Work)-[:HAS_DONE]-(:HourScheme)-[:WORKED_ON]-(u2:User)
      WHERE u2._id <> u._id
      RETURN DISTINCT u2
    `, {
      id: userId
    });

    return result.records.map((record) => {
      return record.get('u2').properties as IUser;
    });
  }

  // TODO: Make this work properly
  async getNDepthRelatedWorkersFromWorker(userId: Id, depth: number) {
    // Get related workers that worked on the same project
    this.logger.log(`Getting ${depth} depth related workers from worker`);

    const result = await this.neo4jService.read(`
      MATCH (u:User {_id: $id})-[:WORKED_ON]->(hs:HourScheme)-[:HAS_DONE]-(work:Work)
      -[:ON_PROJECT]->(p:Project)<-[:ON_PROJECT]-
      (:Work)-[:HAS_DONE]-(:HourScheme)-[:WORKED_ON]-(u2:User)
      WHERE u2._id <> u._id
      RETURN DISTINCT u2
    `, {
      id: userId
    });

    const relatedWorkers: IUser[] = [];
    result.records.forEach((record) => {
      relatedWorkers.push(record.get('u2').properties as IUser);
    });

    if (depth > 1) {
      relatedWorkers.forEach(async (worker) => {
        this.logger.log(`Getting depth ${depth - 1} in ${worker.username}`)
        const relatedWorkers2 = await this.getNDepthRelatedWorkersFromWorker(worker._id, depth - 1);
        relatedWorkers.push(...relatedWorkers2);
      })
    }

    return relatedWorkers;
  }

  async getRelatedProjectsFromWorker(userId: Id) {
    this.logger.log(`Getting related projects from worker`);

    const result = await this.neo4jService.read(`
      MATCH (u:User {_id: $id})-[:WORKED_ON]->(hs:HourScheme)-[:HAS_DONE]-(work:Work)-[:ON_PROJECT]->(p:Project)
      RETURN DISTINCT p
    `, {
      id: userId
    });

    const projects: IProject[] = [];
    result.records.forEach((record) => {
      projects.push(record.get('p').properties as IProject);
    });

    return projects;
  }

  async getRelatedMachinesFromWorker(userId: Id) {
    this.logger.log(`Getting related machines from worker`);

    const result = await this.neo4jService.read(`
      MATCH (u:User {_id: $id})-[:WORKED_ON]->(hs:HourScheme)-[:HAS_DONE]-(work:Work)-[:WITH_MACHINE]->(m:Machine)
      RETURN DISTINCT m
    `, {
      id: userId
    });

    const machines: IMachine[] = [];
    result.records.forEach((record) => {
      machines.push(record.get('m').properties as IMachine);
    });

    return machines;
  }
}
