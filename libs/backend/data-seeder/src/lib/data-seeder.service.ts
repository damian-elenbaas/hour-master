import * as bcrypt from 'bcrypt';
import { HourScheme } from '@hour-master/backend/features/hour-scheme';
import { Project } from '@hour-master/backend/features/project';
import { User } from '@hour-master/backend/user';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from '@hour-master/shared/api';
import { Machine } from '@hour-master/backend/features/machine';

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
    private readonly machineModel: Model<Machine>
  ) {
    this.seedData();
  }

  async seedData(): Promise<void> {
    this.logger.log(`seedData()`);

    let users = await this.userModel.find().exec();

    if (users.length == 0) {
      this.logger.log(`No users found, seeding data...`);
      const user = new this.userModel({
        username: 'admin',
        password: await this.generateHashedPassword('admin'),
        firstname: 'Admin',
        lastname: 'Admin',
        email: 'admin@admin.com',
        role: UserRole.ADMIN,
      });

      await user.save();

      users = await this.userModel.find().exec();
    }

    let projects = await this.projectModel.find().exec();

    if (projects.length == 0) {
      this.logger.log(`No projects found, seeding data...`);
      const project = new this.projectModel({
        name: 'OV Hub, Gemeente Breda',
        location: {
          address: 'Grote Markt 38',
          postalCode: '4811 XR',
          city: 'Breda',
        },
        admin: users[0]._id,
      });

      await project.save();

      projects = await this.projectModel.find().exec();
    }

    let machines = await this.machineModel.find().exec();

    if (machines.length == 0) {
      this.logger.log(`No machines found, seeding data...`);
      const machine = new this.machineModel({
        typeNumber: 'CAT 320D',
        name: 'CAT 320D Kraan',
      });

      await machine.save();

      machines = await this.machineModel.find().exec();
    }

    const hourSchemes = await this.hourSchemeModel.find().exec();

    if (hourSchemes.length == 0) {
      this.logger.log(`No hourSchemes found, seeding data...`);
      const hourScheme = new this.hourSchemeModel({
        worker: users[0]._id,
        date: new Date(),
        rows: [
          {
            project: projects[0]._id,
            hours: 8,
            description: 'Ondergrond geëgaliseerd en puin gestort',
          },
        ],
      });

      await hourScheme.save();
    }
  }

  async generateHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
