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
import { IProject, Id, UserRole, IJWTPayload } from '@hour-master/shared/api';
import { CreateProjectDto, UpsertProjectDto } from './dto/project.dto';
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

  @Get(':id')
  async getOne(@Param('id') id: Id): Promise<IProject> {
    return await this.projectService.getOne(id);
  }

  @Put(':id')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async update(
    @Param('id') id: Id,
    @Body() body: UpsertProjectDto,
    @Request() req: any
  ): Promise<boolean> {
    const user = req.user as IJWTPayload;
    return await this.projectService.upsert(id, body, user.sub);
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async delete(
    @Param('id') id: Id,
    @Request() req: any
  ): Promise<boolean> {
    const user = req.user as IJWTPayload;
    return await this.projectService.delete(id, user.sub);
  }
}
