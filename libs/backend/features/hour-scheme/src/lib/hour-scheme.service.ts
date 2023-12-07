import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  ICreateHourScheme,
  IHourScheme,
  IMachine,
  IProject,
  IUpdateHourScheme,
  IUpsertHourScheme,
  IUser,
  Id,
} from '@hour-master/shared/api';
import { HourScheme } from './schemas/hour-scheme.schema';
import { Model, Types } from 'mongoose';
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

  async getAll(): Promise<IHourScheme[]> {
    this.logger.log(`getAll()`);

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
    hourScheme.worker = await this.getExistingWorker(hourScheme.worker._id);

    // TODO: Make this a separate function
    const projectIds = hourScheme.rows?.map(row => row.project._id);
    if(projectIds) {
      const projects = await this.getExistingProjects(projectIds);
      hourScheme.rows = hourScheme.rows?.map(row => {
        const project = projects.find(project => project._id.toString() === row.project._id);
        if(!project) {
          this.logger.log(`Project with id ${row.project._id} not found`);
          throw new NotFoundException(`Project with id ${row.project._id} not found`);
        }
        row.project = project;
        return row;
      });
    }

    // TODO: Make this a separate function
    const machineIds = hourScheme.rows?.map(row => row.machine?._id);
    if(machineIds) {
      const machines = await this.getExistingMachines(machineIds as Id[]);
      hourScheme.rows = hourScheme.rows?.map(row => {
        if(row.machine) {
          const machine = machines.find(machine => machine._id.toString() === row.machine?._id);
          if(!machine) {
            this.logger.log(`Machine with id ${row.machine?._id} not found`);
            throw new NotFoundException(`Machine with id ${row.machine?._id} not found`);
          }
          row.machine = machine;
        }
        return row;
      });
    }

    const newHourSchemeModel = new this.hourSchemeModel(hourScheme);
    const createdHourScheme = await newHourSchemeModel.save();

    const n4jResult = this.recommendationsService.createOrUpdateHourScheme(
      createdHourScheme
    );

    if(!n4jResult) {
      await this.hourSchemeModel.findByIdAndDelete(createdHourScheme._id).exec();
      throw new Error('Could not create hour scheme');
    }

    return createdHourScheme;
  }

  async upsert(id: Id, hourScheme: IUpsertHourScheme): Promise<boolean> {
    this.logger.log(`update(${id})`);
    hourScheme._id = new Types.ObjectId(id);

    // check if worker exists
    hourScheme.worker = await this.getExistingWorker(hourScheme.worker._id);

    // check if project exists
    const projectIds = hourScheme.rows?.map(row => row.project._id);
    if(projectIds) {
      const projects = await this.getExistingProjects(projectIds);
      hourScheme.rows = hourScheme.rows?.map(row => {
        const project = projects.find(project => project._id.toString() === row.project._id);
        if(!project) {
          this.logger.log(`Project with id ${row.project._id} not found`);
          throw new NotFoundException(`Project with id ${row.project._id} not found`);
        }
        row.project = project;
        return row;
      });
    }

    // check if machine exists
    const machineIds = hourScheme.rows?.map(row => row.machine?._id);
    if(machineIds) {
      const machines = await this.getExistingMachines(machineIds as Id[]);
      hourScheme.rows = hourScheme.rows?.map(row => {
        if(row.machine) {
          const machine = machines.find(machine => machine._id.toString() === row.machine?._id);
          if(!machine) {
            this.logger.log(`Machine with id ${row.machine?._id} not found`);
            throw new NotFoundException(`Machine with id ${row.machine?._id} not found`);
          }
          row.machine = machine;
        }
        return row;
      });
    }

    // HACK: When upserting or updating normally with the full object, the refrences to worker,
    // project and machine are lost and instead of ids, the full object is saved.
    // This is a workaround to save the ids instead of the full object.
    const tempRows = hourScheme.rows?.map(row => {
      return {
        _id: row._id,
        project: row.project._id,
        hours: row.hours,
        description: row.description,
        machine: row.machine?._id,
      }
    });

    const tempScheme = {
      _id: hourScheme._id,
      date: hourScheme.date,
      worker: hourScheme.worker._id,
      rows: tempRows,
    }

    const updatedHourScheme = await this.hourSchemeModel
      .findByIdAndUpdate(id, tempScheme)
      .exec();

    if (!updatedHourScheme) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
    }

    const n4jResult = this.recommendationsService.createOrUpdateHourScheme(
      updatedHourScheme
    );

    if(!n4jResult) {
      throw new Error('Could not update hour scheme');
    }

    return true;
  }

  async delete(id: Id): Promise<boolean> {
    this.logger.log(`delete(${id})`);

    const deletedHourScheme = await this.hourSchemeModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedHourScheme) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
    }

    const n4jResult = this.recommendationsService.deleteHourScheme(id);

    if(!n4jResult) {
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
