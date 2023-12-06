import * as bcrypt from 'bcrypt';
import { HourScheme } from '@hour-master/backend/features/hour-scheme';
import { Project } from '@hour-master/backend/features/project';
import { User } from '@hour-master/backend/user';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, UserRole } from '@hour-master/shared/api';
import { Machine } from '@hour-master/backend/features/machine';
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

        this.logger.log(`Creating roadworker user...`);
        const userMongo = new this.userModel(user);
        this.logger.log(`Saving to mongo...`);
        await userMongo.save();
        this.logger.log(`Saving to neo4j...`);
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

        const project = new this.projectModel({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          admin: user._id,
          location: {
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            postalCode: faker.location.zipCode()
          }
        });

        await project.save();
      }

      projects = await this.projectModel.find().exec();
    }

    let machines = await this.machineModel.find().exec();

    if (machines.length < 5) {
      this.logger.log(`No machines found, seeding data...`);
      this.machineModel.deleteMany({}).exec();

      for (let i = 0; i <= 5; i++) {
        const machine = new this.machineModel({
          typeNumber: faker.phone.imei(),
          name: faker.vehicle.model(),
        });

        await machine.save();
      }

      machines = await this.machineModel.find().exec();
    }

    const hourSchemes = await this.hourSchemeModel.find().exec();

    if (hourSchemes.length < 5) {
      this.logger.log(`No hourSchemes found, seeding data...`);
      this.hourSchemeModel.deleteMany({}).exec();

      for (let i = 0; i <= 5; i++) {
        const roadworker = users[Math.floor(Math.random() * 3) + 3];

        const rows = [];
        for (let j = 0; j < 5; j++) {
          const project = projects[Math.floor(Math.random() * 4)];
          const machine = machines[Math.floor(Math.random() * 4)];
          rows.push({
            project: project._id,
            machine: machine._id,
            hours: faker.number.int({
              min: 1,
              max: 8
            }),
            description: faker.lorem.sentence()
          })
        }

        const hourScheme = new this.hourSchemeModel({
          worker: roadworker._id,
          date: faker.date.recent(),
          rows: rows
        });

        await hourScheme.save();
      }
    }
  }

  async generateHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
