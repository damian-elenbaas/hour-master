import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MachineSchema } from './schemas/machine.schema';
import { RecommendationsModule } from '@hour-master/backend/recommendations';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Machine', schema: MachineSchema }]),
    RecommendationsModule
  ],
  controllers: [MachineController],
  providers: [MachineService],
  exports: [MachineService],
})
export class MachineModule {}
