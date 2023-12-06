import { Module } from '@nestjs/common';
import { DataSeederService } from './data-seeder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HourSchemeSchema } from '@hour-master/backend/features/hour-scheme';
import { UserSchema } from '@hour-master/backend/user';
import { ProjectSchema } from '@hour-master/backend/features/project';
import { MachineSchema } from '@hour-master/backend/features/machine';
import { RecommendationsModule } from '@hour-master/backend/recommendations';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HourScheme', schema: HourSchemeSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Machine', schema: MachineSchema },
    ]),
    RecommendationsModule
  ],
  controllers: [],
  providers: [DataSeederService],
  exports: [DataSeederService],
})
export class DataSeederModule {}
