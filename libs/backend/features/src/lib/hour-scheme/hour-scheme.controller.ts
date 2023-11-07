import { Controller, Get } from '@nestjs/common';
import { HourSchemeService } from './hour-scheme.service';
import { IHourScheme } from '@hour-master/shared/api';

@Controller('hour-scheme')
export class HourSchemeController {
  constructor(private hourSchemeService: HourSchemeService) {}

  @Get('')
  getAll(): IHourScheme[] {
    return this.hourSchemeService.getAll();
  }
}
