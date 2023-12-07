import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';

import {
  ICreateHourScheme,
  IHourScheme,
  IMachine,
  IProject,
  IUpsertHourScheme,
  IUser,
  Id,
  UserRole,
} from '@hour-master/shared/api';
import { HourScheme } from './schemas/hour-scheme.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RecommendationsService } from '@hour-master/backend/recommendations';
import { Project } from '@hour-master/backend/features/project';
import { Machine } from '@hour-master/backend/features/machine';
import { User } from '@hour-master/backend/user';

@Injectable()
export class HourSchemeService {
  private readonly logger: Logger = new Logger(HourSchemeService.name);

  constructor(
    @InjectModel(HourScheme.name)
    private readonly hourSchemeModel: Model<HourScheme>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    @InjectModel(Machine.name)
    private readonly machineModel: Model<Machine>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly recommendationsService: RecommendationsService
  ) { }

  async getAll(userId: Id): Promise<IHourScheme[]> {
    this.logger.log(`getAll()`);

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (user.role === UserRole.ROADWORKER) {
      const hourSchemes = await this.hourSchemeModel
        .find({ worker: userId })
        .populate('worker')
        .exec();

      return hourSchemes;
    }

    const hourSchemes = await this.hourSchemeModel
      .find()
      .populate('worker')
      .exec();

    return hourSchemes;
  }

  async getOne(id: Id): Promise<IHourScheme> {
    this.logger.log(`getOne(${id})`);

    try {
      const hourScheme = await this.hourSchemeModel
        .findById(id)
        .populate('worker')
        .populate({
          path: 'rows',
          populate: [
            {
              path: 'project',
              model: 'Project',
            },
            {
              path: 'machine',
              model: 'Machine',
            }
          ]
        })
        .exec();

      if (!hourScheme) {
        throw new NotFoundException(`Hour scheme with id ${id} not found`);
      }

      return hourScheme;
    } catch (error) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
    }
  }

  async create(hourScheme: ICreateHourScheme): Promise<IHourScheme> {
    this.logger.log(`create hour scheme`);

    // check if worker exists
    await this.getExistingWorker(hourScheme.worker._id);

    // check if project exists
    const projectIds = hourScheme.rows?.map(row => row.project._id);
    if (projectIds) {
      await this.getExistingProjects(projectIds);
    }

    // check if machine exists
    const machineIds = hourScheme.rows?.map(row => row.machine?._id);
    if (machineIds) {
      await this.getExistingMachines(machineIds as Id[]);
    }

    const newHourSchemeModel = new this.hourSchemeModel(hourScheme);
    const createdHourScheme = await newHourSchemeModel.save();

    const n4jResult = this.recommendationsService.createOrUpdateHourScheme(
      createdHourScheme
    );

    if (!n4jResult) {
      await this.hourSchemeModel.findByIdAndDelete(createdHourScheme._id).exec();
      throw new Error('Could not create hour scheme');
    }

    return createdHourScheme;
  }

  async upsert(id: Id, hourScheme: IUpsertHourScheme, userId: Id): Promise<boolean> {
    this.logger.log(`update(${id})`);

    const currentHourScheme = await this.hourSchemeModel.findById(id).exec();
    if (!currentHourScheme) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
    }

    if (currentHourScheme.worker._id !== userId) {
      throw new UnauthorizedException("You are not allowed to update this hour scheme");
    }

    // check if worker exists
    await this.getExistingWorker(hourScheme.worker._id);

    // check if project exists
    const projectIds = hourScheme.rows?.map(row => row.project._id);
    if (projectIds) {
      await this.getExistingProjects(projectIds);
    }

    // check if machine exists
    const machineIds = hourScheme.rows?.map(row => row.machine?._id);
    if (machineIds) {
      await this.getExistingMachines(machineIds as Id[]);
    }

    const updatedHourScheme = await this.hourSchemeModel
      .findByIdAndUpdate(id, hourScheme, { upsert: true })
      .exec();

    if (!updatedHourScheme) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
    }

    const n4jResult = this.recommendationsService.createOrUpdateHourScheme(
      updatedHourScheme
    );

    if (!n4jResult) {
      throw new Error('Could not update hour scheme');
    }

    return true;
  }

  async delete(id: Id, userId: Id): Promise<boolean> {
    this.logger.log(`delete(${id})`);

    const hourScheme = await this.hourSchemeModel.findById(id).exec();
    if(!hourScheme) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
    }

    if(hourScheme.worker._id !== userId.toString()) {
      throw new UnauthorizedException('You are not allowed to delete this hour scheme');
    }

    await this.hourSchemeModel
      .findByIdAndDelete(id)
      .exec();

    const n4jResult = this.recommendationsService.deleteHourScheme(id);

    if (!n4jResult) {
      throw new Error('Could not delete hour scheme');
    }

    return true;
  }

  private async getExistingWorker(workerId: Id): Promise<IUser> {
    const existingWorker = await this.userModel.findById(workerId).exec();
    if (!existingWorker) {
      throw new NotFoundException(`Worker with id ${workerId} not found`);
    }
    return existingWorker;
  }

  private async getExistingProjects(projectIds: Id[]): Promise<IProject[]> {
    const existingProjects = await this.projectModel
      .find({ _id: { $in: projectIds } })
      .exec();

    if (existingProjects.length !== projectIds.length) {
      throw new NotFoundException(
        `Not all projects with ids ${projectIds} were found`
      );
    }

    return existingProjects;
  }

  private async getExistingMachines(machineIds: Id[]): Promise<IMachine[]> {
    const existingMachines = await this.machineModel
      .find({ _id: { $in: machineIds } })
      .exec();

    if (existingMachines.length !== machineIds.length) {
      throw new NotFoundException(
        `Not all machines with ids ${machineIds} were found`
      );
    }

    return existingMachines;
  }
}
