import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';

import { HourScheme } from '@hour-master/backend/features';
import { Project } from '@hour-master/backend/features';
import { User } from '@hour-master/backend/user';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IHourScheme, IHourSchemeRow, IMachine, IProject, IUser, UserRole } from '@hour-master/shared/api';
import { Machine } from '@hour-master/backend/features';
import { faker } from '@faker-js/faker';
import { RecommendationsService } from '@hour-master/backend/recommendations';
import { users, projects, machines, hourSchemes } from './data';

@Injectable()
export class DataSeederService {
  private readonly logger = new Logger(DataSeederService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(HourScheme.name)
    private readonly hourSchemeModel: Model<HourScheme>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(Machine.name)
    private readonly machineModel: Model<Machine>,

    private readonly rcmdService: RecommendationsService
  ) {
    this.seedRealisticData();
    // this.seedFakerData();
  }

  async seedRealisticData(): Promise<void> {
    this.logger.log(`seedRealisticData()`);

    let currentUsers = await this.userModel.find().exec();
    let currentProjects = await this.projectModel.find().exec();
    let currentMachines = await this.machineModel.find().exec();
    const currentHourSchemes = await this.hourSchemeModel.find().exec();

    if (
      currentUsers.length >= users.length &&
      currentProjects.length >= projects.length &&
      currentMachines.length >= machines.length &&
      currentHourSchemes.length >= hourSchemes.length
    ) {
      this.logger.log(`Data already seeded, skipping...`);
      return;
    }

    this.logger.log(`Deleting all data...`);
    await this.userModel.deleteMany({}).exec();
    await this.projectModel.deleteMany({}).exec();
    await this.machineModel.deleteMany({}).exec();
    await this.hourSchemeModel.deleteMany({}).exec();
    await this.rcmdService.deleteAndDetachAll();

    this.logger.log(`Creating users...`);
    for(let i = 0; i < users.length; i++) {
      const user = users[i];
      user.password = await this.generateHashedPassword(user.password ?? 'password');
      const userMongo = new this.userModel(user);
      await userMongo.save();
      await this.rcmdService.createOrUpdateUser(userMongo);
    }

    currentUsers = await this.userModel.find().exec();

    this.logger.log(`Creating projects...`);
    for(let i = 0; i < projects.length; i++) {
      const project = projects[i];
      project.admin = currentUsers.find(u => u.username === project.admin.username) as IUser;
      project.location._id = new Types.ObjectId();
      const projectMongo = new this.projectModel(project);
      await projectMongo.save();
      await this.rcmdService.createOrUpdateProject(projectMongo);
    }

    currentProjects = await this.projectModel.find().exec();

    this.logger.log(`Creating machines...`);
    for(let i = 0; i < machines.length; i++) {
      const machine = machines[i];
      const machineMongo = new this.machineModel(machine);
      await machineMongo.save();
      await this.rcmdService.createOrUpdateMachine(machineMongo);
    }

    currentMachines = await this.machineModel.find().exec();

    this.logger.log(`Creating hourSchemes...`);
    for(let i = 0; i < hourSchemes.length; i++) {
      const hourScheme = hourSchemes[i];
      hourScheme.worker = currentUsers.find(u => u.username === hourScheme.worker.username) as IUser;
      hourScheme.rows?.forEach(row => {
        row._id = new Types.ObjectId();
        if (row.project) {
          row.project = currentProjects.find(p => p.name === row.project?.name) as IProject;
        }
        if (row.machine) {
          row.machine = currentMachines.find(m => m.typeNumber === row.machine?.typeNumber) as IMachine;
        }
      })
      const hourSchemeMongo = new this.hourSchemeModel(hourScheme);
      await hourSchemeMongo.save();
      await this.rcmdService.createOrUpdateHourScheme(hourSchemeMongo);
    }

    return;
  }

