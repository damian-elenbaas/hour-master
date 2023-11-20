import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { ICreateHourScheme, IHourScheme, IUpdateHourScheme, Id } from '@hour-master/shared/api';
import { HourScheme } from './schemas/hour-scheme.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HourSchemeService {
  private readonly logger: Logger = new Logger(HourSchemeService.name);

  constructor(
    @InjectModel(HourScheme.name) private readonly hourSchemeModel: Model<HourScheme>) {
  }

  async getAll(): Promise<IHourScheme[]> {
    this.logger.log(`getAll()`);

    return await this.hourSchemeModel.find().exec();
  }

  async getOne(id: Id): Promise<IHourScheme> {
    this.logger.log(`getOne(${id})`);

    const user = await this.hourSchemeModel.findById(id).exec();

    if(!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async create(hourScheme: ICreateHourScheme): Promise<IHourScheme> {
    this.logger.log(`create`);

    const createdHourScheme = new this.hourSchemeModel(hourScheme);
    return await createdHourScheme.save();
  }

  async update(id: Id, hourScheme: IUpdateHourScheme): Promise<boolean> {
    this.logger.log(`update(${id})`);

    const updatedHourScheme =
      await this.hourSchemeModel
        .findByIdAndUpdate(id, hourScheme).exec();

    if(!updatedHourScheme) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
    }

    return true;
  }

  async delete(id: Id): Promise<boolean> {
    this.logger.log(`delete(${id})`);

    const deletedHourScheme =
      await this.hourSchemeModel.findByIdAndDelete(id).exec();

    if(!deletedHourScheme) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
    }

    return true;
  }
}
