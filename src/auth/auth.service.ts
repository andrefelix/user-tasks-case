import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Encryptor } from 'src/helpers/encryptor';
import { UsersEntity } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string) {
    const user = await this.userService.findOne({
      where: { userName },
      select: { id: true, userName: true, password: true },
    });

    if (!user || !Encryptor.compareSync(password, user.password)) {
      return null;
    }

    return user;
  }

  async login(user: UsersEntity) {
    const payload = { sub: user.id, userName: user.userName };

    return { token: this.jwtService.sign(payload) };
  }
}
