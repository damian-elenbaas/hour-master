import { Body, Controller, Get, Post } from '@nestjs/common';
import { HourSchemeService } from './hour-scheme.service';
import { IHourScheme } from '@hour-master/shared/api';
import { CreateHourSchemeDto } from '@hour-master/backend/dto';

@Controller('hour-scheme')
export class HourSchemeController {
  constructor(private hourSchemeService: HourSchemeService) {}

  @Get('')
  getAll(): IHourScheme[] {
    return this.hourSchemeService.getAll();
  }

  @Post('')
  create(@Body() body: CreateHourSchemeDto): IHourScheme {
    return this.hourSchemeService.create(body);
  }
}
