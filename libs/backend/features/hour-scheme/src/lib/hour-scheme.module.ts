import { Module } from '@nestjs/common';
import { HourSchemeController } from './hour-scheme.controller';
import { HourSchemeService } from './hour-scheme.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HourSchemeSchema } from './schemas/hour-scheme.schema';
import { RecommendationsModule } from '@hour-master/backend/recommendations';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HourScheme', schema: HourSchemeSchema },
    ]),
    RecommendationsModule
  ],
  controllers: [HourSchemeController],
  providers: [HourSchemeService],
  exports: [HourSchemeService],
})
export class HourSchemeModule {}
