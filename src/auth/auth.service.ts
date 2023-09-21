import { Injectable } from '@nestjs/common';
import { compare } from 'src/helpers/encryptation';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(userName: string, password: string) {
    const user = await this.userService.findOne({
      where: { userName },
      select: { id: true, userName: true, password: true },
    });

    if (!user || !compare(user.password, password)) {
      return null;
    }

    return user;
  }
}
