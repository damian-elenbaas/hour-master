import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { HourScheme } from '@hour-master/backend/features';
import { Project } from '@hour-master/backend/features';
import { User } from '@hour-master/backend/user';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IHourScheme, IHourSchemeRow, IMachine, IProject, IUser, UserRole } from '@hour-master/shared/api';
import { Machine } from '@hour-master/backend/features';
import { faker } from '@faker-js/faker';
import { RecommendationsService } from '@hour-master/backend/recommendations';

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
    this.seedData();
  }

  async seedData(): Promise<void> {
    this.logger.log(`seedData()`);

    let users = await this.userModel.find().exec();

    if (users.length < 6) {
      this.logger.log(`No users found, seeding data...`);
      this.userModel.deleteMany({}).exec();

      // create admin user
      const admin = {
        username: 'admin',
        password: await this.generateHashedPassword('admin'),
        firstname: 'Admin',
        lastname: 'Admin',
        email: 'admin@admin.com',
        role: UserRole.ADMIN,
      } as IUser;

      this.logger.log(`Creating admin user...`);
      const adminMongo = new this.userModel(admin);
      this.logger.log(`Saving to mongo...`);
      await adminMongo.save();
      this.logger.log(`Saving to neo4j...`);
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

        this.logger.log(`Creating office user...`);
        const userMongo = new this.userModel(user);
        this.logger.log(`Saving to mongo...`);
        await userMongo.save();
        this.logger.log(`Saving to neo4j...`);
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
    }

    let projects = await this.projectModel.find().exec();

    if (projects.length < 5) {
      this.logger.log(`No projects found, seeding data...`);
      this.projectModel.deleteMany({}).exec();

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
    }

    let machines = await this.machineModel.find().exec();

    if (machines.length < 5) {
      this.logger.log(`No machines found, seeding data...`);
      this.machineModel.deleteMany({}).exec();

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
    }

    const hourSchemes = await this.hourSchemeModel.find().exec();

    if (hourSchemes.length < 5) {
      this.logger.log(`No hourSchemes found, seeding data...`);
      this.hourSchemeModel.deleteMany({}).exec();

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
  }

  async generateHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
