import { Module } from '@nestjs/common';
import { HourSchemeController } from './hour-scheme/hour-scheme.controller';
import { HourSchemeService } from './hour-scheme/hour-scheme.service';

@Module({
  controllers: [
    HourSchemeController
  ],
  providers: [
    HourSchemeService,
  ],
  exports: [HourSchemeService],
})
export class BackendFeaturesModule {}
