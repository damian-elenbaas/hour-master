import { Module } from '@nestjs/common';
import { HourSchemeController } from './hour-scheme.controller';
import { HourSchemeService } from './hour-scheme.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HourSchemeSchema } from './schemas/hour-scheme.schema';
import { ProjectSchema } from '@hour-master/backend/features/project';
import { MachineSchema } from '@hour-master/backend/features/machine';
import { RecommendationsModule } from '@hour-master/backend/recommendations';
import { UserSchema } from '@hour-master/backend/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HourScheme', schema: HourSchemeSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Machine', schema: MachineSchema },
      { name: 'User', schema: UserSchema },
    ]),
    RecommendationsModule
  ],
  controllers: [HourSchemeController],
  providers: [HourSchemeService],
  exports: [HourSchemeService],
})
export class HourSchemeModule {}
