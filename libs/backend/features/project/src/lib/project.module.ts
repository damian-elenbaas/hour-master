import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema } from './schemas/project.schema';
import { UserSchema } from '@hour-master/backend/user';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Project', schema: ProjectSchema },
      // WARN: Temp for seeding fake data
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
