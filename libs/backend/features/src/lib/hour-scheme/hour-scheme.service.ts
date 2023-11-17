import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { ICreateHourScheme, IHourScheme, IUpdateHourScheme, IUpdateUser, Id, UserRole } from '@hour-master/shared/api';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HourSchemeService {
  TAG = 'HourSchemeService';

  private hourSchemes$ = new BehaviorSubject<IHourScheme[]>([
    {
      id: 'hour-scheme-1',
      date: new Date(),
      worker: {
        id: 'user-1',
        username: 'johndoe',
        email: 'j.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
        password: 'password',
        role: UserRole.ROADWORKER,
      },
      rows: [
        {
          id: 'row-1',
          project: {
            id: 'project-1',
            name: 'Project 1',
            location: {
              id: 'location-1',
              address: 'Location 1',
              city: 'City 1',
              postalCode: '1234 AB',
            },
            admin: {
              id: 'admin-1',
              username: 'admin',
              firstname: 'Admin',
              lastname: 'Admin',
              email: 'admin@example.com',
              password: 'password',
              role: UserRole.OFFICE,
            }
          },
          hours: 4,
          description: 'Ik heb gewerkt aan de weg',
        }
      ]
    },
    {
      id: 'hour-scheme-2',
      date: new Date(),
      worker: {
        id: 'user-2',
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
    Logger.log(`${this.TAG} getOne(${id})`);
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

  update(id: Id, hourScheme: IUpdateHourScheme): boolean {
    Logger.log('update', this.TAG);
    const current = this.hourSchemes$.value;
    const index = current.findIndex((hourScheme) => hourScheme.id === id);
    if(index === -1) throw new NotFoundException("Hour scheme not found");
    const updatedHourScheme: IHourScheme = {
      ...current[index],
      ...hourScheme,
    };
    current[index] = updatedHourScheme;
    this.hourSchemes$.next(current);
    return true;
  }

  // TODO: More methods
}
