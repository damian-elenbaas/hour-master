import {
  ICreateMachine,
  IMachine,
  IUpdateMachine,
  Id,
} from '@hour-master/shared/api';
import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { Machine } from './schemas/machine.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecommendationsService } from '@hour-master/backend/recommendations';
import { HourSchemeService } from '../hour-scheme/hour-scheme.service';

@Injectable()
export class MachineService {
  private readonly logger: Logger = new Logger(MachineService.name);

  constructor(
    @InjectModel(Machine.name)
    private readonly machineModel: Model<Machine>,
    private readonly recommendationsService: RecommendationsService,
    @Inject(forwardRef(() => HourSchemeService))
    private readonly hourSchemeService: HourSchemeService,
  ) {}

  async getAll(): Promise<IMachine[]> {
    this.logger.log(`getAll()`);

    const machines = await this.machineModel.find().exec();

    return machines;
  }

  async getOne(id: Id): Promise<IMachine> {
    this.logger.log(`getOne(${id})`);

    try {
      const machine = await this.machineModel.findById(id).exec();

      if (!machine) {
        throw new NotFoundException(`Machine with id ${id} not found`);
      }

      return machine;
    } catch (error) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }
  }

  async getMany(ids: Id[]): Promise<IMachine[]> {
    this.logger.log(`getMany(${ids})`);

    const machines = await this.machineModel.find({ _id: { $in: ids } }).exec();

    if (!machines) {
      throw new NotFoundException(`Machines with ids ${ids} not found`);
    }

    return machines;
  }

  async create(machine: ICreateMachine): Promise<IMachine> {
    this.logger.log(`create`);
    const createdMachine = await this.machineModel.create(machine);
    const neo4jResult = this.recommendationsService.createOrUpdateMachine(
      createdMachine
    );

    if (!neo4jResult) {
      await this.machineModel.findByIdAndDelete(createdMachine._id).exec();
      throw new Error('Could not create machine');
    }

    return createdMachine;
  }

  async update(id: Id, machine: IUpdateMachine): Promise<boolean> {
    this.logger.log(`update(${id})`);

    const updatedMachine = await this.machineModel
      .findByIdAndUpdate(id, machine)
      .exec();

    if (!updatedMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    const neo4jResult = this.recommendationsService.createOrUpdateMachine(
      updatedMachine
    );

    if (!neo4jResult) {
      throw new Error('Could not update machine');
    }

    return true;
  }

  async delete(id: Id): Promise<boolean> {
    this.logger.log(`delete(${id})`);

    const deletedMachine = await this.machineModel.findByIdAndDelete(id).exec();

    if (!deletedMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    const neo4jResult = await this.recommendationsService.deleteMachine(id);

    if (!neo4jResult) {
      await this.machineModel.create(deletedMachine);
      throw new Error('Could not delete machine');
    }

    await this.hourSchemeService.updateRowsByMachineId(id);

    return true;
  }
}
