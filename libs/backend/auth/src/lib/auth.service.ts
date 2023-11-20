import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@hour-master/backend/user';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string) {
    const user = this.userService.findOneByUsername(username);

    this.logger.log(`username: ${username} trying to authenticate...`);

    if (!await this.userService.validatePassword(pass, user.password as string )) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
