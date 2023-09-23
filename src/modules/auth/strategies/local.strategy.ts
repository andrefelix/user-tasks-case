import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { MESSAGE } from 'src/helpers/message';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'userName' });
  }

  async validate(userName: string, password: string) {
    const user = await this.authService.validateUser({ userName, password });

    if (!user) {
      throw new UnauthorizedException(MESSAGE.invalidAuthentication);
    }

    return user;
  }
}
