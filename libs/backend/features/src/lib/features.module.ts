import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { UserSchema } from './user/schemas/user.schema';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HourScheme', schema: HourSchemeSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Machine', schema: MachineSchema },
      { name: 'User', schema: UserSchema },
    ]),
    RecommendationsModule,
  ],
  controllers: [
    HourSchemeController,
    ProjectController,
    MachineController,
    UserController
  ],
  providers: [
    HourSchemeService,
    ProjectService,
    MachineService,
    UserService
  ],
  exports: [
    HourSchemeService,
    ProjectService,
    MachineService,
    UserService
  ],
})
export class FeaturesModule {}
