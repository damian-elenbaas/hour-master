import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  ICreateHourScheme,
  IHourScheme,
  IUpdateHourScheme,
  Id,
} from '@hour-master/shared/api';
import { HourScheme } from './schemas/hour-scheme.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HourSchemeService {
  private readonly logger: Logger = new Logger(HourSchemeService.name);

  constructor(
    @InjectModel(HourScheme.name)
    private readonly hourSchemeModel: Model<HourScheme>
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
    this.logger.log(`create`);
    const createdHourScheme = await this.hourSchemeModel.create(hourScheme);
    this.logger.log(`createdHourScheme: ${createdHourScheme}`);
    return createdHourScheme;
  }

  async update(id: Id, hourScheme: IUpdateHourScheme): Promise<boolean> {
    this.logger.log(`update(${id})`);

    const updatedHourScheme = await this.hourSchemeModel
      .findByIdAndUpdate(id, hourScheme)
      .exec();

    if (!updatedHourScheme) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
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

    return true;
  }
}
