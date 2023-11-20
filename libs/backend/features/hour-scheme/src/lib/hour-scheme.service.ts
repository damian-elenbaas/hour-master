import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { ICreateHourScheme, IHourScheme, IUpdateHourScheme, IUpdateUser, Id, UserRole } from '@hour-master/shared/api';

@Injectable()
export class HourSchemeService {
  private readonly logger: Logger = new Logger(HourSchemeService.name);

  async getAll(): Promise<IHourScheme[]> {
    this.logger.log(`getAll()`);

    return [];
  }

  getOne(id: Id): IHourScheme {
    this.logger.log(`getOne(${id})`);

    return undefined as any;
  }

  create(hourScheme: ICreateHourScheme): IHourScheme {
    this.logger.log(`create`);

    return undefined as any;
  }

  update(id: Id, hourScheme: IUpdateHourScheme): boolean {
    this.logger.log(`update(${id})`);

    return false;
  }

  delete(id: Id): boolean {
    this.logger.log(`delete(${id})`);

    return false;
  }

  // TODO: More methods
}
