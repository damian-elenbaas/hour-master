import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@hour-master/backend/user';
import { ISignInResult } from '@hour-master/shared/api';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<ISignInResult> {
    const user = await this.userService.findOneByUsername(username);

    this.logger.log(`username: ${username} trying to authenticate...`);

    if (!await this.userService.validatePassword(pass, user.password as string )) {
      throw new UnauthorizedException();
    }

    // Filter out password from user object
    user.password = undefined;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = { sub: user._id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }
}
