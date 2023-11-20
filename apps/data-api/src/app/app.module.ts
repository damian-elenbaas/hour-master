import { Module } from '@nestjs/common';

import { BackendFeaturesModule } from '@hour-master/backend/features';
import { UserModule } from '@hour-master/backend/user';

@Module({
  imports: [
    BackendFeaturesModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
