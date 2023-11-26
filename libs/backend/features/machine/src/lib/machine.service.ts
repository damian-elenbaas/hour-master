import {
  ICreateMachine,
  IMachine,
  IUpdateMachine,
  Id,
} from '@hour-master/shared/api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Machine } from './schemas/machine.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MachineService {
  private readonly logger: Logger = new Logger(MachineService.name);

  constructor(
    @InjectModel(Machine.name)
    private readonly machineModel: Model<Machine>
  ) {}

  async getAll(): Promise<IMachine[]> {
    this.logger.log(`getAll()`);

    const machines = await this.machineModel.find().exec();

    return machines;
  }

  async getOne(id: Id): Promise<IMachine> {
    this.logger.log(`getOne(${id})`);

    const machine = await this.machineModel.findById(id).exec();

    if (!machine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    return machine;
  }

  async create(project: ICreateMachine): Promise<IMachine> {
    this.logger.log(`create`);
    const createdMachine = await this.machineModel.create(project);
    return createdMachine;
  }

  async update(id: Id, project: IUpdateMachine): Promise<boolean> {
    this.logger.log(`update(${id})`);

    const updatedMachine = await this.machineModel
      .findByIdAndUpdate(id, project)
      .exec();

    if (!updatedMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    return true;
  }

  async delete(id: Id): Promise<boolean> {
    this.logger.log(`delete(${id})`);

    const deletedMachine = await this.machineModel.findByIdAndDelete(id).exec();

    if (!deletedMachine) {
      throw new NotFoundException(`Machine with id ${id} not found`);
    }

    return true;
  }
}
