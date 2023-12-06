import { Module } from '@nestjs/common';
import { HourSchemeController } from './hour-scheme.controller';
import { HourSchemeService } from './hour-scheme.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HourSchemeSchema } from './schemas/hour-scheme.schema';
import { UserSchema } from '@hour-master/backend/user';
import { ProjectSchema } from '@hour-master/backend/features/project';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HourScheme', schema: HourSchemeSchema },
      // WARN: Temp for seeding fake data
      { name: 'User', schema: UserSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
  ],
  controllers: [HourSchemeController],
  providers: [HourSchemeService],
  exports: [HourSchemeService],
})
export class HourSchemeModule {}
