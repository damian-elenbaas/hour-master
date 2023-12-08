import { Controller, Get, Logger, Param } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { Id, UserRole } from '@hour-master/shared/api';
import { Roles } from '@hour-master/backend/decorators';

@Controller('recommendations')
export class RecommendationsController {
  private readonly logger = new Logger(RecommendationsController.name);

  constructor(
    private readonly recommendationsService: RecommendationsService
  ) {}

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

  @Get('project/most-worked-on')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getMostWorkedOn() {
    return await this.recommendationsService.getMostWorkedOnProject();
  }
}
