import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { HourSchemeModule } from '@hour-master/backend/features/hour-scheme';
import { UserModule } from '@hour-master/backend/user';
import { AuthModule } from '@hour-master/backend/auth';
import { DataSeederModule } from '@hour-master/backend/data-seeder';
import { ProjectModule } from '@hour-master/backend/features/project';
import { MongooseModule } from '@nestjs/mongoose';
import { MachineModule } from '@hour-master/backend/features/machine';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI') ||
          'mongodb://127.0.0.1:27017/hour-master',
      }),
    }),
    AuthModule,
    UserModule,
    ProjectModule,
    MachineModule,
    HourSchemeModule,
    DataSeederModule,
  ],
})
export class AppModule {}
