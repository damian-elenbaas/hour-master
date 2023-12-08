import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { MachineService } from './machine.service';
import { IMachine, Id, UserRole } from '@hour-master/shared/api';
import { Roles } from '@hour-master/backend/decorators';
import { CreateMachineDto, UpdateMachineDto } from './dto/machine.dto';

@Controller('machine')
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Get('')
  async getAll(): Promise<IMachine[]> {
    return await this.machineService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: Id): Promise<IMachine> {
    return await this.machineService.getOne(id);
  }

  @Post('')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async create(@Body() body: CreateMachineDto): Promise<IMachine> {
    return await this.machineService.create(body);
  }

  @Put(':id')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async update(
    @Param('id') id: Id,
    @Body() body: UpdateMachineDto
  ): Promise<boolean> {
    return await this.machineService.update(id, body);
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async delete(@Param('id') id: Id): Promise<boolean> {
    return await this.machineService.delete(id);
  }
}
