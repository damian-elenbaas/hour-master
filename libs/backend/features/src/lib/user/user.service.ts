import { ICreateUser, IUser, Id, UserRole } from '@hour-master/shared/api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UserService {
  TAG = 'UserService';

  private users$ = new BehaviorSubject<IUser[]>([
    {
      id: 'user-1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'j.doe@example.com',
      password: 'password',
      username: 'jdoe',
      role: UserRole.ROADWORKER
    },
    {
      id: 'user-2',
      firstname: 'Lisa',
      lastname: 'Boo',
      email: 'l.boo@example.com',
      password: 'password',
      username: 'lboo',
      role: UserRole.OFFICE
    },
  ]);

  getAll(): IUser[] {
    Logger.log(`${this.TAG} getAll()`);

    // get value without passwords
    let value = this.users$.value;
    value = value.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    });

    return value;
  }

  getOne(id: Id): IUser {
    Logger.log(`${this.TAG} getOne(${id})`);
    let user =
      this.users$.value
        .find((user) => user.id === id);

    if(user !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      user = rest;
    }

    if(!user) throw new NotFoundException("User not found");
    return user;
  }

  create(user: ICreateUser): IUser {
    Logger.log('create', this.TAG);
    const current = this.users$.value;
    let newUser: IUser = {
      ...user,
      id: `user-${Math.floor(Math.random() * 10000)}`,
    };
    this.users$.next([...current, newUser]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = newUser;
    newUser = rest;

    return newUser;
  }
}
