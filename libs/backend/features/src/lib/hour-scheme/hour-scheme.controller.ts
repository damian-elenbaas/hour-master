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
import { IHourScheme, Id, IJWTPayload, UserRole } from '@hour-master/shared/api';
import { CreateHourSchemeDto } from './dto/create-hour-scheme.dto';
import { UpsertHourSchemeDto } from './dto/upsert-hour-scheme.dto';
import { Roles } from '@hour-master/backend/decorators';

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
  @Roles([UserRole.ROADWORKER, UserRole.ADMIN])
  async create(@Body() body: CreateHourSchemeDto): Promise<IHourScheme> {
    return await this.hourSchemeService.create(body);
  }

  @Put(':id')
  @Roles([UserRole.ROADWORKER, UserRole.ADMIN])
  async upsert(
    @Param('id') id: Id,
    @Body() body: UpsertHourSchemeDto,
    @Request() req: any
  ): Promise<boolean> {
    const user = req.user as IJWTPayload;
    return await this.hourSchemeService.upsert(id, body, user.sub);
  }

  @Delete(':id')
  @Roles([UserRole.ROADWORKER, UserRole.ADMIN])
  async delete(
    @Param('id') id: Id,
    @Request() req: any
  ): Promise<boolean> {
    const user = req.user as IJWTPayload;
    return await this.hourSchemeService.delete(id, user.sub);
  }
}
