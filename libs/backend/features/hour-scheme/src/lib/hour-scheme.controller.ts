import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HourSchemeService } from './hour-scheme.service';
import { IHourScheme, Id } from '@hour-master/shared/api';
import { CreateHourSchemeDto } from './dto/create-hour-scheme.dto';
import { UpdateHourSchemeDto } from './dto/update-hour-scheme.dto';

@Controller('hour-scheme')
export class HourSchemeController {
  constructor(private hourSchemeService: HourSchemeService) { }

  @Get('')
  getAll(): IHourScheme[] {
    return this.hourSchemeService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: Id): IHourScheme {
    return this.hourSchemeService.getOne(id);
  }

  @Post('')
  create(@Body() body: CreateHourSchemeDto): IHourScheme {
    return this.hourSchemeService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: Id, @Body() body: UpdateHourSchemeDto): boolean {
    return this.hourSchemeService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: Id): boolean {
    return this.hourSchemeService.delete(id);
  }
}
