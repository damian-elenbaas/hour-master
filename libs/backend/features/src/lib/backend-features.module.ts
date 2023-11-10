import { Module } from '@nestjs/common';
import { HourSchemeController } from './hour-scheme/hour-scheme.controller';
import { HourSchemeService } from './hour-scheme/hour-scheme.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  controllers: [
    HourSchemeController,
    UserController
  ],
  providers: [
    HourSchemeService,
    UserService
  ],
  exports: [HourSchemeService],
})
export class BackendFeaturesModule {}
