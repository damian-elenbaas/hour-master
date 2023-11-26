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
import { Roles } from '@hour-master/backend/decorators';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('')
  async getAll(): Promise<IProject[]> {
    return await this.projectService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: Id): Promise<IProject> {
    return await this.projectService.getOne(id);
  }

  @Post('')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async create(@Body() body: CreateProjectDto): Promise<IProject> {
    return await this.projectService.create(body);
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
}
