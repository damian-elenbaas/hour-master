import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schemas/project.schema';
import { RecommendationsModule } from '@hour-master/backend/recommendations';
import { HourSchemeModule, HourSchemeSchema } from '@hour-master/backend/features/hour-scheme';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'HourScheme', schema: HourSchemeSchema },
      { name: 'Project', schema: ProjectSchema },
    ]),
    RecommendationsModule,
    HourSchemeModule
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
