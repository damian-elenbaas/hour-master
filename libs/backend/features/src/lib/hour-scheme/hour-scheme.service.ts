import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { ICreateHourScheme, IHourScheme, Id, UserRole } from '@hour-master/shared/api';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HourSchemeService {
  TAG = 'HourSchemeService';

  private hourSchemes$ = new BehaviorSubject<IHourScheme[]>([
    {
      id: 'hour-scheme-1',
      date: new Date(),
      worker: {
        id: 'worker-1',
        username: 'johndoe',
        email: 'j.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'password',
        role: UserRole.ROADWORKER,
      },
    },
    {
      id: 'hour-scheme-2',
      date: new Date(),
      worker: {
        id: 'worker-2',
        username: 'lisaboo',
        email: 'l.boo@example.com',
        firstname: 'Lisa',
        lastname: 'Boo',
        password: 'password',
        role: UserRole.ROADWORKER,
      },
    }
  ]);

  getAll(): IHourScheme[] {
    Logger.log(`${this.TAG} getAll()`);
    return this.hourSchemes$.value;
  }

  getOne(id: Id): IHourScheme {
    const hourScheme =
      this.hourSchemes$.value
        .find((hourScheme) => hourScheme.id === id);
    if(!hourScheme) throw new NotFoundException("Hour scheme not found");
    return hourScheme;
  }

  create(hourScheme: ICreateHourScheme): IHourScheme {
    Logger.log('create', this.TAG);
    const current = this.hourSchemes$.value;
    const newHourScheme: IHourScheme = {
      ...hourScheme,
      id: `hour-scheme-${Math.floor(Math.random() * 10000)}`,
    };
    this.hourSchemes$.next([...current, newHourScheme]);
    return newHourScheme;
  }

  // TODO: More methods
}
