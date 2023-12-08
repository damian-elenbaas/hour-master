import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request
} from '@nestjs/common';
import { HourSchemeService } from './hour-scheme.service';
import { IHourScheme, Id, IJWTPayload } from '@hour-master/shared/api';
import { CreateHourSchemeDto } from './dto/create-hour-scheme.dto';
import { UpsertHourSchemeDto } from './dto/upsert-hour-scheme.dto';

@Controller('hour-scheme')
export class HourSchemeController {
  constructor(private hourSchemeService: HourSchemeService) {}

  @Get('')
  async getAll(
    @Request() req: any
  ): Promise<IHourScheme[]> {
    const user = req.user as IJWTPayload;
    return await this.hourSchemeService.getAll(user.sub);
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
    @Body() body: UpsertHourSchemeDto,
    @Request() req: any
  ): Promise<boolean> {
    const user = req.user as IJWTPayload;
    return await this.hourSchemeService.upsert(id, body, user.sub);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: Id,
    @Request() req: any
  ): Promise<boolean> {
    const user = req.user as IJWTPayload;
    return await this.hourSchemeService.delete(id, user.sub);
  }
}