  async seedFakerData(): Promise<void> {
    this.logger.log(`seedFakerData()`);

    let users = await this.userModel.find().exec();
    let projects = await this.projectModel.find().exec();
    let machines = await this.machineModel.find().exec();
    const hourSchemes = await this.hourSchemeModel.find().exec();

    if (
      users.length >= 6 &&
      projects.length >= 5 &&
      machines.length >= 5 &&
      hourSchemes.length >= 5
    ) {
      this.logger.log(`Data already seeded, skipping...`);
      return;
    }

    this.logger.log(`Deleting all data...`);
    await this.userModel.deleteMany({}).exec();
    await this.projectModel.deleteMany({}).exec();
    await this.machineModel.deleteMany({}).exec();
    await this.hourSchemeModel.deleteMany({}).exec();
    await this.rcmdService.deleteAndDetachAll();

    this.logger.log(`Creating users...`);
    // create admin user
    const admin = {
      username: 'admin',
      password: await this.generateHashedPassword('admin'),
      firstname: 'Admin',
      lastname: 'Admin',
      email: 'admin@admin.com',
      role: UserRole.ADMIN,
    } as IUser;

    const adminMongo = new this.userModel(admin);
    await adminMongo.save();
    await this.rcmdService.createOrUpdateUser(adminMongo);

    // create 2 office workers
    for (let i = 0; i < 2; i++) {
      const user = {
        username: faker.internet.userName(),
        password: await this.generateHashedPassword('password'),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        role: UserRole.OFFICE,
      } as IUser;

      const userMongo = new this.userModel(user);
      await userMongo.save();
      await this.rcmdService.createOrUpdateUser(userMongo);
    }

    // create 3 roadworkers
    for (let i = 0; i < 3; i++) {
      const user = {
        username: faker.internet.userName(),
        password: await this.generateHashedPassword('password'),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        role: UserRole.ROADWORKER,
      } as IUser;

      const userMongo = new this.userModel(user);
      await userMongo.save();
      await this.rcmdService.createOrUpdateUser(userMongo);
    }

    users = await this.userModel.find().exec();

    this.logger.log(`Creating projects...`);
    for (let i = 0; i <= 5; i++) {
      const user = users[Math.floor(Math.random() * 2) + 1];

      const project = {
        name: faker.company.name(),
        admin: user as IUser,
        location: {
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          postalCode: faker.location.zipCode(),
        }
      } as IProject;

      const projectMongo = new this.projectModel(project);
      await projectMongo.save();
      await this.rcmdService.createOrUpdateProject(projectMongo);
    }

    projects = await this.projectModel.find().exec();

    this.logger.log(`Creating machines...`);
    for (let i = 0; i <= 5; i++) {
      const machine = {
        typeNumber: faker.phone.imei(),
        name: faker.vehicle.model(),
      } as IMachine;

      const machineMongo = new this.machineModel(machine);
      await machineMongo.save();
      await this.rcmdService.createOrUpdateMachine(machineMongo);
    }

    machines = await this.machineModel.find().exec();

    this.logger.log(`Creating hour schemes...`);
    for (let i = 0; i <= 5; i++) {
      const roadworker = users[Math.floor(Math.random() * 3) + 3];

      const rows: IHourSchemeRow[] = [];
      for (let j = 0; j < 5; j++) {
        const project = projects[Math.floor(Math.random() * 4)];
        const machine = machines[Math.floor(Math.random() * 4)];

        const row = {
          project: project as IProject,
          machine: machine as IMachine,
          hours: faker.number.int({
            min: 1,
            max: 8,
          }),
          description: faker.lorem.sentence()
        } as IHourSchemeRow;
        rows.push(row);
      }

      const hourScheme = {
        worker: roadworker as IUser,
        date: faker.date.recent(),
        rows: rows
      } as IHourScheme;

      const hourSchemeMongo = new this.hourSchemeModel(hourScheme);
      await hourSchemeMongo.save();
      await this.rcmdService.createOrUpdateHourScheme(hourSchemeMongo);
    }
  }

  async generateHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
