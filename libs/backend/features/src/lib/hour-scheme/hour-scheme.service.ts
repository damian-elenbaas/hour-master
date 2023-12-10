import { Inject, Injectable, Logger, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';

import {
  ICreateHourScheme,
  IHourScheme,
  IUpsertHourScheme,
  Id,
  UserRole,
} from '@hour-master/shared/api';
import { HourScheme } from './schemas/hour-scheme.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RecommendationsService } from '@hour-master/backend/recommendations';
import { UserService } from '../user/user.service';
import { MachineService } from '../machine/machine.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class HourSchemeService {
  private readonly logger: Logger = new Logger(HourSchemeService.name);

  constructor(
    @InjectModel(HourScheme.name)
    private readonly hourSchemeModel: Model<HourScheme>,
    private readonly recommendationsService: RecommendationsService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => MachineService))
    private readonly machineService: MachineService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
  ) { }

  async getAll(userId: Id): Promise<IHourScheme[]> {
    this.logger.log(`getAll()`);

    const user = await this.userService.getOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const filterQuery: FilterQuery<IHourScheme> = {};

    // only allow roadworker to see his own hour schemes
    if (user.role === UserRole.ROADWORKER) {
      filterQuery.worker = userId;
    }

    const hourSchemes = await this.hourSchemeModel
      .find(filterQuery)
      .sort({ date: -1 })
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
    await this.userService.getOne(hourScheme.worker._id);

    // check if project exists
    const projectIds = hourScheme.rows?.map(row => row.project._id);
    if (projectIds) {
      await this.projectService.getMany(projectIds);
    }

    // check if machine exists
    const machineIds = hourScheme.rows?.map(row => row.machine?._id);
    if (machineIds) {
      await this.machineService.getMany(machineIds as Id[]);
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

    const user = await this.userService.getOne(userId);

    if (
      currentHourScheme.worker._id !== userId &&
      user.role !== UserRole.ADMIN
    ) {
      throw new UnauthorizedException("You are not allowed to update this hour scheme");
    }

    // check if worker exists
    await this.userService.getOne(hourScheme.worker._id);

    // check if project exists
    const projectIds = hourScheme.rows?.map(row => row.project._id);
    if (projectIds) {
      await this.projectService.getMany(projectIds);
    }

    // check if machine exists
    const machineIds = hourScheme.rows?.map(row => row.machine?._id);
    if (machineIds) {
      await this.machineService.getMany(machineIds as Id[]);
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

    const user = await this.userService.getOne(userId);

    if(
      hourScheme.worker._id.toString() !== userId.toString() &&
      user.role !== UserRole.ADMIN
    ) {
      throw new UnauthorizedException('You are not allowed to delete this hour scheme');
    }

    await this.hourSchemeModel
      .findByIdAndDelete(id)
      .exec();

    const n4jResult = await this.recommendationsService.deleteHourScheme(id);

    if (!n4jResult) {
      throw new Error('Could not delete hour scheme');
    }

    return true;
  }

  async deleteRowsByProjectId(projectId: Id): Promise<boolean> {
    this.logger.log(`deleteRowsByProjectId(${projectId})`);

    const hourSchemes = await this.hourSchemeModel.find({
      'rows.project': projectId
    }).exec();

    if (!hourSchemes) {
      return true;
    }

    // delete rows from hour schemes
    const hourSchemeIds = hourSchemes.map(hourScheme => hourScheme._id);
    await this.hourSchemeModel.updateMany({
      _id: { $in: hourSchemeIds }
    }, {
      $pull: { rows: { project: projectId } }
    }).exec();

    // delete hour schemes without rows
    await this.hourSchemeModel.deleteMany({
      rows: { $size: 0 }
    }).exec();

    return true;
  }

  async updateRowsByMachineId(machineId: Id): Promise<boolean> {
    this.logger.log(`deleteRowsByProjectId(${machineId})`);

    const hourSchemes = await this.hourSchemeModel.find({
      'rows.machine': machineId
    }).exec();

    if (!hourSchemes) {
      return true;
    }

    // set machine to null on rows from hour schemes where machine is deleted
    const hourSchemeIds = hourSchemes.map(hourScheme => hourScheme._id);
    await this.hourSchemeModel.updateMany({
      _id: { $in: hourSchemeIds }
    }, {
      $set: { 'rows.$[elem].machine': null }
    }, {
      arrayFilters: [{ 'elem.machine': machineId }]
    }).exec();

    return true;
  }
}
