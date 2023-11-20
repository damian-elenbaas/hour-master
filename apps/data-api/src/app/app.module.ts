import { Module } from '@nestjs/common';

import { HourSchemeModule } from '@hour-master/backend/features/hour-scheme';
import { UserModule } from '@hour-master/backend/user';

@Module({
  imports: [
    HourSchemeModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
