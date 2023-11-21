import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { HourSchemeModule } from '@hour-master/backend/features/hour-scheme';
import { UserModule } from '@hour-master/backend/user';
import { AuthModule } from '@hour-master/backend/auth';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule
      .forRoot(
        String(
          process.env.MONGO_URI ||
          'mongodb://127.0.0.1:27017/hour-master'
        )
      ),
    HourSchemeModule,
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
