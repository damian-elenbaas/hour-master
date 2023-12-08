import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule, UserSchema } from '@hour-master/backend/user';
import { RecommendationsModule } from '@hour-master/backend/recommendations';

import { ProjectController } from './project/project.controller';
import { HourSchemeController } from './hour-scheme/hour-scheme.controller';
import { MachineController } from './machine/machine.controller';
import { HourSchemeSchema } from './hour-scheme/schemas/hour-scheme.schema';
import { ProjectSchema } from './project/schemas/project.schema';
import { MachineSchema } from './machine/schemas/machine.schema';
import { ProjectService } from './project/project.service';
import { MachineService } from './machine/machine.service';
import { HourSchemeService } from './hour-scheme/hour-scheme.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HourScheme', schema: HourSchemeSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Machine', schema: MachineSchema },
      { name: 'User', schema: UserSchema },
    ]),
    RecommendationsModule,
    UserModule
  ],
  controllers: [
    HourSchemeController,
    ProjectController,
    MachineController
  ],
  providers: [
    HourSchemeService,
    ProjectService,
    MachineService
  ],
  exports: [
    HourSchemeService,
    ProjectService,
    MachineService
  ],
})
export class FeaturesModule {}
