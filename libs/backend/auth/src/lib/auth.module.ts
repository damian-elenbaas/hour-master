import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '@hour-master/environments';


@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '3600s' },
    })
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuthModule {}
