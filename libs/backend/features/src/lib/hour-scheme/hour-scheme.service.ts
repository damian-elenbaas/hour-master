import { Injectable, Logger } from '@nestjs/common';

import { IHourScheme } from '@hour-master/shared/api';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class HourSchemeService {
  TAG = 'HourSchemeService';

  private hourSchemes$ = new BehaviorSubject<IHourScheme[]>([]);

  getAll(): IHourScheme[] {
    Logger.log(`${this.TAG} getAll()`);
    return this.hourSchemes$.value;
  }

  // TODO: More methods
}
