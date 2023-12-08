import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { UserModule } from '@hour-master/backend/user';
import { AuthModule } from '@hour-master/backend/auth';
import { DataSeederModule } from '@hour-master/backend/data-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import { FeaturesModule } from '@hour-master/backend/features';

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
    FeaturesModule,
    DataSeederModule,
  ],
})
export class AppModule {}
