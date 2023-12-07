import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { HourSchemeService } from './hour-scheme.service';
import { IHourScheme, Id } from '@hour-master/shared/api';
import { CreateHourSchemeDto } from './dto/create-hour-scheme.dto';
import { UpsertHourSchemeDto } from './dto/upsert-hour-scheme.dto';

@Controller('hour-scheme')
export class HourSchemeController {
  constructor(private hourSchemeService: HourSchemeService) {}

  @Get('')
  async getAll(): Promise<IHourScheme[]> {
    return await this.hourSchemeService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: Id): Promise<IHourScheme> {
    return await this.hourSchemeService.getOne(id);
  }

  @Post('')
  async create(@Body() body: CreateHourSchemeDto): Promise<IHourScheme> {
    return await this.hourSchemeService.create(body);
  }

  @Put(':id')
  async upsert(
    @Param('id') id: Id,
    @Body() body: UpsertHourSchemeDto
  ): Promise<boolean> {
    return await this.hourSchemeService.upsert(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: Id): Promise<boolean> {
    return await this.hourSchemeService.delete(id);
  }
}
