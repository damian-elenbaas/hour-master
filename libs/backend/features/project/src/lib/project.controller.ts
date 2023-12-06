import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IProject, Id, UserRole } from '@hour-master/shared/api';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';
import { Public, Roles } from '@hour-master/backend/decorators';
import { RecommendationsService } from '@hour-master/backend/recommendations';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly recommendationsService: RecommendationsService
  ) {}

  @Get('')
  async getAll(): Promise<IProject[]> {
    return await this.projectService.getAll();
  }

  @Post('')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async create(@Body() body: CreateProjectDto): Promise<IProject> {
    return await this.projectService.create(body);
  }

  @Get('most-worked-on')
  @Public()
  async getMostWorkedOn() {
    return await this.recommendationsService.getMostWorkedOnProject();
  }

  @Get(':id')
  async getOne(@Param('id') id: Id): Promise<IProject> {
    return await this.projectService.getOne(id);
  }

  @Put(':id')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async update(
    @Param('id') id: Id,
    @Body() body: UpdateProjectDto
  ): Promise<boolean> {
    return await this.projectService.update(id, body);
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async delete(@Param('id') id: Id): Promise<boolean> {
    return await this.projectService.delete(id);
  }

  @Get(':id/workers')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getWorkers(@Param('id') id: Id) {
    return await this.recommendationsService.getAllWorkersFromProject(id);
  }

  @Get(':id/total-hours')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getTotalHours(@Param('id') id: Id) {
    return await this.recommendationsService.getTotalHoursOnProject(id);
  }

  @Get(':id/machines')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getAllMachines(@Param('id') id: Id) {
    return await this.recommendationsService.getAllUsedMachinesFromProject(id);
  }
}
