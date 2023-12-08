import { Module } from '@nestjs/common';

import { AuthModule } from '@hour-master/backend/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RecommendationsModule } from '@hour-master/backend/recommendations';
import { MongooseModule } from '@nestjs/mongoose';

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
    RecommendationsModule,
  ],
})
export class AppModule {}
