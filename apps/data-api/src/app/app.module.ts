import { Module } from '@nestjs/common';

import { BackendFeaturesModule } from '@hour-master/backend/features';

@Module({
  imports: [BackendFeaturesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
