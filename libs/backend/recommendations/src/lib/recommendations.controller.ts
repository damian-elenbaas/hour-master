import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { Id, UserRole } from '@hour-master/shared/api';
import { Roles } from '@hour-master/backend/decorators';

@Controller('recommendations')
export class RecommendationsController {
  private readonly logger = new Logger(RecommendationsController.name);

  constructor(
    private readonly recommendationsService: RecommendationsService
  ) { }

  @Get('project/:id/workers')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getWorkers(@Param('id') id: Id) {
    return await this.recommendationsService.getAllWorkersFromProject(id);
  }

  @Get('project/:id/total-hours')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getTotalHours(@Param('id') id: Id) {
    return await this.recommendationsService.getTotalHoursOnProject(id);
  }

  @Get('project/:id/machines')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getAllMachines(@Param('id') id: Id) {
    return await this.recommendationsService.getAllUsedMachinesFromProject(id);
  }

  @Get('project/:id/rows')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getWorkRowsFromProject(@Param('id') id: Id) {
    return await this.recommendationsService.getHourSchemeRowsRelatedToProject(id);
  }

  @Get('project/most-worked-on')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getMostWorkedOn() {
    return await this.recommendationsService.getMostWorkedOnProject();
  }

  @Get('machine/:id/total-hours')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getTotalHoursOnMachine(@Param('id') id: Id) {
    return await this.recommendationsService.getTotalHoursOnMachine(id);
  }

  @Get('machine/:id/rows')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getWorkRowsFromMachine(@Param('id') id: Id) {
    return await this.recommendationsService.getHourSchemeRowsRelatedToMachine(id);
  }

  @Get('machine/:id/workers')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getWorkersFromMachine(@Param('id') id: Id) {
    return await this.recommendationsService.getRelatedWorkersFromMachine(id);
  }

  @Get('machine/:id/projects')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getProjectsFromMachine(@Param('id') id: Id) {
    return await this.recommendationsService.getRelatedProjectsFromMachine(id);
  }

  @Get('worker/:id/projects')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getProjectsFromWorker(@Param('id') id: Id) {
    return await this.recommendationsService.getRelatedProjectsFromWorker(id);
  }

  @Get('worker/:id/machines')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getMachinesFromWorker(@Param('id') id: Id) {
    return await this.recommendationsService.getRelatedMachinesFromWorker(id);
  }

  @Get('worker/:id/workers')
  async getRelatedWorkers(
    @Param('id') id: Id,
    @Query('depth') depth?: number
  ) {
    if (depth) {
      return await this.recommendationsService.getNDepthRelatedWorkersFromWorker(id, depth);
    }
    return await this.recommendationsService.getRelatedWorkersFromWorker(id);
  }
}
